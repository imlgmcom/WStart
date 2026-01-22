# 简体中文 | [English](https://github.com/fanchenio/DawnLauncher/blob/main/README-ENGLISH.md)

# Wstart

`Windows`快捷启动工具，帮助您整理杂乱无章的桌面，分门别类管理您的桌面快捷方式，让您的桌面保持干净整洁。

**重要声明**：Wstart 是开源软件 Dawn Launcher 的改版，基于 Dawn Launcher 开发。

**官方链接**：https://dawnlauncher.com/

## 新增功能

1. 背景图支持远程图片自动保存到本地
2. 背景图预览功能改进，支持自动调整尺寸
3. 封面图布局边框增强，提升视觉层次感
4. 完善的背景图保存逻辑，避免重复保存和旧文件积累
5. 修复了项目保存时主窗口最小化问题
6. 完善了语言键，修复了设置页面选项显示问题
7. 改进了远程封面图保存时的前台渲染问题
8. 优化了背景图路径处理，支持多种路径格式

## 核心功能

支持关联文件夹（实时同步文件夹内容）、快速搜索、相对路径（便携路径）、扫描本机开始菜单、本地扫描本机 Appx 应用列表、添加网址并一键获取网址信息。

# 技术栈

`Electron + Vite + Vue3 + TS + Rust`

# 支持平台

`Windows(10/11)`

# 编译步骤

1. 安装`node-gyp`，编译 SQLite3 需要。
2. 安装`Rust`环境 + `Cargo`，编译 Rust 需要。
3. 然后运行`yarn install`安装项目依赖（如果修改了`Rust`代码也需要重新运行`yarn install`）。
4. `yarn run dev`本地运行项目。
5. `yarn run build`打包项目。
6. 便携版和安装版需要分两次打包，通过修改`.env.production`中的`VITE_INSTALL`，`true`为安装版，`false`为便携版。

# 官网

[dawnlauncher.com](https://dawnlauncher.com/)

# QQ 群

369652112

# 界面

![界面](/images/soft1.png)

## 子分类

![子分类](/images/soft2.png)

## 自定义主题

![自定义主题](/images/soft3.png)

## 自定义背景

![自定义背景](/images/soft4.png)

## 快速搜索

![快速搜索](/images/soft5.png)

## 一键获取网址信息

![一键获取网址信息](/images/soft6.webp)

## 相对路径（便携路径）

![相对路径（便携路径）](/images/soft7.png)

## 关联文件夹

![关联文件夹](/images/soft8.webp)

## Stargazers over time

[![Stargazers over time](https://starchart.cc/fanchenio/DawnLauncher.svg)](https://starchart.cc/fanchenio/DawnLauncher)

## License

MIT License
