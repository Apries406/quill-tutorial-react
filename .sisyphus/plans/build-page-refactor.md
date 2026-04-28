# BuildPage 重构计划：让「从零构建」更易学、易读

## 目标

将 1770 行的 BuildPage.jsx 重构为渐进式学习体验，增强：
- **易读性**：代码模块化，职责清晰
- **易学性**：渐进式步骤设计 + 步内小节导航，学习曲线平滑
- **可维护性**：数据与视图分离，便于更新内容

---

## 已完成的重构

### ✅ Phase 1-4: 数据分离、组件拆分、CodeBlock 增强、UX 增强
- 创建 `src/data/buildSteps.js` - 步骤配置数据
- 创建 `src/data/stepThinking.js` - 各步骤设计思路
- 创建 `src/data/stepSections.js` - **步内小节数据（新增）**
- 拆分 6 个 Demo 组件到 `src/components/build/demos/`
- 创建 `StepNav`、`StepContent`、`StepThinking`、`StepNavigation` 组件
- 增强 CodeBlock：复制按钮、语言标签

### ✅ Phase 5: BuildPage.jsx 简化为 75 行

### ✅ Phase 6: 构建验证通过

---

## 验收标准达成情况

1. ✅ BuildPage.jsx 从 1770 行减少到 **75 行**
2. ✅ 每个 Demo 组件独立文件
3. ✅ 侧边栏显示进度和分组
4. ✅ 支持键盘 ← → 切换步骤
5. ✅ 代码块有复制按钮
6. ✅ 所有现有功能正常工作

---

## 新增：步内小节导航

### 设计方案
每个步骤（step）包含多个小节（sections），通过 **Tab 切换**展示：

```
步骤 3: Blot 系统
├── 小节 1: TextBlot        (纯文本节点)
├── 小节 2: InlineBlot      (行内格式)
├── 小节 3: BlockBlot       (块级节点)
└── 小节 4: Registry        (注册表)
```

### 数据结构
```js
// src/data/stepSections.js
export const stepSections = {
  init: [
    { title: 'HTML 结构', desc: '编辑器的 HTML 骨架', code: '...' },
    { title: 'CSS 样式', desc: '编辑器和输出区域的样式', code: '...' },
    { title: 'JavaScript 初始化', desc: '最基础的编辑器类', code: '...' },
  ],
  delta: [...],
  // ...
}
```

### 组件
- `StepSections.jsx` - 使用 Ant Design Tabs 实现小节切换
- 单小节时直接展示，多小节时显示 Tab 切换

---

## 目录结构

```
src/
├── data/
│   ├── buildSteps.js      # 步骤配置（导航元数据）
│   ├── stepThinking.js    # 各步骤设计思路
│   └── stepSections.js    # 步内小节数据
├── components/
│   ├── build/
│   │   ├── StepNav.jsx          # 侧边导航 + 进度条
│   │   ├── StepContent.jsx      # 内容渲染器
│   │   ├── StepThinking.jsx     # 设计思路卡片
│   │   ├── StepNavigation.jsx  # 上一步/下一步
│   │   ├── StepSections.jsx     # 小节 Tab 导航
│   │   └── demos/               # Demo 组件
│   │       ├── InitDemo.jsx
│   │       ├── DeltaDemo.jsx
│   │       └── ...
│   └── CodeBlock.jsx      # 增强版（复制按钮 + 语言标签）
└── pages/
    └── BuildPage.jsx     # ~75行，简化为布局 + 数据绑定
```

---

## 剩余工作

无。重构计划已完成。

---

## 学习路径

### 基础部分（8 步）
1. **初始编辑器** - contenteditable 基础
2. **Delta 模型** - insert/delete/retain
3. **Blot 系统** - TextBlot/InlineBlot/BlockBlot
4. **渲染器** - Delta → DOM
5. **选区管理** - 浏览器选区与字符索引
6. **格式化** - 修改 Delta attributes
7. **完整编辑器** - 组合所有模块
8. **─── 进阶 ───**
9. **Delta 组合** - compose 合并变更
10. **Delta 转换** - transform 协作冲突
