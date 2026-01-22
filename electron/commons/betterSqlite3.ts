import { join, dirname } from "node:path";
import { existsSync } from "node:fs";
import Database from "better-sqlite3-multiple-ciphers";
import { getUserDataPath } from "../main/commons";

let database: Database.Database;
let cacheDatabase: Database.Database;

/**
 * 智能查找 better_sqlite3.node 文件路径
 * @returns 正确的 better_sqlite3.node 文件路径
 */
function findNativeBinding(): string {
  // 从环境变量获取默认路径
  const envBindingPath = import.meta.env.VITE_BETTER_SQLITE3_BINDING;
  const basePath = process.env.NODE_ENV !== "development" ? dirname(process.execPath) : "";
  
  console.log(`
=== 开始查找 better_sqlite3.node 文件 ===`);
  console.log(`环境变量 VITE_BETTER_SQLITE3_BINDING: ${envBindingPath}`);
  console.log(`basePath: ${basePath}`);
  
  // 尝试直接不指定 nativeBinding，让 Database 构造函数自己查找
  try {
    console.log(`尝试 1: 直接创建 Database 实例，不指定 nativeBinding`);
    const testDbPath = join(getUserDataPath(), "TestFindNative.db");
    const testDb = new Database(testDbPath);
    testDb.close();
    // 删除测试数据库文件
    const { unlinkSync } = require("node:fs");
    unlinkSync(testDbPath);
    console.log(`✅ 成功: Database 构造函数能够自动找到 better_sqlite3.node 文件`);
    // 返回一个空字符串，告诉调用者不需要指定 nativeBinding
    return "";
  } catch (error) {
    console.log(`❌ 失败: ${error.message}`);
  }
  
  // 可能的 better_sqlite3.node 文件位置
  const possiblePaths = [
    // 1. 尝试使用环境变量指定的路径
    join(basePath, envBindingPath),
    // 2. 尝试从 better-sqlite3-multiple-ciphers 模块目录寻找
    ...(() => {
      try {
        const betterSqlite3Path = require.resolve("better-sqlite3-multiple-ciphers");
        const betterSqlite3Root = dirname(betterSqlite3Path).replace(/lib$/, "");
        console.log(`better-sqlite3-multiple-ciphers 模块根目录: ${betterSqlite3Root}`);
        return [
          join(betterSqlite3Root, "build/Release/better_sqlite3.node"),
          join(betterSqlite3Root, "build/Debug/better_sqlite3.node"),
          join(betterSqlite3Root, "build/better_sqlite3.node"),
          join(betterSqlite3Root, "better_sqlite3.node"),
          // 添加更多可能的路径
          join(betterSqlite3Root, "node_modules", "better-sqlite3-multiple-ciphers", "build/Release/better_sqlite3.node"),
        ];
      } catch (error) {
        console.log(`❌ 获取 better-sqlite3-multiple-ciphers 模块路径失败: ${error.message}`);
        return [];
      }
    })(),
    // 3. 尝试从当前工作目录寻找
    join(process.cwd(), "native", "better_sqlite3.node"),
    join(process.cwd(), "build", "Release", "better_sqlite3.node"),
    join(process.cwd(), "better_sqlite3.node"),
  ];
  
  // 尝试每个可能的路径，返回第一个存在的路径
  console.log(`\n=== 尝试的路径列表 ===`);
  for (const path of possiblePaths) {
    console.log(`检查路径: ${path}`);
    if (existsSync(path)) {
      console.log(`✅ 找到 better_sqlite3.node at: ${path}`);
      return path;
    }
    console.log(`❌ 不存在`);
  }
  
  // 如果都找不到，就返回一个空字符串，让 Database 构造函数自己处理
  console.warn(`\n=== 所有路径都找不到 better_sqlite3.node 文件 ===`);
  console.warn(`使用默认行为，让 Database 构造函数自己寻找`);
  return "";
}

function getDataSqlite3() {
  let filename = join(getUserDataPath(), "Data.db");
  database ??= (() => {
    const nativeBinding = findNativeBinding();
    if (nativeBinding) {
      console.log(`使用指定的 nativeBinding 路径: ${nativeBinding}`);
      return new Database(filename, {
        nativeBinding,
      });
    } else {
      console.log(`不指定 nativeBinding，使用 Database 构造函数的默认行为`);
      return new Database(filename);
    }
  })();
  return database;
}

function getCacheDataSqlite3() {
  let filename = join(getUserDataPath(), "CacheData.db");
  cacheDatabase ??= (() => {
    const nativeBinding = findNativeBinding();
    if (nativeBinding) {
      console.log(`使用指定的 nativeBinding 路径: ${nativeBinding}`);
      return new Database(filename, {
        nativeBinding,
      });
    } else {
      console.log(`不指定 nativeBinding，使用 Database 构造函数的默认行为`);
      return new Database(filename);
    }
  })();
  return cacheDatabase;
}

function getCustomDataSqlite3(filePath: string) {
  const nativeBinding = findNativeBinding();
  if (nativeBinding) {
    console.log(`使用指定的 nativeBinding 路径: ${nativeBinding}`);
    return new Database(filePath, {
      nativeBinding,
    });
  } else {
    console.log(`不指定 nativeBinding，使用 Database 构造函数的默认行为`);
    return new Database(filePath);
  }
}

export { getDataSqlite3, getCacheDataSqlite3, getCustomDataSqlite3 };
