import {
  rmSync,
  mkdirSync,
  existsSync,
  copyFileSync,
  writeFileSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { type Plugin, defineConfig, normalizePath } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import { notBundle } from "vite-plugin-electron/plugin";
import pkg from "./package.json";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  rmSync("dist-electron", { recursive: true, force: true });
  const isServe = command === "serve";
  const isBuild = command === "build";
  const sourcemap = isServe || !!process.env.VSCODE_DEBUG;
  return {
    plugins: [
      vue(),
      electron([
        {
          entry: "electron/main/index.ts",
          onstart({ startup }) {
            if (process.env.VSCODE_DEBUG) {
              console.log("[startup] Electron App");
            } else {
              startup();
            }
          },
          vite: {
            build: {
              sourcemap,
              minify: isBuild,
              outDir: "dist-electron/main",
              commonjsOptions: {
                ignoreDynamicRequires: true,
              },
              rollupOptions: {
                external: [],
              },
            },
            plugins: [isServe && notBundle()],
          },
        },
        {
          entry: "electron/preload/index.ts",
          onstart({ reload }) {
            reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : undefined,
              minify: isBuild,
              outDir: "dist-electron/preload",
              rollupOptions: {
                external: [],
              },
            },
            plugins: [isServe && notBundle()],
          },
        },
        {
          entry: "electron/main/worker.ts",
          onstart({ reload }) {
            reload();
          },
          vite: {
            build: {
              sourcemap: sourcemap ? "inline" : undefined,
              minify: isBuild,
              outDir: "dist-electron/main",
              commonjsOptions: {
                ignoreDynamicRequires: true,
              },
              rollupOptions: {
                external: [],
              },
            },
            plugins: [isServe && notBundle()],
          },
        },
      ]),
      // 在所有模式下都执行 bindingSqlite3 插件，确保 native 目录中有 better_sqlite3.node 文件
      bindingSqlite3(),
    ],
    optimizeDeps: {
      // 忽略 better-sqlite3-multiple-ciphers，避免开发模式下的依赖问题
      exclude: ['better-sqlite3-multiple-ciphers'],
    },
    server:
      process.env.VSCODE_DEBUG &&
      (() => {
        const url = new URL(pkg.debug.env.VITE_DEV_SERVER_URL);
        return {
          host: url.hostname,
          port: +url.port,
        };
      })(),
    clearScreen: false,
  };
});

function bindingSqlite3(
  options: {
    output?: string;
    better_sqlite3_node?: string;
    command?: string;
  } = {}
): Plugin {
  const TAG = "[vite-plugin-binding-sqlite3]";
  options.output ??= "native";
  options.better_sqlite3_node ??= "better_sqlite3.node";
  options.command ??= "build";

  return {
    name: "vite-plugin-binding-sqlite3",
    config(config) {
      // https://github.com/vitejs/vite/blob/v4.4.9/packages/vite/src/node/config.ts#L496-L499
      const resolvedRoot = normalizePath(
        config.root ? resolve(config.root) : process.cwd()
      );
      const output = resolve(resolvedRoot, options.output);
      
      // 确保 native 目录存在
      if (!existsSync(output)) {
        mkdirSync(output, { recursive: true });
      }
      
      // 尝试从多个位置寻找 better_sqlite3.node 文件
      const better_sqlite3 = require.resolve("better-sqlite3-multiple-ciphers");
      const better_sqlite3_root = join(
        better_sqlite3.slice(0, better_sqlite3.lastIndexOf("node_modules")),
        "node_modules/better-sqlite3-multiple-ciphers"
      );
      
      // 可能的 better_sqlite3.node 文件位置
      const possiblePaths = [
        // 标准构建路径
        join(better_sqlite3_root, "build/Release", options.better_sqlite3_node),
        // electron-rebuild 可能生成的路径
        join(better_sqlite3_root, "build", options.better_sqlite3_node),
        // 直接在模块根目录寻找
        join(better_sqlite3_root, options.better_sqlite3_node),
        // 从 node_modules/.electron-* 目录寻找
        join(better_sqlite3_root, "..", `.electron-*`, "build/Release", options.better_sqlite3_node)
      ];
      
      let better_sqlite3_node = null;
      for (const path of possiblePaths) {
        if (existsSync(path)) {
          better_sqlite3_node = path;
          break;
        }
      }
      
      // 如果找到了 better_sqlite3.node 文件，就复制到 native 目录
      if (better_sqlite3_node) {
        const better_sqlite3_copy = join(output, options.better_sqlite3_node);
        copyFileSync(better_sqlite3_node, better_sqlite3_copy);
        /** `native/better_sqlite3.node` */
        const BETTER_SQLITE3_BINDING = better_sqlite3_copy.replace(
          resolvedRoot + "/",
          ""
        );
        writeFileSync(
          join(resolvedRoot, ".env"),
          `VITE_BETTER_SQLITE3_BINDING=${BETTER_SQLITE3_BINDING}`
        );
        console.log(TAG, `binding to ${BETTER_SQLITE3_BINDING}`);
      } else {
        // 如果找不到 better_sqlite3.node 文件，就跳过复制步骤
        console.warn(TAG, "Can not found better_sqlite3.node, skipping binding step.");
        // 创建一个空的 .env 文件，避免后续操作出错
        writeFileSync(
          join(resolvedRoot, ".env"),
          `VITE_BETTER_SQLITE3_BINDING=native/${options.better_sqlite3_node}`
        );
      }
    },
  };
}
