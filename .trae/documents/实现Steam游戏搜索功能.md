# 实现Steam游戏搜索功能

## 1. 后端实现

### 1.1 添加Steam游戏搜索函数
- 在 `electron/main/commons/index.ts` 文件中添加 `searchSteamGames` 函数
- 使用Steam Store API搜索游戏：`https://store.steampowered.com/api/storesearch/`
- 处理API响应，提取游戏ID、名称和图标信息
- 实现错误处理和重试机制

### 1.2 注册IPC事件
- 在 `electron/main/commons/ipcEvent.ts` 中注册 `searchSteamGames` 事件
- 处理来自前端的搜索请求
- 调用 `searchSteamGames` 函数并返回结果

## 2. 前端实现

### 2.1 添加搜索按钮
- 在 `src/pages/item/AddEdit.vue` 中的背景图设置区域添加搜索按钮
- 按钮标签："搜索Steam游戏"

### 2.2 创建搜索窗口组件
- 创建新组件 `src/pages/item/components/SteamGameSearch.vue`
- 包含游戏名称输入框和搜索按钮
- 显示搜索结果列表，包含游戏名称和图标
- 实现搜索结果的选择功能

### 2.3 实现搜索逻辑
- 在 `AddEdit.vue` 中添加搜索窗口的打开/关闭逻辑
- 实现搜索请求的发送和结果的处理
- 当用户选择游戏后，自动填充对应的Steam图片URL

## 3. 数据流程

### 3.1 搜索流程
1. 用户点击"搜索Steam游戏"按钮
2. 弹出搜索窗口
3. 用户输入游戏名称并点击搜索
4. 前端发送搜索请求到后端
5. 后端调用Steam API搜索游戏
6. 后端返回搜索结果到前端
7. 前端显示搜索结果列表

### 3.2 选择流程
1. 用户从搜索结果中选择一个游戏
2. 前端获取选中游戏的ID
3. 前端生成Steam图片URL：`https://shared.st.dl.eccdnx.com/store_item_assets/steam/apps/{gameId}/header.jpg`
4. 前端自动填充背景图输入框
5. 关闭搜索窗口

## 4. 技术要点

### 4.1 API调用
- 使用现有的 `request` 库发送HTTP请求
- 实现请求超时和重试机制
- 处理API响应的解析和错误处理

### 4.2 前端设计
- 使用Naive UI组件库构建搜索窗口
- 实现响应式布局，确保在不同窗口尺寸下正常显示
- 添加加载状态和错误提示

### 4.3 性能优化
- 实现搜索节流，避免频繁API调用
- 缓存搜索结果，减少重复请求
- 优化搜索结果的渲染性能

## 5. 测试

### 5.1 功能测试
- 测试不同游戏名称的搜索结果
- 验证搜索结果的准确性
- 测试游戏选择后的URL生成
- 验证背景图的正确显示

### 5.2 边界测试
- 测试空搜索词的处理
- 测试不存在的游戏名称
- 测试API请求失败的情况
- 测试网络连接问题的处理

## 6. 预期效果

用户可以通过以下步骤设置Steam游戏背景图：
1. 在背景图输入框旁点击"搜索Steam游戏"按钮
2. 在弹出的搜索窗口中输入游戏名称（如"Counter-Strike"）
3. 从搜索结果中选择对应的游戏
4. 系统自动填充生成的Steam图片URL
5. 点击保存，完成背景图设置