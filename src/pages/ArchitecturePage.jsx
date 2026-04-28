import React, { useState } from 'react'
import { Typography, Card, Tag, Alert, Collapse, Divider, Space, Button, Table } from 'antd'
import {
  BlockOutlined,
  CodeOutlined,
  BulbOutlined,
  ApiOutlined,
  FileTextOutlined,
  EditOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons'
import CodeBlock from '../components/CodeBlock'

const { Title, Paragraph, Text } = Typography

const deltaExamples = {
  basic: {
    title: '基础文档',
    desc: '一段加粗的 "Hello" + 斜体的 "World"',
    code: `{
  ops: [
    { insert: "Hello", attributes: { bold: true } },
    { insert: " " },
    { insert: "World", attributes: { italic: true } },
    { insert: "\\n" }
  ]
}`,
    render: <div><strong>Hello</strong> <em>World</em></div>,
  },
  change: {
    title: '表示变更',
    desc: '在 "Hello" 后插入 "Beautiful "',
    code: `// 原始文档
{ ops: [{ insert: "Hello World\\n" }] }

// 变更 Delta
{
  ops: [
    { retain: 6 },           // 保留 "Hello "
    { insert: "Beautiful " } // 插入新文本
    // 后面的内容自动保留
  ]
}

// 结果文档
{ ops: [
  { insert: "Hello Beautiful World\\n" }]
}`,
    render: <div>Hello <strong>Beautiful</strong> World</div>,
  },
  format: {
    title: '修改格式',
    desc: '将 "Hello" 加粗',
    code: `// 变更 Delta
{
  ops: [
    { retain: 5, attributes: { bold: true } },  // 加粗前 5 个字符
    { retain: 1 }                                 // 保留空格
  ]
}

// 关键：retain + attributes = 修改格式
// attributes: { bold: null } 表示移除格式`,
    render: <div><strong>Hello</strong> World</div>,
  },
  embed: {
    title: '嵌入内容',
    desc: '插入图片',
    code: `{
  ops: [
    { insert: { image: "https://example.com/photo.jpg" } },
    { insert: "\\n" }
  ]
}

// 嵌入内容的长度固定为 1
// 可以像文本一样有 attributes
{
  ops: [{
    insert: { image: "https://..." },
    attributes: { alt: "示例图片", width: "300" }
  }]
}`,
    render: <div style={{ padding: '20px', background: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>📷 图片占位</div>,
  },
}

const blotTypes = [
  {
    type: 'Scroll',
    parent: '-',
    dom: '<div class="ql-editor">',
    scope: 'BLOCK',
    desc: '根节点，管理整个文档树',
    features: ['不可格式化', '始终存在', '唯一'],
  },
  {
    type: 'Block',
    parent: 'Scroll',
    dom: '<p>, <h1>, <blockquote>',
    scope: 'BLOCK',
    desc: '块级元素，独占一行',
    features: ['段落、标题、列表项', '可包含 Inline/Embed', '可设置行级格式'],
  },
  {
    type: 'Inline',
    parent: 'Block',
    dom: '<strong>, <em>, <a>',
    scope: 'INLINE',
    desc: '行内格式，可嵌套',
    features: ['加粗、斜体、链接', '可嵌套组合', '通过 attributes 传递数据'],
  },
  {
    type: 'Embed',
    parent: 'Block',
    dom: '<img>, <iframe>',
    scope: 'INLINE',
    desc: '嵌入内容，不可编辑',
    features: ['图片、视频、公式', '长度固定为 1', '通过 value 传递数据'],
  },
  {
    type: 'Text',
    parent: 'Block',
    dom: '#text',
    scope: 'INLINE',
    desc: '纯文本节点',
    features: ['叶子节点', '不可格式化', '存储实际文本'],
  },
]

function DeltaDemo() {
  const [selected, setSelected] = useState('basic')
  const example = deltaExamples[selected]

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {Object.entries(deltaExamples).map(([key, ex]) => (
          <Button
            key={key}
            type={selected === key ? 'primary' : 'default'}
            onClick={() => setSelected(key)}
            size="small"
          >
            {ex.title}
          </Button>
        ))}
      </div>
      <div style={{ marginBottom: '12px' }}>
        <Text type="secondary">{example.desc}</Text>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong>Delta JSON</Text>
          <CodeBlock code={example.code} language="json" />
        </div>
        <div>
          <Text strong>渲染结果</Text>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', marginTop: '8px', minHeight: '100px' }}>
            {example.render}
          </div>
        </div>
      </div>
    </div>
  )
}

function BlotHierarchy() {
  const [selected, setSelected] = useState('Block')

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {blotTypes.map((blot) => (
          <div
            key={blot.type}
            onClick={() => setSelected(blot.type)}
            style={{
              padding: '16px',
              background: selected === blot.type ? '#e3f2fd' : '#f8f9fa',
              border: selected === blot.type ? '2px solid #2962ff' : '2px solid transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text strong style={{ fontSize: '16px' }}>{blot.type}</Text>
                <Tag style={{ marginLeft: '8px' }}>{blot.scope}</Tag>
              </div>
              <code style={{ fontSize: '12px', color: '#666' }}>{blot.dom}</code>
            </div>
            {selected === blot.type && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ marginBottom: '8px' }}>{blot.desc}</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {blot.features.map((f, i) => (
                    <Tag key={i} color="blue">{f}</Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ArchitecturePage() {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
      <Title level={1}>
        <BlockOutlined style={{ marginRight: '12px' }} />
        深入理解 Quill 架构
      </Title>
      <Paragraph type="secondary" style={{ fontSize: '16px', marginBottom: '40px' }}>
        从基础概念到核心实现，全面理解富文本编辑器的设计与实现
      </Paragraph>

      {/* ========== 第一部分：富文本基础 ========== */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <FileTextOutlined style={{ fontSize: '24px', color: '#2962ff' }} />
          <Title level={3} style={{ margin: 0 }}>一、什么是富文本</Title>
        </div>

        <Paragraph>
          <Text strong>纯文本（Plain Text）</Text>只包含字符内容，没有格式信息。例如 <code>"Hello World"</code> 就是纯文本。
        </Paragraph>
        <Paragraph>
          <Text strong>富文本（Rich Text）</Text>在纯文本基础上添加了格式信息：加粗、斜体、颜色、链接、图片等。
        </Paragraph>

        <Divider orientation="left">核心问题</Divider>

        <Paragraph>
          <Text strong>如何存储富文本？</Text>这是所有富文本编辑器都要解决的根本问题。有三种主流方案：
        </Paragraph>

        <Table
          columns={[
            { title: '方案', dataIndex: 'scheme', render: (t) => <code>{t}</code> },
            { title: '格式表示', dataIndex: 'format' },
            { title: '优点', dataIndex: 'pros' },
            { title: '缺点', dataIndex: 'cons' },
          ]}
          dataSource={[
            {
              key: '1',
              scheme: 'HTML',
              format: '标签：<b>Hello</b>',
              pros: '浏览器原生支持，直观',
              cons: '格式不唯一，难以 diff',
            },
            {
              key: '2',
              scheme: 'Markdown',
              format: '标记：**Hello**',
              pros: '简洁易读，适合纯文本',
              cons: '表达能力有限，难以嵌套',
            },
            {
              key: '3',
              scheme: 'Delta (JSON)',
              format: '{ insert: "Hello", attributes: { bold: true } }',
              pros: '规范唯一，易于 diff/transform',
              cons: '需要自定义渲染',
            },
          ]}
          pagination={false}
          size="small"
          style={{ marginTop: '16px' }}
        />

        <Alert
          message="为什么 Quill 选择 Delta？"
          description="Delta 格式是规范的（Canonical）：相同内容只有一种表示。这使得 diff、compose、transform 变得可靠，是协作编辑的基础。"
          type="info"
          showIcon
          style={{ marginTop: '16px' }}
        />
      </Card>

      {/* ========== 第二部分：Delta 格式详解 ========== */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <CodeOutlined style={{ fontSize: '24px', color: '#9c27b0' }} />
          <Title level={3} style={{ margin: 0 }}>二、Delta 格式详解</Title>
        </div>

        <Paragraph>
          Delta 是 Quill 的数据格式，用 JSON 表示富文本。它的设计哲学：<Text strong>Delta 既是文档，也是变更</Text>。
        </Paragraph>

        <Divider orientation="left">三种操作</Divider>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', background: '#e8f5e9', borderRadius: '8px' }}>
            <Text strong style={{ color: '#2e7d32' }}>insert</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              插入文本或嵌入内容<br />
              <code>{'{ insert: "Hello" }'}</code><br />
              <code>{'{ insert: { image: "url" } }'}</code>
            </div>
          </div>
          <div style={{ padding: '16px', background: '#ffebee', borderRadius: '8px' }}>
            <Text strong style={{ color: '#c62828' }}>delete</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              删除指定数量的字符<br />
              <code>{'{ delete: 5 }'}</code><br />
              不包含被删除的内容
            </div>
          </div>
          <div style={{ padding: '16px', background: '#e3f2fd', borderRadius: '8px' }}>
            <Text strong style={{ color: '#1565c0' }}>retain</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              保留字符，可选应用格式<br />
              <code>{'{ retain: 5 }'}</code><br />
              <code>{'{ retain: 5, attributes: { bold: true } }'}</code>
            </div>
          </div>
        </div>

        <Divider orientation="left">交互示例</Divider>

        <DeltaDemo />

        <Divider orientation="left">关键设计原则</Divider>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <Text strong>规范性（Canonical）</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              相同内容只有一种 Delta 表示。<br />
              不能有 <code>{'{ bold: false }'}</code>，只能省略。<br />
              不能有空的 attributes 对象。
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <Text strong>紧凑性（Compact）</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              相邻相同格式会自动合并。<br />
              <code>Hello</code> + <code>World</code> 不会分成两个 insert。<br />
              减少数据量，提高性能。
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <Text strong>顺序性（Sequential）</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              操作从头到尾依次执行。<br />
              不需要记录位置索引。<br />
              retain = "跳过"，不是"定位"。
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
            <Text strong>可组合性（Composable）</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              Delta 可以 compose（合并）、transform（转换）。<br />
              这是协作编辑的基础。<br />
              后面会详细讲解。
            </div>
          </div>
        </div>
      </Card>

      {/* ========== 第三部分：contenteditable 的问题 ========== */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <EditOutlined style={{ fontSize: '24px', color: '#f44336' }} />
          <Title level={3} style={{ margin: 0 }}>三、contenteditable 的问题</Title>
        </div>

        <Paragraph>
          浏览器提供了 <code>contenteditable</code> 属性，可以让 HTML 元素变成可编辑的。但直接使用它会遇到严重问题：
        </Paragraph>

        <Divider orientation="left">问题 1：浏览器差异</Divider>

        <Paragraph>
          同一个"加粗"操作，不同浏览器生成不同的 HTML：
        </Paragraph>

        <CodeBlock code={`// Chrome
<b>Hello</b>

// Firefox  
<strong>Hello</strong>

// Safari
<span style="font-weight: bold;">Hello</span>

// Edge (旧版)
<STRONG>Hello</STRONG>`} language="html" />

        <Paragraph style={{ marginTop: '16px' }}>
          这导致：无法通过比较 HTML 来判断内容是否相同。
        </Paragraph>

        <Divider orientation="left">问题 2：execCommand 的不确定性</Divider>

        <Paragraph>
          浏览器提供的 <code>document.execCommand()</code> API 行为不一致：
        </Paragraph>

        <CodeBlock code={`// 加粗
document.execCommand('bold', false, null);

// 问题：
// 1. 不知道它会生成 <b> 还是 <strong>
// 2. 不知道它会影响哪些字符
// 3. 不知道它会不会影响相邻格式
// 4. 不同浏览器行为不同

// 而且：execCommand 已被废弃！`} language="javascript" />

        <Divider orientation="left">问题 3：无法精确追踪变更</Divider>

        <Paragraph>
          用户输入后，我们只能看到最终的 HTML，不知道：
        </Paragraph>
        <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
          <li>用户具体改了什么（插入？删除？格式化？）</li>
          <li>改了哪些字符</li>
          <li>改之前是什么样</li>
        </ul>

        <Paragraph style={{ marginTop: '16px' }}>
          这导致：<Text strong>撤销/重做很难实现</Text>，<Text strong>协作编辑几乎不可能</Text>。
        </Paragraph>
      </Card>

      {/* ========== 第四部分：Quill 的解决方案 ========== */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <BulbOutlined style={{ fontSize: '24px', color: '#ff9800' }} />
          <Title level={3} style={{ margin: 0 }}>四、Quill 的解决方案</Title>
        </div>

        <Paragraph>
          Quill 的核心思想：<Text strong>不依赖 DOM 作为数据源，维护自己的数据模型</Text>。
        </Paragraph>

        <Divider orientation="left">数据流对比</Divider>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '16px' }}>
          <div style={{ padding: '20px', background: '#fff3e0', borderRadius: '8px' }}>
            <Text strong style={{ color: '#e65100' }}>❌ 传统方案</Text>
            <div style={{ marginTop: '12px', fontFamily: 'monospace', fontSize: '13px', background: 'white', padding: '12px', borderRadius: '4px' }}>
              用户输入<br />
              &nbsp;&nbsp;↓<br />
              DOM (浏览器生成 HTML)<br />
              &nbsp;&nbsp;↓<br />
              HTML 字符串<br />
              &nbsp;&nbsp;↓<br />
              存储/传输
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#e65100' }}>
              问题：HTML 不规范，难以 diff
            </div>
          </div>
          <div style={{ padding: '20px', background: '#e8f5e9', borderRadius: '8px' }}>
            <Text strong style={{ color: '#2e7d32' }}>✅ Quill 方案</Text>
            <div style={{ marginTop: '12px', fontFamily: 'monospace', fontSize: '13px', background: 'white', padding: '12px', borderRadius: '4px' }}>
              用户输入<br />
              &nbsp;&nbsp;↓<br />
              DOM (临时，立即转换)<br />
              &nbsp;&nbsp;↓<br />
              Delta (规范的 JSON)<br />
              &nbsp;&nbsp;↓<br />
              渲染回 DOM (规范的 HTML)<br />
              &nbsp;&nbsp;↓<br />
              存储/传输
            </div>
            <div style={{ marginTop: '12px', fontSize: '13px', color: '#2e7d32' }}>
              优势：Delta 规范，易于 diff/transform
            </div>
          </div>
        </div>

        <Divider orientation="left">核心循环</Divider>

        <CodeBlock code={`// Quill 的核心循环（简化版）

// 1. 用户输入 → DOM 变化
editor.addEventListener('input', () => {
  // 2. 将 DOM 转换为 Delta
  const newDelta = domToDelta(editor);
  
  // 3. 计算变更
  const change = oldDelta.diff(newDelta);
  
  // 4. 更新数据模型
  oldDelta = newDelta;
  
  // 5. 触发事件（用于协作、历史记录等）
  emit('text-change', change);
});

// 6. 渲染：Delta → DOM
function render(delta) {
  editor.innerHTML = '';
  // 遍历 delta.ops，创建 DOM 节点
  // ...
}`} language="javascript" />
      </Card>

      {/* ========== 第五部分：Parchment 文档模型 ========== */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ApiOutlined style={{ fontSize: '24px', color: '#9c27b0' }} />
          <Title level={3} style={{ margin: 0 }}>五、Parchment 文档模型</Title>
        </div>

        <Paragraph>
          Parchment 是 Quill 的文档模型库，定义了 <Text strong>Blot（墨迹）</Text>系统。Blot 是 DOM 节点的抽象，每种内容类型对应一个 Blot 类。
        </Paragraph>

        <Divider orientation="left">Blot 类型体系</Divider>

        <BlotHierarchy />

        <Divider orientation="left">创建自定义 Blot</Divider>

        <Paragraph>
          通过继承基础 Blot 类，可以创建自定义格式和嵌入内容：
        </Paragraph>

        <CodeBlock code={`// 1. Inline Blot（行内格式）
const Inline = Quill.import('blots/inline');

class BoldBlot extends Inline {
  static blotName = 'bold';      // 格式名称（用于 API）
  static tagName = 'strong';     // HTML 标签
}
Quill.register(BoldBlot);

// 2. 带属性的 Inline Blot
class LinkBlot extends Inline {
  static blotName = 'link';
  static tagName = 'a';

  static create(value) {
    const node = super.create();
    node.setAttribute('href', value);
    node.setAttribute('target', '_blank');
    return node;
  }

  static formats(node) {
    return node.getAttribute('href');
  }
}
Quill.register(LinkBlot);

// 3. BlockEmbed Blot（块级嵌入）
const BlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends BlockEmbed {
  static blotName = 'image';
  static tagName = 'img';

  static create(value) {
    const node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('alt', value.alt || '');
    return node;
  }

  static value(node) {
    return {
      url: node.getAttribute('src'),
      alt: node.getAttribute('alt'),
    };
  }
}
Quill.register(ImageBlot);

// 使用
quill.formatText(0, 5, 'bold', true);
quill.formatText(0, 5, 'link', 'https://example.com');
quill.insertEmbed(0, 'image', { url: '...', alt: '...' });`} language="javascript" />

        <Divider orientation="left">Registry（注册表）</Divider>

        <Paragraph>
          所有 Blot 必须注册到 Registry 才能使用。Registry 负责：
        </Paragraph>
        <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
          <li>根据 blotName 查找 Blot 类</li>
          <li>根据 DOM 节点创建对应的 Blot 实例</li>
          <li>管理 Attributor（属性格式）</li>
        </ul>

        <CodeBlock code={`// 注册
Quill.register(BoldBlot);
Quill.register(LinkBlot);

// 导入
const Inline = Quill.import('blots/inline');

// 查询
const blot = Quill.registry.query('bold');`} language="javascript" />
      </Card>

      {/* ========== 第六部分：Quill 核心架构 ========== */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ThunderboltOutlined style={{ fontSize: '24px', color: '#2196f3' }} />
          <Title level={3} style={{ margin: 0 }}>六、Quill 核心架构</Title>
        </div>

        <Paragraph>
          Quill 由 5 个核心层组成，每层都有明确的职责：
        </Paragraph>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {[
            { name: '应用层', desc: '你的代码，调用 Quill API', color: '#e3f2fd', code: 'quill.formatText(0, 5, "bold", true)' },
            { name: 'Quill 核心', desc: '提供 API，协调各模块', color: '#e8f5e9', code: 'class Quill { formatText() { ... } }' },
            { name: 'Editor', desc: '编辑逻辑，DOM↔Delta 转换', color: '#fff3e0', code: 'class Editor { updateContents() { ... } }' },
            { name: 'Parchment', desc: '文档模型，Blot 系统', color: '#f3e5f5', code: 'class Block extends Blot { ... }' },
            { name: 'Delta', desc: '数据格式，表示文档和变更', color: '#fce4ec', code: '{ ops: [...] }' },
          ].map((layer, i) => (
            <div key={i} style={{ padding: '16px', background: layer.color, borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text strong>{layer.name}</Text>
                <code style={{ fontSize: '12px', color: '#666' }}>{layer.code}</code>
              </div>
              <div style={{ marginTop: '4px', fontSize: '13px', color: '#666' }}>{layer.desc}</div>
            </div>
          ))}
        </div>

        <Divider orientation="left">核心 API</Divider>

        <CodeBlock code={`// 创建编辑器
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: [...],
    history: { delay: 1000 },
  }
});

// 内容操作
quill.insertText(0, 'Hello', { bold: true });
quill.deleteText(0, 5);
quill.formatText(0, 5, 'italic', true);
quill.insertEmbed(0, 'image', { url: '...' });

// 获取内容
const delta = quill.getContents();  // Delta 对象
const text = quill.getText();       // 纯文本

// 事件监听
quill.on('text-change', (delta, oldDelta, source) => {
  console.log('变更:', delta);
  console.log('来源:', source); // 'user' 或 'api'
});

quill.on('selection-change', (range, oldRange, source) => {
  console.log('选区:', range); // { index, length }
});`} language="javascript" />
      </Card>

      {/* ========== 第七部分：Delta 高级操作 ========== */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <ThunderboltOutlined style={{ fontSize: '24px', color: '#ff5722' }} />
          <Title level={3} style={{ margin: 0 }}>七、Delta 高级操作</Title>
        </div>

        <Paragraph>
          Delta 不仅仅是数据格式，它还支持高级操作，这是协作编辑的基础：
        </Paragraph>

        <Collapse
          style={{ marginTop: '16px' }}
          items={[
            {
              key: 'compose',
              label: <Text strong>compose - 合并变更</Text>,
              children: (
                <div>
                  <Paragraph>
                    将两个连续的变更合并成一个：
                  </Paragraph>
                  <CodeBlock code={`const a = new Delta().retain(5).insert(' World');
const b = new Delta().retain(11).insert('!');

// compose = 先执行 a，再执行 b
const composed = a.compose(b);
// 结果: retain(5).insert(' World!')

// 用途：
// 1. 批量操作（合并多个小变更）
// 2. 网络传输优化（减少请求次数）`} language="javascript" />
                </div>
              ),
            },
            {
              key: 'transform',
              label: <Text strong>transform - 解决冲突（协作核心）</Text>,
              children: (
                <div>
                  <Paragraph>
                    两个人同时编辑同一文档，如何合并？transform 告诉我们如何调整：
                  </Paragraph>
                  <CodeBlock code={`// 文档："Hello"
// 用户 A：在位置 5 插入 " World"
const a = new Delta().retain(5).insert(' World');

// 用户 B：在位置 5 插入 "!"
const b = new Delta().retain(5).insert('!');

// A 先到达服务器
// transform 告诉我们：b 相对于 a，应该如何调整
const transformed = a.transform(b, true);
// transformed = retain(11).insert('!')
// "!" 现在会插入到 " World" 后面

// 最终结果：Hello World!`} language="javascript" />
                </div>
              ),
            },
            {
              key: 'diff',
              label: <Text strong>diff - 计算差异</Text>,
              children: (
                <div>
                  <Paragraph>
                    计算两个文档之间的差异：
                  </Paragraph>
                  <CodeBlock code={`const old = new Delta().insert('Hello');
const new_ = new Delta().insert('Hello World');

const diff = old.diff(new_);
// diff = retain(5).insert(' World')

// 用途：
// 1. 撤销/重做
// 2. 版本对比
// 3. 自动保存（只保存变更）`} language="javascript" />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* ========== 总结 ========== */}
      <Card style={{ marginBottom: '24px' }}>
        <Title level={3}>总结</Title>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
          <div style={{ padding: '16px', background: '#e3f2fd', borderRadius: '8px' }}>
            <Text strong>富文本 = 纯文本 + 格式信息</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              需要一种方式来存储"文字"和"格式"
            </div>
          </div>
          <div style={{ padding: '16px', background: '#e8f5e9', borderRadius: '8px' }}>
            <Text strong>contenteditable 不可靠</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              浏览器差异大，execCommand 不确定
            </div>
          </div>
          <div style={{ padding: '16px', background: '#fff3e0', borderRadius: '8px' }}>
            <Text strong>Quill 维护自己的数据模型</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              Delta（数据格式）+ Parchment（文档模型）
            </div>
          </div>
          <div style={{ padding: '16px', background: '#f3e5f5', borderRadius: '8px' }}>
            <Text strong>Delta 支持高级操作</Text>
            <div style={{ marginTop: '8px', fontSize: '13px', color: '#666' }}>
              compose、transform、diff → 协作编辑
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}