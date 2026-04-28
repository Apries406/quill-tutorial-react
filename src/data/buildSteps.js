export const buildSteps = [
  {
    key: 'init',
    label: '初始编辑器',
    icon: 'BuildOutlined',
    group: 'basic',
    learningGoal: '理解 contenteditable 的基础和问题',
    demo: 'InitDemo',
    prevKey: null,
    nextKey: 'delta',
  },
  {
    key: 'delta',
    label: 'Delta 模型',
    icon: 'BulbOutlined',
    group: 'basic',
    learningGoal: '掌握 Delta 格式的三种操作：insert、delete、retain',
    demo: 'DeltaDemo',
    prevKey: 'init',
    nextKey: 'parchment',
  },
  {
    key: 'parchment',
    label: 'Blot 系统',
    icon: 'BlockOutlined',
    group: 'basic',
    learningGoal: '理解 Blot 抽象：TextBlot、InlineBlot、BlockBlot',
    demo: 'ParchmentDemo',
    prevKey: 'delta',
    nextKey: 'renderer',
  },
  {
    key: 'renderer',
    label: '渲染器',
    icon: 'CodeOutlined',
    group: 'basic',
    learningGoal: '实现 Delta → DOM 的转换',
    demo: 'RendererDemo',
    prevKey: 'parchment',
    nextKey: 'selection',
  },
  {
    key: 'selection',
    label: '选区管理',
    icon: 'ExperimentOutlined',
    group: 'basic',
    learningGoal: '连接用户选区与字符索引',
    demo: 'SelectionDemo',
    prevKey: 'renderer',
    nextKey: 'formatter',
  },
  {
    key: 'formatter',
    label: '格式化',
    icon: 'EditOutlined',
    group: 'basic',
    learningGoal: '修改 Delta attributes 实现文本格式化',
    demo: 'FormatterDemo',
    prevKey: 'selection',
    nextKey: 'editor',
  },
  {
    key: 'editor',
    label: '完整编辑器',
    icon: 'BuildOutlined',
    group: 'basic',
    learningGoal: '组合所有模块，打造可用的编辑器',
    demo: 'EditorDemo',
    prevKey: 'formatter',
    nextKey: 'delta-compose',
  },
  {
    key: 'divider',
    label: '─── 进阶 ───',
    icon: null,
    group: 'advanced',
    disabled: true,
    prevKey: 'editor',
    nextKey: 'delta-compose',
  },
  {
    key: 'delta-compose',
    label: 'Delta 组合',
    icon: 'ThunderboltOutlined',
    group: 'advanced',
    learningGoal: '理解 compose：合并两个连续变更',
    demo: 'ComposeDemo',
    prevKey: 'divider',
    nextKey: 'delta-transform',
  },
  {
    key: 'delta-transform',
    label: 'Delta 转换',
    icon: 'ThunderboltOutlined',
    group: 'advanced',
    learningGoal: '理解 transform：解决协作编辑冲突',
    demo: 'TransformDemo',
    prevKey: 'delta-compose',
    nextKey: null,
  },
]

export const stepGroups = {
  basic: {
    label: '基础',
    description: '从零开始，一步步构建编辑器核心',
  },
  advanced: {
    label: '进阶',
    description: '深入理解 Delta 高级操作',
  },
}

export const getActiveSteps = () => buildSteps.filter(s => !s.disabled)

export const getStepIndex = (key) => {
  const activeSteps = getActiveSteps()
  return activeSteps.findIndex(s => s.key === key)
}

export const getTotalSteps = () => getActiveSteps().length

export const getProgressPercent = (key) => {
  const activeSteps = getActiveSteps()
  const index = activeSteps.findIndex(s => s.key === key)
  return Math.round(((index + 1) / activeSteps.length) * 100)
}
