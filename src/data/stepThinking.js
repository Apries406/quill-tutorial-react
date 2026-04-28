export const stepThinking = {
  init: `我们从最基础的 HTML 开始：一个可编辑的 div。

**contenteditable** 是浏览器原生的富文本编辑能力，但它有致命问题：
- 不同浏览器产生不同的 HTML
- 无法精确追踪变更
- 难以实现协作编辑

所以我们的策略是：**用 contenteditable 处理输入，但维护自己的数据模型**。`,

  delta: `现在我们定义自己的数据格式。

**Delta** 是 Quill 的核心创新：用 JSON 表示富文本。

关键设计：
- 只有三种操作：insert、delete、retain
- 属性用 attributes 对象表示
- 文档 = 从空文档开始执行所有操作
- **规范性**：相同内容只有一种表示`,

  parchment: `**Parchment** 是 Quill 的文档模型，我们实现一个简化版。

核心概念：**Blot（墨迹）** = DOM 节点的抽象

我们定义 3 种 Blot：
- **TextBlot**: 纯文本
- **InlineBlot**: 行内格式（加粗、斜体）
- **BlockBlot**: 块级元素（段落）

每种 Blot 知道如何创建 DOM 节点。`,

  renderer: `现在实现最关键的一步：把 Delta 渲染成 DOM。

渲染逻辑：
1. 清空容器
2. 创建第一个段落
3. 遍历 Delta 的 ops
4. insert 文本 → 创建 DOM 节点
5. 有 attributes → 应用格式
6. 遇到 \\n → 创建新段落`,

  selection: `选区是编辑器的核心：用户选中内容 → 执行操作。

**浏览器选区** = DOM 节点 + 偏移量
**我们需要** = 字符索引

所以需要双向转换：
- DOM 位置 → 字符索引（syncFromDOM）
- 字符索引 → DOM 位置（syncToDOM）`,

  formatter: `格式化的本质：修改 Delta 中文本的 attributes。

例如加粗前 5 个字符：
- 原始: \`[{ insert: 'Hello World\\n' }]\`
- 结果: \`[{ insert: 'Hello', attributes: { bold: true } }, { insert: ' World\\n' }]\`

**关键：这是纯数据操作，不涉及 DOM**`,

  editor: `最后一步：把所有模块组合成一个完整的编辑器。

添加：
1. **DOM → Delta 同步**：监听输入，更新数据
2. **历史记录**：撤销/重做
3. **完整的快捷键支持**`,

  'delta-compose': `**compose** = 合并两个连续的变更

场景：用户执行了多个操作，我们想合并成一个

原始: "Hello"
操作 1: 在末尾加 " World" → retain(5).insert(' World')
操作 2: 在末尾加 "!" → retain(11).insert('!')
合并: retain(5).insert(' World!')`,

  'delta-transform': `**transform** = 解决并发编辑冲突

场景：两个人同时编辑同一文档

文档："Hello"
用户 A：在位置 5 插入 " World"
用户 B：在位置 5 插入 "!"

transform 告诉我们：B 相对于 A，应该如何调整`,
}
