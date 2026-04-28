import React, { useState, useRef, useEffect } from 'react'
import { Typography, Button, Tag, Divider, Menu, Alert } from 'antd'
import {
  BuildOutlined,
  CodeOutlined,
  BulbOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  BlockOutlined,
  EditOutlined,
  ExperimentOutlined,
  ThunderboltOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons'
import CodeBlock from '../components/CodeBlock'

const { Title, Text, Paragraph } = Typography

const steps = [
  { key: 'init', label: '初始编辑器', icon: <BuildOutlined /> },
  { key: 'delta', label: 'Delta 模型', icon: <BulbOutlined /> },
  { key: 'parchment', label: 'Blot 系统', icon: <BlockOutlined /> },
  { key: 'renderer', label: '渲染器', icon: <CodeOutlined /> },
  { key: 'selection', label: '选区管理', icon: <ExperimentOutlined /> },
  { key: 'formatter', label: '格式化', icon: <EditOutlined /> },
  { key: 'editor', label: '完整编辑器', icon: <BuildOutlined /> },
  { key: 'divider', label: '─── 进阶 ───', icon: null, disabled: true },
  { key: 'delta-compose', label: 'Delta 组合', icon: <ThunderboltOutlined /> },
  { key: 'delta-transform', label: 'Delta 转换', icon: <ThunderboltOutlined /> },
]

function InitDemo() {
  const [html, setHtml] = useState('<p>试试在这里输入...</p>')

  return (
    <div>
      <Paragraph>这是最基础的编辑器，使用浏览器原生的 <code>contenteditable</code>：</Paragraph>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong>编辑器</Text>
          <div
            contentEditable
            onInput={(e) => setHtml(e.currentTarget.innerHTML)}
            style={{
              padding: '16px',
              marginTop: '8px',
              background: 'white',
              border: '2px solid #2962ff',
              borderRadius: '8px',
              minHeight: '120px',
              outline: 'none',
              lineHeight: '1.7',
            }}
          >
            <p>试试在这里输入...</p>
          </div>
        </div>
        <div>
          <Text strong>浏览器生成的 HTML</Text>
          <CodeBlock code={html} language="html" />
        </div>
      </div>
      <Alert
        message="问题：我们无法控制浏览器生成什么 HTML"
        description="不同浏览器可能生成不同的标签（b vs strong），这导致无法精确追踪变更。"
        type="warning"
        showIcon
        style={{ marginTop: '16px' }}
      />
    </div>
  )
}

function DeltaDemo() {
  const [text, setText] = useState('Hello World')
  const [isBold, setIsBold] = useState(false)

  const delta = {
    ops: [
      ...(isBold
        ? [{ insert: text.split(' ')[0], attributes: { bold: true } }]
        : [{ insert: text.split(' ')[0] }]),
      { insert: ' ' },
      ...(text.includes(' ')
        ? [{ insert: text.split(' ').slice(1).join(' ') }]
        : []),
      { insert: '\n' },
    ],
  }

  return (
    <div>
      <Paragraph>体验 Delta 格式：输入文本，切换加粗，观察 Delta 变化</Paragraph>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '6px' }}
        />
        <Button
          type={isBold ? 'primary' : 'default'}
          onClick={() => setIsBold(!isBold)}
        >
          <strong>B</strong> 加粗第一个词
        </Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong>渲染效果</Text>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', marginTop: '8px', minHeight: '80px' }}>
            {isBold ? (
              <div><strong>{text.split(' ')[0]}</strong> {text.split(' ').slice(1).join(' ')}</div>
            ) : (
              <div>{text}</div>
            )}
          </div>
        </div>
        <div>
          <Text strong>Delta JSON</Text>
          <CodeBlock code={JSON.stringify(delta, null, 2)} language="json" />
        </div>
      </div>
    </div>
  )
}

function RendererDemo() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      const line1 = document.createElement('div')
      line1.style.padding = '4px 0'
      const strong = document.createElement('strong')
      strong.textContent = 'Hello'
      line1.appendChild(strong)
      line1.appendChild(document.createTextNode(' '))
      const em = document.createElement('em')
      em.textContent = 'World'
      em.style.color = '#e74c3c'
      line1.appendChild(em)
      containerRef.current.appendChild(line1)
      const line2 = document.createElement('div')
      line2.style.padding = '4px 0'
      line2.textContent = '这是第二段'
      containerRef.current.appendChild(line2)
    }
  }, [])

  return (
    <div>
      <Paragraph>渲染器将 Delta 转换为 DOM：</Paragraph>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong>输入：Delta</Text>
          <CodeBlock code={`{
  ops: [
    { insert: "Hello", attributes: { bold: true } },
    { insert: " " },
    { insert: "World", attributes: { italic: true, color: "#e74c3c" } },
    { insert: "\\n这是第二段\\n" }
  ]
}`} language="json" />
        </div>
        <div>
          <Text strong>输出：DOM</Text>
          <div ref={containerRef} style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', marginTop: '8px', minHeight: '80px' }} />
        </div>
      </div>
    </div>
  )
}

function SelectionDemo() {
  const [info, setInfo] = useState({ index: 0, length: 0, text: '-' })

  const handleSelect = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      setInfo({
        index: range.startOffset,
        length: selection.toString().length,
        text: selection.toString() || '-',
      })
    }
  }

  return (
    <div>
      <Paragraph>选区管理：选择文本，查看光标位置和选区长度</Paragraph>
      <div
        onMouseUp={handleSelect}
        onKeyUp={handleSelect}
        style={{
          padding: '16px',
          background: 'white',
          border: '2px solid #2962ff',
          borderRadius: '8px',
          cursor: 'text',
          userSelect: 'text',
          minHeight: '80px',
          lineHeight: '1.7',
        }}
      >
        这是一段测试文本，请选择部分内容来查看选区信息。选区包含两个关键数据：index（光标位置）和 length（选区长度）。
      </div>
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ padding: '12px', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1565c0' }}>{info.index}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>光标位置</div>
        </div>
        <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2e7d32' }}>{info.length}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>选区长度</div>
        </div>
        <div style={{ padding: '12px', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#e65100', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>选中文本</div>
        </div>
      </div>
    </div>
  )
}

function FormatterDemo() {
  const containerRef = useRef(null)

  return (
    <div>
      <Paragraph>格式化：选中文本，点击按钮应用格式</Paragraph>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <Button size="small" onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold') }}>
          <strong>B</strong> 加粗
        </Button>
        <Button size="small" onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic') }}>
          <em>I</em> 斜体
        </Button>
        <Button size="small" onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline') }}>
          <u>U</u> 下划线
        </Button>
      </div>
      <div
        ref={containerRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: '选择这段文本，然后点击上方按钮应用格式。格式化的本质是修改 Delta 中文本的 attributes。' }}
        style={{
          padding: '16px',
          background: 'white',
          border: '2px solid #2962ff',
          borderRadius: '8px',
          minHeight: '80px',
          outline: 'none',
          lineHeight: '1.7',
        }}
      />
    </div>
  )
}

function EditorDemo() {
  const [delta, setDelta] = useState([{ insert: '试试输入文字...\n' }])
  const containerRef = useRef(null)
  const [history, setHistory] = useState([[{ insert: '试试输入文字...\n' }]])
  const [historyIndex, setHistoryIndex] = useState(0)

  useEffect(() => { if (containerRef.current) containerRef.current.innerHTML = '<div>试试输入文字...</div>' }, [])

  const handleInput = () => {
    if (containerRef.current) {
      const newDelta = [{ insert: containerRef.current.innerText + '\n' }]
      setDelta(newDelta)
      const newHistory = [...history.slice(0, historyIndex + 1), newDelta]
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setDelta(history[newIndex])
      if (containerRef.current) containerRef.current.innerText = history[newIndex][0].insert.replace('\n', '')
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28ca41' }} />
        </div>
        <Text style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>Mini Quill Editor</Text>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <Button size="small" ghost style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }} onClick={handleUndo} disabled={historyIndex <= 0}>↩ 撤销</Button>
        </div>
      </div>
      <div style={{ padding: '8px 12px', background: '#f8f9fa', borderBottom: '1px solid #e0e0e0', display: 'flex', gap: '4px' }}>
        {['B', 'I', 'U', 'S'].map((btn) => (
          <div key={btn} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '13px', cursor: 'pointer' }}>{btn}</div>
        ))}
        <div style={{ width: '1px', background: '#d9d9d9', margin: '0 4px' }} />
        {['H1', 'H2', 'H3'].map((btn) => (
          <div key={btn} style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: '1px solid #d9d9d9', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>{btn}</div>
        ))}
      </div>
      <div
        ref={containerRef}
        contentEditable
        onInput={handleInput}
        style={{ padding: '20px', minHeight: '150px', outline: 'none', fontSize: '15px', lineHeight: '1.7' }}
      />
      <div style={{ padding: '12px 16px', background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>Delta 输出：</Text>
        <CodeBlock code={JSON.stringify(delta, null, 2)} language="json" />
      </div>
    </div>
  )
}

const stepContents = {
  init: {
    title: '初始编辑器：从 contenteditable 开始',
    thinking: `我们从最基础的 HTML 开始：一个可编辑的 div。

**contenteditable** 是浏览器原生的富文本编辑能力，但它有致命问题：
- 不同浏览器产生不同的 HTML
- 无法精确追踪变更
- 难以实现协作编辑

所以我们的策略是：**用 contenteditable 处理输入，但维护自己的数据模型**。`,
    demo: <InitDemo />,
    code: `// ============================================
// 文件 1: index.html
// 编辑器的 HTML 结构
// ============================================

<!DOCTYPE html>
<html>
<head>
  <title>Mini Quill</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div id="app">
    <!-- 工具栏（后续添加按钮） -->
    <div id="toolbar"></div>
    
    <!-- 编辑器容器 -->
    <!-- contenteditable="true" 让 div 变成可编辑的 -->
    <div id="editor" contenteditable="true"></div>
    
    <!-- 输出 Delta 的区域（用于调试） -->
    <pre id="output"></pre>
  </div>
  
  <script src="delta.js"></script>
  <script src="editor.js"></script>
</body>
</html>


// ============================================
// 文件 2: style.css
// 编辑器的样式
// ============================================

body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

/* 编辑器基础样式 */
#editor {
  min-height: 300px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  font-size: 15px;
  line-height: 1.7;
}

/* 编辑器聚焦时的样式 */
#editor:focus {
  border-color: #2962ff;
  box-shadow: 0 0 0 3px rgba(41, 98, 255, 0.1);
}

/* Delta 输出区域 */
#output {
  margin-top: 16px;
  padding: 16px;
  background: #1e1e2e;
  color: #cdd6f4;
  border-radius: 8px;
  font-size: 13px;
  overflow: auto;
}


// ============================================
// 文件 3: editor.js
// 编辑器的 JavaScript 代码
// ============================================

/**
 * MiniQuill 类 - 我们的编辑器
 * 
 * 第一步：最基础的版本
 * - 创建编辑器容器
 * - 监听用户输入
 * - 输出 HTML 内容（用于调试）
 */
class MiniQuill {
  constructor(container) {
    // 保存容器元素的引用
    this.container = container;
    
    // 设置事件监听
    this.setupListeners();
    
    console.log('MiniQuill 初始化完成！');
  }

  /**
   * 设置事件监听器
   * 
   * 这里我们监听 'input' 事件，
   * 每次用户输入时都会触发
   */
  setupListeners() {
    this.container.addEventListener('input', () => {
      // 暂时只是打印 HTML，后续会改为 Delta
      console.log('用户输入:', this.container.innerHTML);
    });
  }
}

// 初始化编辑器
const editor = new MiniQuill(document.getElementById('editor'));`,
  },
  delta: {
    title: 'Delta 模型：定义我们的数据格式',
    thinking: `现在我们定义自己的数据格式。

**Delta** 是 Quill 的核心创新：用 JSON 表示富文本。

关键设计：
- 只有三种操作：insert、delete、retain
- 属性用 attributes 对象表示
- 文档 = 从空文档开始执行所有操作
- **规范性**：相同内容只有一种表示`,
    demo: <DeltaDemo />,
    code: `// ============================================
// Step 2: Delta - 文档数据格式
// 目标：定义表示富文本的数据结构
// ============================================

/**
 * Delta 类 - Quill 的核心数据结构
 * 
 * 设计哲学：
 * - Delta 既是"文档"也是"变更"
 * - 从空文档开始执行所有 ops，就得到文档内容
 * 
 * 三种操作：
 * - insert: 插入文本或嵌入内容
 * - delete: 删除指定数量的字符
 * - retain: 保留字符（可选应用格式）
 * 
 * 示例：
 * // 表示 "Hello World"，其中 "Hello" 加粗
 * {
 *   ops: [
 *     { insert: "Hello", attributes: { bold: true } },
 *     { insert: " World\\n" }
 *   ]
 * }
 */
class Delta {
  /**
   * @param {Array} ops - 初始操作数组
   */
  constructor(ops = []) {
    // 操作数组，存储所有 insert/delete/retain
    this.ops = [...ops];
  }

  /**
   * 插入文本或嵌入内容
   * 
   * @param {string|object} text - 要插入的内容
   *   - 字符串：普通文本
   *   - 对象：嵌入内容，如 { image: "url" }
   * @param {object|null} attrs - 格式属性
   *   - 如 { bold: true, color: "#f00" }
   *   - null 表示无格式
   * @returns {Delta} 返回 this，支持链式调用
   * 
   * 示例：
   *   delta.insert("Hello")                    // 普通文本
   *   delta.insert("Hello", { bold: true })    // 加粗文本
   *   delta.insert({ image: "url" })           // 图片
   */
  insert(text, attrs = null) {
    const op = { insert: text };
    
    // 只有当属性不为空时才添加 attributes
    // 这保证了 Delta 的紧凑性
    if (attrs && Object.keys(attrs).length > 0) {
      op.attributes = { ...attrs };
    }
    
    this.ops.push(op);
    return this; // 支持链式调用：delta.insert('a').insert('b')
  }

  /**
   * 删除指定数量的字符
   * 
   * 注意：delete 不包含被删除的内容，
   * 所以 Delta 不是可逆的
   * 
   * @param {number} length - 删除的字符数
   * @returns {Delta}
   */
  delete(length) {
    if (length > 0) {
      this.ops.push({ delete: length });
    }
    return this;
  }

  /**
   * 保留字符（可选应用格式）
   * 
   * retain 的含义：
   * - "跳过"这些字符，不做任何修改
   * - 如果带 attributes，则"修改格式"
   * 
   * 这是实现"变更"的关键：
   * - 不需要记录位置索引
   * - 从头到尾依次执行
   * 
   * @param {number} length - 保留的字符数
   * @param {object|null} attrs - 要应用的格式
   * @returns {Delta}
   * 
   * 示例：
   *   delta.retain(5)                          // 跳过前 5 个字符
   *   delta.retain(5, { bold: true })          // 将前 5 个字符加粗
   *   delta.retain(5, { bold: null })          // 移除前 5 个字符的加粗
   */
  retain(length, attrs = null) {
    if (length <= 0) return this;
    const op = { retain: length };
    if (attrs && Object.keys(attrs).length > 0) {
      op.attributes = { ...attrs };
    }
    this.ops.push(op);
    return this;
  }

  /**
   * 计算文档总长度
   * 
   * 长度计算规则：
   * - 文本：按字符数计算
   * - 嵌入内容（图片等）：长度固定为 1
   * - retain：按保留数量计算
   * - delete：按删除数量计算
   * 
   * @returns {number}
   */
  length() {
    return this.ops.reduce((len, op) => {
      if (op.insert) {
        return len + (typeof op.insert === 'string' ? op.insert.length : 1);
      }
      if (op.retain) return len + op.retain;
      if (op.delete) return len + op.delete;
      return len;
    }, 0);
  }

  /**
   * 获取文档的 JSON 表示
   * @returns {object}
   */
  toJSON() {
    return { ops: this.ops };
  }

  /**
   * 从 JSON 创建 Delta
   * @param {object} json
   * @returns {Delta}
   */
  static fromJSON(json) {
    return new Delta(json.ops || json);
  }
}

// ============================================
// 使用示例
// ============================================

// 创建文档：加粗的 "Hello" + 普通的 " World"
const doc = new Delta()
  .insert('Hello', { bold: true })  // 加粗
  .insert(' World\n');               // 换行结尾

console.log('文档:', doc.toJSON());
// { ops: [
//   { insert: 'Hello', attributes: { bold: true } },
//   { insert: ' World\n' }
// ] }

// 表示变更：在位置 6 插入 "Beautiful "
const change = new Delta()
  .retain(6)              // 保留 "Hello "
  .insert('Beautiful ');  // 插入新文本
  // 后面的 "World\n" 自动保留`,
  },
  parchment: {
    title: 'Blot 系统：定义文档结构',
    thinking: `**Parchment** 是 Quill 的文档模型，我们实现一个简化版。

核心概念：**Blot（墨迹）** = DOM 节点的抽象

我们定义 3 种 Blot：
- **TextBlot**: 纯文本
- **InlineBlot**: 行内格式（加粗、斜体）
- **BlockBlot**: 块级元素（段落）

每种 Blot 知道如何创建 DOM 节点。`,
    demo: null,
    code: `// ============================================
// Step 3: Blot 系统 - 文档模型
// 目标：定义文档结构的抽象
// ============================================

/**
 * TextBlot - 纯文本节点
 * 
 * 最基础的 Blot，对应 DOM 的 Text 节点
 * 不支持格式化，只存储纯文本
 */
class TextBlot {
  /**
   * 创建文本节点
   * @param {string} text - 文本内容
   * @returns {Text}
   */
  static create(text) {
    return document.createTextNode(text);
  }

  /**
   * 从 DOM 节点提取值
   * @param {Text} node
   * @returns {string}
   */
  static value(node) {
    return node.textContent;
  }
}

/**
 * InlineBlot - 行内格式（加粗、斜体等）
 * 
 * 对应 DOM 的行内元素（span, strong, em 等）
 * 可以嵌套，可以设置格式属性
 */
class InlineBlot {
  /**
   * 创建行内格式节点
   * 
   * @param {string} tag - HTML 标签名（strong, em, u 等）
   * @param {string} text - 文本内容
   * @param {object} attrs - 额外属性（color, background 等）
   * @returns {HTMLElement}
   */
  static create(tag, text, attrs = {}) {
    const el = document.createElement(tag);
    el.textContent = text;
    
    // 应用额外属性
    if (attrs.color) el.style.color = attrs.color;
    if (attrs.background) el.style.backgroundColor = attrs.background;
    
    return el;
  }

  /**
   * 从 DOM 节点提取值
   * @param {HTMLElement} node
   * @returns {object}
   */
  static value(node) {
    return {
      text: node.textContent,
      tag: node.tagName.toLowerCase(),
      color: node.style.color || null,
      background: node.style.backgroundColor || null,
    };
  }
}

/**
 * BlockBlot - 块级元素（段落）
 * 
 * 对应 DOM 的块级元素（div, p 等）
 * 独占一行，可以包含 InlineBlot
 */
class BlockBlot {
  /**
   * 创建块级元素
   * @param {string} tag - HTML 标签名
   * @returns {HTMLElement}
   */
  static create(tag = 'div') {
    const el = document.createElement(tag);
    el.className = 'editor-line';
    return el;
  }

  /**
   * 从 DOM 节点提取值
   * @param {HTMLElement} node
   * @returns {string}
   */
  static value(node) {
    return node.textContent;
  }
}

/**
 * Registry - Blot 注册表
 * 
 * 管理所有 Blot 类型：
 * - 注册新的 Blot
 * - 根据名称查找 Blot
 * - 根据 DOM 节点查找 Blot
 */
class Registry {
  constructor() {
    // 存储所有注册的 Blot
    this.blots = new Map();
    
    // 注册默认的 Blot
    this.register('text', TextBlot);
    this.register('bold', { tag: 'strong', type: 'inline' });
    this.register('italic', { tag: 'em', type: 'inline' });
    this.register('underline', { tag: 'u', type: 'inline' });
    this.register('strike', { tag: 's', type: 'inline' });
    this.register('link', { tag: 'a', type: 'inline' });
    this.register('block', { tag: 'div', type: 'block' });
  }

  /**
   * 注册 Blot
   * @param {string} name - 格式名称
   * @param {object} config - Blot 配置
   */
  register(name, config) {
    this.blots.set(name, config);
  }

  /**
   * 获取 Blot
   * @param {string} name - 格式名称
   * @returns {object}
   */
  get(name) {
    return this.blots.get(name);
  }
}`,
  },
  renderer: {
    title: '渲染器：Delta → DOM',
    thinking: `现在实现最关键的一步：把 Delta 渲染成 DOM。

渲染逻辑：
1. 清空容器
2. 创建第一个段落
3. 遍历 Delta 的 ops
4. insert 文本 → 创建 DOM 节点
5. 有 attributes → 应用格式
6. 遇到 \\n → 创建新段落`,
    demo: <RendererDemo />,
    code: `// ============================================
// Step 4: Renderer - 将 Delta 渲染为 DOM
// 目标：实现 Delta → DOM 的转换
// ============================================

/**
 * Renderer 类 - 渲染引擎
 * 
 * 职责：将 Delta 数据渲染成用户可见的 DOM
 * 
 * 核心思路：
 * - Delta 是数据的唯一真相来源
 * - DOM 只是数据的投影（渲染结果）
 * - 每次数据变化，都重新渲染整个 DOM
 */
class Renderer {
  /**
   * @param {HTMLElement} container - 编辑器容器
   * @param {Registry} registry - Blot 注册表
   */
  constructor(container, registry) {
    this.container = container;
    this.registry = registry;
  }

  /**
   * 渲染 Delta 到容器
   * 
   * 这是渲染器的核心方法，流程：
   * 1. 清空容器（删除旧的 DOM）
   * 2. 创建第一个段落
   * 3. 遍历 Delta 的 ops
   * 4. 根据 op 类型创建对应的 DOM 节点
   * 
   * @param {Delta} delta - 要渲染的文档
   */
  render(delta) {
    // 清空容器
    this.container.innerHTML = '';
    
    // 创建第一个段落
    let currentBlock = BlockBlot.create();
    this.container.appendChild(currentBlock);

    // 遍历所有操作
    for (const op of delta.ops) {
      // 只处理 insert 操作
      if (typeof op.insert === 'string') {
        // 按换行符分割文本
        // 每个换行符 = 新段落
        const lines = op.insert.split('\\n');
        
        lines.forEach((line, i) => {
          // 遇到换行符，创建新段落
          if (i > 0) {
            currentBlock = BlockBlot.create();
            this.container.appendChild(currentBlock);
          }
          
          // 有文本内容，创建节点
          if (line) {
            const node = this.createNode(line, op.attributes);
            currentBlock.appendChild(node);
          }
        });
      }
    }
  }

  /**
   * 根据 attributes 创建 DOM 节点
   * 
   * 这是格式化的核心：
   * - 无 attributes → 纯文本节点
   * - 有 attributes → 带格式的节点
   * 
   * @param {string} text - 文本内容
   * @param {object} attributes - 格式属性
   * @returns {Node}
   */
  createNode(text, attributes = {}) {
    // 无格式，直接返回文本节点
    if (!attributes || Object.keys(attributes).length === 0) {
      return TextBlot.create(text);
    }

    // 有格式，创建行内节点
    let wrapper = document.createElement('span');
    wrapper.textContent = text;

    // 应用加粗
    if (attributes.bold) {
      const strong = document.createElement('strong');
      strong.appendChild(wrapper);
      wrapper = strong;
    }

    // 应用斜体
    if (attributes.italic) {
      const em = document.createElement('em');
      em.appendChild(wrapper);
      wrapper = em;
    }

    // 应用下划线
    if (attributes.underline) {
      const u = document.createElement('u');
      u.appendChild(wrapper);
      wrapper = u;
    }

    // 应用颜色
    if (attributes.color) {
      wrapper.style.color = attributes.color;
    }

    // 应用链接
    if (attributes.link) {
      const a = document.createElement('a');
      a.href = attributes.link;
      a.appendChild(wrapper);
      wrapper = a;
    }

    return wrapper;
  }
}`,
  },
  selection: {
    title: '选区管理：连接用户与数据',
    thinking: `选区是编辑器的核心：用户选中内容 → 执行操作。

**浏览器选区** = DOM 节点 + 偏移量
**我们需要** = 字符索引

所以需要双向转换：
- DOM 位置 → 字符索引（syncFromDOM）
- 字符索引 → DOM 位置（syncToDOM）`,
    demo: <SelectionDemo />,
    code: `// ============================================
// Step 5: Selection - 选区管理
// 目标：实现浏览器选区与字符索引的转换
// ============================================

/**
 * SelectionManager 类 - 选区管理器
 * 
 * 解决的核心问题：
 * - 浏览器选区 = DOM 节点 + 偏移量
 * - 我们需要 = 字符索引
 * 
 * 选区包含两个信息：
 * - index: 光标位置（从文档开头算起的字符数）
 * - length: 选中范围长度（0 = 光标，>0 = 选区）
 */
class SelectionManager {
  /**
   * @param {MiniQuill} editor - 编辑器实例
   */
  constructor(editor) {
    this.editor = editor;
    this.container = editor.container;
    
    // 当前选区状态
    this.index = 0;   // 光标位置
    this.length = 0;   // 选区长度
  }

  /**
   * 获取当前选区
   * @returns {{ index: number, length: number }}
   */
  getRange() {
    return { index: this.index, length: this.length };
  }

  /**
   * 从浏览器选区同步到我们的选区状态
   * 
   * 这是关键方法：将 DOM 位置转换为字符索引
   * 
   * 流程：
   * 1. 获取浏览器选区
   * 2. 确保选区在编辑器内
   * 3. 计算字符索引
   */
  syncFromDOM() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    
    // 确保选区在编辑器内
    if (!this.container.contains(range.startContainer)) return;

    // 计算起始位置的字符索引
    this.index = this.getIndexFromNode(
      range.startContainer, 
      range.startOffset
    );
    
    this.length = 0;
    
    // 如果有选区（非光标），计算长度
    if (!range.collapsed) {
      const endIndex = this.getIndexFromNode(
        range.endContainer, 
        range.endOffset
      );
      this.length = endIndex - this.index;
    }
  }

  /**
   * DOM 节点位置 → 字符索引
   * 
   * 遍历所有文本节点，累加长度直到找到目标节点
   * 
   * @param {Node} node - DOM 节点
   * @param {number} offset - 节点内的偏移量
   * @returns {number} 字符索引
   */
  getIndexFromNode(node, offset) {
    let index = 0;
    
    // 创建 TreeWalker 遍历所有文本节点
    const walker = document.createTreeWalker(
      this.container,
      NodeFilter.SHOW_TEXT
    );

    while (walker.nextNode()) {
      if (walker.currentNode === node) {
        // 找到目标节点，返回累加的索引 + 节点内偏移
        return index + offset;
      }
      // 累加当前文本节点的长度
      index += walker.currentNode.textContent.length;
    }
    
    return index;
  }

  /**
   * 获取选中的文本
   * @returns {string}
   */
  getSelectedText() {
    const selection = window.getSelection();
    return selection.toString();
  }
}`,
  },
  formatter: {
    title: '格式化引擎：修改文档数据',
    thinking: `格式化的本质：修改 Delta 中文本的 attributes。

例如加粗前 5 个字符：
- 原始: \`[{ insert: 'Hello World\\n' }]\`
- 结果: \`[{ insert: 'Hello', attributes: { bold: true } }, { insert: ' World\\n' }]\`

**关键：这是纯数据操作，不涉及 DOM**`,
    demo: <FormatterDemo />,
    code: `// ============================================
// Step 6: Formatter - 格式化引擎
// 目标：实现文本格式化（加粗、斜体等）
// ============================================

/**
 * Formatter 类 - 格式化引擎
 * 
 * 核心思想：
 * - 格式化 = 修改 Delta 的 attributes
 * - 这是纯数据操作，不涉及 DOM
 * - 渲染器会根据 attributes 自动应用格式
 */
class Formatter {
  /**
   * @param {MiniQuill} editor - 编辑器实例
   */
  constructor(editor) {
    this.editor = editor;
  }

  /**
   * 对指定范围应用格式
   * 
   * 这是格式化的核心方法，流程：
   * 1. 遍历 Delta 的 ops
   * 2. 找到与范围有交集的 op
   * 3. 将 op 拆分成三部分：前、中、后
   * 4. 对中间部分应用格式
   * 5. 重新组装 Delta
   * 
   * @param {number} index - 起始位置
   * @param {number} length - 长度
   * @param {object} attributes - 要应用的格式
   */
  format(index, length, attributes) {
    const delta = this.editor.delta;
    const newOps = [];
    let currentIndex = 0;

    for (const op of delta.ops) {
      const opLength = this.getOpLength(op);

      // 在范围外，直接保留
      if (currentIndex + opLength <= index || currentIndex >= index + length) {
        newOps.push({ ...op });
      } else {
        // 在范围内，应用格式
        if (typeof op.insert === 'string') {
          const start = Math.max(0, index - currentIndex);
          const end = Math.min(op.insert.length, index + length - currentIndex);

          // 保留前面的部分（无格式变化）
          if (start > 0) {
            newOps.push({
              insert: op.insert.slice(0, start),
              ...(op.attributes && { attributes: { ...op.attributes } })
            });
          }

          // 格式化范围内的部分（合并属性）
          const merged = this.mergeAttributes(op.attributes, attributes);
          newOps.push({
            insert: op.insert.slice(start, end),
            attributes: merged
          });

          // 保留后面的部分（无格式变化）
          if (end < op.insert.length) {
            newOps.push({
              insert: op.insert.slice(end),
              ...(op.attributes && { attributes: { ...op.attributes } })
            });
          }
        }
      }
      currentIndex += opLength;
    }

    // 更新编辑器的 Delta
    this.editor.delta = new Delta(newOps);
  }

  /**
   * 合并属性
   * 
   * 规则：
   * - 新属性覆盖旧属性
   * - null 表示删除属性
   * 
   * @param {object} existing - 旧属性
   * @param {object} newAttrs - 新属性
   * @returns {object} 合并后的属性
   */
  mergeAttributes(existing, newAttrs) {
    const merged = existing ? { ...existing } : {};
    Object.keys(newAttrs).forEach(key => {
      if (newAttrs[key] === null) {
        delete merged[key]; // null 表示删除
      } else {
        merged[key] = newAttrs[key];
      }
    });
    return merged;
  }

  /**
   * 获取操作的长度
   * @param {object} op
   * @returns {number}
   */
  getOpLength(op) {
    if (op.insert) return typeof op.insert === 'string' ? op.insert.length : 1;
    if (op.retain) return op.retain;
    if (op.delete) return op.delete;
    return 0;
  }

  /**
   * 切换格式（开/关）
   * 
   * 如果当前已有该格式，则移除；否则添加
   * 
   * @param {string} name - 格式名称
   * @param {*} value - 格式值
   */
  toggleFormat(name, value = true) {
    const { index, length } = this.editor.selection.getRange();
    if (length === 0) return; // 没有选中内容
    
    const formats = this.editor.getFormats();
    if (formats[name] === value) {
      this.format(index, length, { [name]: null }); // 移除
    } else {
      this.format(index, length, { [name]: value }); // 添加
    }
  }
}`,
  },
  editor: {
    title: '完整编辑器：组合所有模块',
    thinking: `最后一步：把所有模块组合成一个完整的编辑器。

添加：
1. **DOM → Delta 同步**：监听输入，更新数据
2. **历史记录**：撤销/重做
3. **完整的快捷键支持**`,
    demo: <EditorDemo />,
    code: `// ============================================
// Step 7: Mini Quill - 完整实现
// 组合所有模块
// ============================================

/**
 * MiniQuill 类 - 完整的富文本编辑器
 * 
 * 组合了所有模块：
 * - Delta: 数据格式
 * - Parchment: 文档模型（Blot 系统）
 * - Renderer: 渲染引擎
 * - Selection: 选区管理
 * - Formatter: 格式化引擎
 * 
 * 核心循环：
 * 用户输入 → DOM 变化 → 转换为 Delta → 渲染 DOM
 */
class MiniQuill {
  /**
   * @param {HTMLElement} container - 编辑器容器
   */
  constructor(container) {
    // 保存容器引用
    this.container = container;
    
    // 初始化文档（只有一个换行符的空文档）
    this.delta = new Delta([{ insert: '\\n' }]);
    
    // 初始化各个组件
    this.registry = new Registry();
    this.renderer = new Renderer(container, this.registry);
    this.selection = new SelectionManager(this);
    this.formatter = new Formatter(this);
    
    // 历史记录栈（用于撤销/重做）
    this.undoStack = [];
    this.redoStack = [];
    
    // 设置事件监听
    this.setupListeners();
    
    // 初始渲染
    this.render();
    
    console.log('MiniQuill 初始化完成！');
  }

  /**
   * 设置所有事件监听器
   */
  setupListeners() {
    // 监听输入事件，同步 DOM → Delta
    this.container.addEventListener('input', () => {
      this.syncFromDOM();
    });

    // 监听选区变化
    this.container.addEventListener('mouseup', () => {
      this.selection.syncFromDOM();
      this.emit('selection-change');
    });

    // 监听键盘事件，处理快捷键
    this.container.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b': // Ctrl+B: 加粗
            e.preventDefault();
            this.formatter.toggleFormat('bold');
            this.render();
            break;
          case 'i': // Ctrl+I: 斜体
            e.preventDefault();
            this.formatter.toggleFormat('italic');
            this.render();
            break;
          case 'u': // Ctrl+U: 下划线
            e.preventDefault();
            this.formatter.toggleFormat('underline');
            this.render();
            break;
          case 'z': // Ctrl+Z: 撤销
            e.preventDefault();
            this.undo();
            break;
        }
      }
    });
  }

  /**
   * 从 DOM 同步到 Delta
   * 
   * 这是双向绑定的关键：
   * 1. 保存旧的 Delta（用于撤销）
   * 2. 将 DOM 转换为新的 Delta
   * 3. 触发变更事件
   */
  syncFromDOM() {
    const oldDelta = this.delta;
    this.delta = this.domToDelta();
    this.undoStack.push(oldDelta);
    this.redoStack = [];
    this.emit('text-change');
  }

  /**
   * 将 DOM 转换为 Delta
   * 
   * 遍历 DOM 树，提取文本和格式信息
   * 
   * @returns {Delta}
   */
  domToDelta() {
    const delta = new Delta();
    
    /**
     * 递归处理 DOM 节点
     * @param {Node} node - DOM 节点
     * @param {object} attrs - 当前格式属性
     */
    const processNode = (node, attrs = {}) => {
      // 文本节点：添加到 Delta
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent) {
          delta.insert(
            node.textContent,
            Object.keys(attrs).length > 0 ? attrs : undefined
          );
        }
        return;
      }

      // 元素节点：提取格式，递归处理子节点
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const newAttrs = { ...attrs };
      const tag = node.tagName.toLowerCase();

      // 检测格式
      if (tag === 'strong' || tag === 'b') newAttrs.bold = true;
      if (tag === 'em' || tag === 'i') newAttrs.italic = true;
      if (tag === 'u') newAttrs.underline = true;
      if (tag === 's') newAttrs.strike = true;
      if (tag === 'a') newAttrs.link = node.getAttribute('href');
      if (node.style.color) newAttrs.color = node.style.color;

      // 递归处理子节点
      Array.from(node.childNodes).forEach(child => {
        processNode(child, newAttrs);
      });

      // 块级元素结束时添加换行
      if (['div', 'p'].includes(tag)) {
        delta.insert('\\n');
      }
    };

    // 处理所有子节点
    Array.from(this.container.childNodes).forEach(child => {
      processNode(child);
    });

    // 确保以换行结尾
    const lastOp = delta.ops[delta.ops.length - 1];
    if (!lastOp || typeof lastOp.insert !== 'string' || !lastOp.insert.endsWith('\\n')) {
      delta.insert('\\n');
    }

    return delta;
  }

  /**
   * 获取指定位置的格式
   * @returns {object}
   */
  getFormats() {
    const { index } = this.selection.getRange();
    const formats = {};
    let currentIndex = 0;

    for (const op of this.delta.ops) {
      if (typeof op.insert === 'string') {
        if (currentIndex + op.insert.length > index) {
          if (op.attributes) Object.assign(formats, op.attributes);
          break;
        }
        currentIndex += op.insert.length;
      }
    }
    return formats;
  }

  /**
   * 渲染文档
   */
  render() {
    this.renderer.render(this.delta);
    this.emit('text-change');
  }

  /**
   * 撤销
   */
  undo() {
    if (this.undoStack.length === 0) return;
    this.redoStack.push(this.delta);
    this.delta = this.undoStack.pop();
    this.render();
  }

  /**
   * 重做
   */
  redo() {
    if (this.redoStack.length === 0) return;
    this.undoStack.push(this.delta);
    this.delta = this.redoStack.pop();
    this.render();
  }

  /**
   * 发送事件
   * @param {string} event - 事件名称
   */
  emit(event) {
    this.container.dispatchEvent(new CustomEvent(event));
  }
}

// ============================================
// 初始化编辑器
// ============================================
const editor = new MiniQuill(document.getElementById('editor'));

// 监听变化，显示 Delta
editor.container.addEventListener('text-change', () => {
  document.getElementById('output').textContent = 
    JSON.stringify(editor.delta.ops, null, 2);
});`,
  },
  'delta-compose': {
    title: '进阶：Delta 组合（compose）',
    thinking: `**compose** = 合并两个连续的变更

场景：用户执行了多个操作，我们想合并成一个

原始: "Hello"
操作 1: 在末尾加 " World" → retain(5).insert(' World')
操作 2: 在末尾加 "!" → retain(11).insert('!')
合并: retain(5).insert(' World!')`,
    demo: null,
    code: `// ============================================
// 进阶：Delta compose - 合并变更
// ============================================

/**
 * compose - 合并两个变更
 * 
 * 含义：先执行 this，再执行 other
 * 
 * 示例：
 *   const a = new Delta().retain(5).insert(' World');
 *   const b = new Delta().retain(11).insert('!');
 *   const composed = a.compose(b);
 *   // 结果: retain(5).insert(' World!')
 * 
 * 用途：
 * 1. 批量操作（合并多个小变更）
 * 2. 网络传输优化（减少请求次数）
 * 3. 历史记录压缩
 */
Delta.prototype.compose = function(other) {
  const thisIter = new OpIterator(this.ops);
  const otherIter = new OpIterator(other.ops);
  const ops = [];

  while (thisIter.hasNext() || otherIter.hasNext()) {
    // other 是 insert，优先处理
    if (otherIter.peekType() === 'insert') {
      ops.push(otherIter.next());
    }
    // this 是 delete，优先处理
    else if (thisIter.peekType() === 'delete') {
      ops.push(thisIter.next());
    }
    // 两者都是 retain 或 insert/retain 组合
    else {
      const thisOp = thisIter.peek();
      const otherOp = otherIter.peek();

      if (!thisOp || !otherOp) break;

      const length = Math.min(
        thisOp.retain || thisOp.insert?.length || 0,
        otherOp.retain || 0
      );

      if (thisOp.retain && otherOp.retain) {
        // retain + retain = retain（合并属性）
        const attrs = mergeAttributes(thisOp.attributes, otherOp.attributes);
        ops.push({ retain: length, ...(Object.keys(attrs).length > 0 && { attributes: attrs }) });
      } else if (typeof thisOp.insert === 'string' && otherOp.retain) {
        // insert + retain = insert（应用属性）
        const attrs = mergeAttributes(thisOp.attributes, otherOp.attributes);
        const text = thisOp.insert.slice(0, length);
        ops.push({ insert: text, ...(Object.keys(attrs).length > 0 && { attributes: attrs }) });
      }

      thisIter.next(length);
      otherIter.next(length);
    }
  }

  return new Delta(ops);
};

// 辅助函数：合并属性
function mergeAttributes(existing, attrs) {
  if (!existing && !attrs) return {};
  if (!existing) return { ...attrs };
  if (!attrs) return { ...existing };
  const merged = { ...existing };
  Object.keys(attrs).forEach(key => {
    if (attrs[key] === null) delete merged[key];
    else merged[key] = attrs[key];
  });
  return merged;
}

// 使用示例
const a = new Delta().retain(5).insert(' World');
const b = new Delta().retain(11).insert('!');
const composed = a.compose(b);
console.log(composed.ops);
// [{ retain: 5 }, { insert: ' World!' }]`,
  },
  'delta-transform': {
    title: '进阶：Delta 转换（transform）',
    thinking: `**transform** = 解决并发编辑冲突

场景：两个人同时编辑同一文档

文档："Hello"
用户 A：在位置 5 插入 " World"
用户 B：在位置 5 插入 "!"

transform 告诉我们：B 相对于 A，应该如何调整`,
    demo: null,
    code: `// ============================================
// 进阶：Delta transform - 协作编辑核心
// ============================================

/**
 * transform - 转换并发变更
 * 
 * 这是协作编辑的核心算法！
 * 
 * 场景：
 * - 文档："Hello"
 * - 用户 A：在位置 5 插入 " World"
 * - 用户 B：在位置 5 插入 "!"
 * 
 * 问题：两个人同时编辑，如何合并？
 * 
 * 解决方案：
 * - A 先到达服务器
 * - transform 告诉我们：B 相对于 A，应该如何调整
 * - 调整后的 B 可以正确应用
 * 
 * @param {Delta} a - 先到达的变更
 * @param {Delta} b - 后到达的变更
 * @param {boolean} priority - true = b 优先
 * @returns {Delta} 调整后的 b
 */
Delta.transform = function(a, b, priority = false) {
  const aIter = new OpIterator(a.ops);
  const bIter = new OpIterator(b.ops);
  const ops = [];

  while (aIter.hasNext() || bIter.hasNext()) {
    // a 是 insert，b 需要跳过
    if (aIter.peekType() === 'insert' && 
        (bIter.peekType() !== 'insert' || !priority)) {
      const aOp = aIter.next();
      ops.push({ retain: typeof aOp.insert === 'string' ? aOp.insert.length : 1 });
      continue;
    }

    // b 是 insert，直接加入
    if (bIter.peekType() === 'insert') {
      ops.push(bIter.next());
      continue;
    }

    // 两者都是 retain/delete
    const aOp = aIter.peek();
    const bOp = bIter.peek();

    if (!aOp || !bOp) break;

    const aLen = aOp.retain || aOp.delete || 0;
    const bLen = bOp.retain || bOp.delete || 0;
    const length = Math.min(aLen, bLen);

    if (aOp.delete) {
      // a 删除，b 跳过
      aIter.next(length);
      continue;
    }

    if (bOp.delete) {
      // b 删除，加入
      ops.push({ delete: length });
      bIter.next(length);
      aIter.next(length);
      continue;
    }

    // 两者都是 retain
    ops.push({ retain: length });
    aIter.next(length);
    bIter.next(length);
  }

  return new Delta(ops);
};

// 使用示例
const original = new Delta().insert('Hello');

// 用户 A：在末尾加 " World"
const changeA = new Delta().retain(5).insert(' World');

// 用户 B：在末尾加 "!"
const changeB = new Delta().retain(5).insert('!');

// A 先到达，B 需要调整
const transformedB = Delta.transform(changeA, changeB, false);

console.log('调整后的 B:', transformedB.ops);
// [{ retain: 11 }, { insert: '!' }]
// B 现在知道要跳过 11 个字符（Hello + World）

// 应用：先 A，再调整后的 B
const result = original.compose(changeA).compose(transformedB);
console.log('最终结果:', result.ops);
// Hello World!`,
  },
}

export default function BuildPage() {
  const [currentStep, setCurrentStep] = useState('init')
  const currentContent = stepContents[currentStep]

  const handleStepChange = (key) => {
    const step = steps.find(s => s.key === key)
    if (step && step.disabled) return
    setCurrentStep(key)
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
      <div style={{
        width: '220px',
        background: '#fafafa',
        borderRight: '1px solid #f0f0f0',
        padding: '16px 0',
        flexShrink: 0,
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #f0f0f0' }}>
          <Text strong style={{ fontSize: '14px' }}>从零构建 Quill</Text>
        </div>
        <Menu
          mode="vertical"
          selectedKeys={[currentStep]}
          onClick={({ key }) => handleStepChange(key)}
          style={{ border: 'none', background: 'transparent' }}
          items={steps.map((step) => ({
            key: step.key,
            icon: step.icon,
            label: step.disabled ? (
              <Text type="secondary" style={{ fontSize: '12px' }}>{step.label}</Text>
            ) : step.label,
            disabled: step.disabled,
          }))}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px' }}>
        <Title level={2} style={{ marginBottom: '24px' }}>{currentContent.title}</Title>

        <div style={{
          padding: '20px',
          background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f4f8 100%)',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <BulbOutlined style={{ color: '#2962ff', fontSize: '18px' }} />
            <Text strong style={{ color: '#2962ff' }}>设计思路</Text>
          </div>
          <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{currentContent.thinking}</div>
        </div>

        {currentContent.demo && (
          <>
            <Divider><Tag color="blue">交互体验</Tag></Divider>
            <div style={{ marginBottom: '24px' }}>{currentContent.demo}</div>
          </>
        )}

        <Divider><Tag color="blue">代码实现</Tag></Divider>
        <div style={{ marginBottom: '24px' }}>
          <CodeBlock code={currentContent.code} language="javascript" />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            disabled={steps[0].key === currentStep}
            onClick={() => {
              const idx = steps.findIndex(s => s.key === currentStep);
              for (let i = idx - 1; i >= 0; i--) {
                if (!steps[i].disabled) { handleStepChange(steps[i].key); break; }
              }
            }}
          >
            上一步
          </Button>
          <Button
            type="primary"
            disabled={steps[steps.length - 1].key === currentStep}
            onClick={() => {
              const idx = steps.findIndex(s => s.key === currentStep);
              for (let i = idx + 1; i < steps.length; i++) {
                if (!steps[i].disabled) { handleStepChange(steps[i].key); break; }
              }
            }}
          >
            下一步 <ArrowRightOutlined />
          </Button>
        </div>
      </div>
    </div>
  )
}