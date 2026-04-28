import React, { useState } from 'react'
import { Typography, Card, Tabs, Tag, Alert, Collapse, Divider, Space, Button, Table } from 'antd'
import {
  BlockOutlined,
  CodeOutlined,
  ExperimentOutlined,
  BulbOutlined,
  ApiOutlined,
} from '@ant-design/icons'
import CodeBlock from '../components/CodeBlock'

const { Title, Paragraph, Text } = Typography

const blotHierarchy = [
  { type: 'Scroll', parent: '-', dom: '<div>', desc: '根节点，不可格式化', scope: 'BlotScope.BLOCK' },
  { type: 'Block', parent: 'Scroll', dom: '<p>', desc: '段落，独占一行', scope: 'BlotScope.BLOCK' },
  { type: 'Inline', parent: 'Block', dom: '<span>', desc: '行内格式，可嵌套', scope: 'BlotScope.INLINE' },
  { type: 'Embed', parent: 'Block', dom: '<img>', desc: '嵌入内容，不可编辑', scope: 'BlotScope.INLINE' },
  { type: 'Text', parent: 'Block', dom: '#text', desc: '纯文本节点', scope: 'BlotScope.INLINE' },
]

const blotColumns = [
  { title: '类型', dataIndex: 'type', key: 'type', render: (t) => <code>{t}</code> },
  { title: '父类', dataIndex: 'parent', key: 'parent' },
  { title: 'DOM 标签', dataIndex: 'dom', key: 'dom', render: (t) => <code>{t}</code> },
  { title: '说明', dataIndex: 'desc', key: 'desc' },
  { title: '作用域', dataIndex: 'scope', key: 'scope', render: (t) => <Tag>{t}</Tag> },
]

const formattingExamples = [
  {
    name: 'BoldBlot',
    desc: '加粗格式',
    code: `const Inline = Quill.import('blots/inline');

class BoldBlot extends Inline {
  static blotName = 'bold';      // 格式名称
  static tagName = 'strong';     // HTML 标签
}

Quill.register(BoldBlot);

// 使用
quill.formatText(0, 5, 'bold', true);`,
  },
  {
    name: 'LinkBlot',
    desc: '链接格式（带属性）',
    code: `const Inline = Quill.import('blots/inline');

class LinkBlot extends Inline {
  static blotName = 'link';
  static tagName = 'a';

  // 创建 DOM 节点时设置属性
  static create(value) {
    const node = super.create();
    node.setAttribute('href', value);
    node.setAttribute('target', '_blank');
    return node;
  }

  // 从 DOM 节点提取格式值
  static formats(node) {
    return node.getAttribute('href');
  }
}

Quill.register(LinkBlot);

// 使用
quill.formatText(0, 5, 'link', 'https://example.com');`,
  },
  {
    name: 'ImageBlot',
    desc: '图片嵌入',
    code: `const BlockEmbed = Quill.import('blots/block/embed');

class ImageBlot extends BlockEmbed {
  static blotName = 'image';
  static tagName = 'img';

  // 创建 DOM 节点
  static create(value) {
    const node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('alt', value.alt || '');
    return node;
  }

  // 从 DOM 节点提取值
  static value(node) {
    return {
      url: node.getAttribute('src'),
      alt: node.getAttribute('alt'),
    };
  }
}

Quill.register(ImageBlot);

// 使用
quill.insertEmbed(0, 'image', {
  url: 'https://example.com/photo.jpg',
  alt: '示例图片',
});`,
  },
  {
    name: 'HeaderBlot',
    desc: '标题块',
    code: `const Block = Quill.import('blots/block');

class HeaderBlot extends Block {
  static blotName = 'header';
  static tagName = ['H1', 'H2', 'H3']; // 支持多个标签

  // 返回格式值（标题级别）
  static formats(node) {
    return HeaderBlot.tagName.indexOf(node.tagName) + 1;
  }
}

Quill.register(HeaderBlot);

// 使用
quill.formatLine(0, 1, 'header', 1); // H1
quill.formatLine(0, 1, 'header', 2); // H2`,
  },
]

const blotTypes = [
  {
    type: 'Inline',
    usage: '行内格式',
    examples: 'bold, italic, link, color',
    nesting: '可嵌套',
    code: `class MyBlot extends Inline {
  static blotName = 'myformat';
  static tagName = 'span';
  static className = 'my-class';
}`,
  },
  {
    type: 'Block',
    usage: '块级格式',
    examples: 'header, list, blockquote',
    nesting: '不可嵌套',
    code: `class MyBlot extends Block {
  static blotName = 'myblock';
  static tagName = 'div';
}`,
  },
  {
    type: 'BlockEmbed',
    usage: '块级嵌入',
    examples: 'image, video, divider',
    nesting: '不可编辑',
    code: `class MyBlot extends BlockEmbed {
  static blotName = 'myembed';
  static tagName = 'div';
}`,
  },
  {
    type: 'Embed',
    usage: '行内嵌入',
    examples: 'emoji, mention, formula',
    nesting: '不可编辑',
    code: `class MyBlot extends Embed {
  static blotName = 'myinline';
  static tagName = 'span';
}`,
  },
]

function BlotHierarchyDemo() {
  const [selectedBlot, setSelectedBlot] = useState(null)

  const blotDetails = {
    Scroll: {
      desc: '根节点容器，管理整个文档树',
      features: ['不可格式化', '始终存在', '管理子节点'],
      dom: '<div class="ql-editor">',
    },
    Block: {
      desc: '块级元素，独占一行',
      features: ['段落、标题、列表项', '可包含 Inline/Embed', '可设置行级格式'],
      dom: '<p>, <h1>, <blockquote>',
    },
    Inline: {
      desc: '行内格式，可嵌套',
      features: ['加粗、斜体、链接', '可嵌套组合', '通过 attributes 传递数据'],
      dom: '<strong>, <em>, <a>',
    },
    Embed: {
      desc: '嵌入内容，不可编辑',
      features: ['图片、视频、公式', '长度固定为 1', '通过 value 传递数据'],
      dom: '<img>, <iframe>',
    },
    Text: {
      desc: '纯文本节点',
      features: ['叶子节点', '不可格式化', '存储实际文本'],
      dom: '#text',
    },
  }

  return (
    <div>
      <Text strong>点击 Blot 类型查看详情</Text>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginTop: '12px' }}>
        {Object.keys(blotDetails).map((blot) => (
          <div
            key={blot}
            onClick={() => setSelectedBlot(blot)}
            style={{
              padding: '12px',
              background: selectedBlot === blot ? '#e3f2fd' : '#f8f9fa',
              border: selectedBlot === blot ? '2px solid #2962ff' : '2px solid transparent',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '14px' }}>{blot}</div>
          </div>
        ))}
      </div>
      {selectedBlot && (
        <div style={{ marginTop: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
          <Text strong style={{ fontSize: '16px' }}>{selectedBlot}</Text>
          <Paragraph type="secondary" style={{ marginTop: '4px', marginBottom: '12px' }}>
            {blotDetails[selectedBlot].desc}
          </Paragraph>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {blotDetails[selectedBlot].features.map((f, i) => (
              <Tag key={i} color="blue">{f}</Tag>
            ))}
          </div>
          <div style={{ marginTop: '12px' }}>
            <Text type="secondary">DOM: </Text>
            <code>{blotDetails[selectedBlot].dom}</code>
          </div>
        </div>
      )}
    </div>
  )
}

function BlotTypesDemo() {
  const [selectedType, setSelectedType] = useState('Inline')

  const current = blotTypes.find((t) => t.type === selectedType)

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {blotTypes.map((t) => (
          <Button
            key={t.type}
            type={selectedType === t.type ? 'primary' : 'default'}
            onClick={() => setSelectedType(t.type)}
            size="small"
          >
            {t.type}
          </Button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong>用途：{current.usage}</Text>
          <div style={{ marginTop: '8px' }}>
            <Text type="secondary">示例：</Text>
            <div style={{ marginTop: '4px' }}>
              {current.examples.split(', ').map((e, i) => (
                <Tag key={i} style={{ margin: '2px' }}>{e}</Tag>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '8px' }}>
            <Text type="secondary">嵌套：</Text>
            <Tag color={current.nesting === '可嵌套' ? 'green' : 'orange'}>{current.nesting}</Tag>
          </div>
        </div>
        <div>
          <CodeBlock code={current.code} language="javascript" />
        </div>
      </div>
    </div>
  )
}

export default function ParchmentPage() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      <Title level={1}>
        <BlockOutlined style={{ marginRight: '12px' }} />
        Parchment 文档模型
      </Title>
      <Paragraph type="secondary" style={{ fontSize: '16px', marginBottom: '40px' }}>
        深入理解 Quill 的文档模型和 Blot 系统
      </Paragraph>

      <Card title="什么是 Parchment？" style={{ marginBottom: '24px' }}>
        <Paragraph>
          Parchment 是 Quill 的文档模型库，它定义了一套抽象层来表示富文本文档。
          核心概念是 <strong>Blot</strong>（墨迹），它是 DOM 节点的抽象表示。
        </Paragraph>
        <Alert
          message="核心思想"
          description="Parchment 维护一个独立于 DOM 的文档模型。DOM 只是这个模型的渲染输出，而不是数据源。"
          type="info"
          showIcon
          style={{ marginTop: '16px' }}
        />
      </Card>

      <Card title="Blot 类型体系" style={{ marginBottom: '24px' }}>
        <Paragraph>
          Parchment 定义了 5 种基础 Blot 类型，形成一个层次结构：
        </Paragraph>
        <Table
          columns={blotColumns}
          dataSource={blotHierarchy}
          pagination={false}
          size="small"
          style={{ marginTop: '16px' }}
        />
        <div style={{ marginTop: '24px' }}>
          <BlotHierarchyDemo />
        </div>
      </Card>

      <Card title="Blot 分类详解" style={{ marginBottom: '24px' }}>
        <Paragraph>
          根据用途，Blot 分为 4 类，每类有不同的基类和用途：
        </Paragraph>
        <BlotTypesDemo />
      </Card>

      <Card title="自定义 Blot 示例" style={{ marginBottom: '24px' }}>
        <Paragraph>
          通过继承基础 Blot 类，可以创建自定义格式和嵌入内容：
        </Paragraph>
        <Tabs
          items={formattingExamples.map((ex) => ({
            key: ex.name,
            label: (
              <Space>
                <span>{ex.name}</span>
                <Tag color="blue">{ex.desc}</Tag>
              </Space>
            ),
            children: (
              <div>
                <Paragraph type="secondary" style={{ marginBottom: '16px' }}>
                  {ex.desc}
                </Paragraph>
                <CodeBlock code={ex.code} language="javascript" />
              </div>
            ),
          }))}
        />
      </Card>

      <Card title="Parchment 核心机制" style={{ marginBottom: '24px' }}>
        <Collapse
          ghost
          items={[
            {
              key: 'registry',
              label: 'Registry（注册表）',
              children: (
                <div>
                  <Paragraph>
                    所有 Blot 必须注册到 Registry 才能使用。Registry 负责：
                  </Paragraph>
                  <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                    <li>根据 blotName 查找 Blot 类</li>
                    <li>根据 DOM 节点创建对应的 Blot 实例</li>
                    <li>管理 Attributor（属性格式）</li>
                  </ul>
                  <CodeBlock
                    code={`// 注册 Blot
Quill.register(BoldBlot);

// 从 Registry 导入
const Inline = Quill.import('blots/inline');

// 查询 Blot
const blot = Quill.import('parchment').create('bold');`}
                    language="javascript"
                  />
                </div>
              ),
            },
            {
              key: 'attributor',
              label: 'Attributor（属性格式）',
              children: (
                <div>
                  <Paragraph>
                    Attributor 是轻量级的格式表示，不创建新的 DOM 节点，而是添加属性或类名：
                  </Paragraph>
                  <CodeBlock
                    code={`const Attributor = Quill.import('attributors/attribute');
const ClassAttributor = Quill.import('attributors/class');
const StyleAttributor = Quill.import('attributors/style');

// 属性格式：添加 HTML 属性
const IdAttributor = new Attributor('id', 'id');
Quill.register(IdAttributor);

// 类格式：添加 CSS 类名
const AlignClass = new ClassAttributor('align', 'ql-align', {
  scope: Scope.BLOCK,
});
Quill.register(AlignClass);

// 样式格式：添加内联样式
const ColorStyle = new StyleAttributor('color', 'color', {
  scope: Scope.INLINE,
});
Quill.register(ColorStyle);`}
                    language="javascript"
                  />
                </div>
              ),
            },
            {
              key: 'scope',
              label: 'Scope（作用域）',
              children: (
                <div>
                  <Paragraph>
                    Parchment 定义了 3 种作用域，决定 Blot 的行为：
                  </Paragraph>
                  <Table
                    columns={[
                      { title: '作用域', dataIndex: 'scope', key: 'scope', render: (t) => <code>{t}</code> },
                      { title: '说明', dataIndex: 'desc', key: 'desc' },
                      { title: '示例', dataIndex: 'example', key: 'example' },
                    ]}
                    dataSource={[
                      { scope: 'Scope.BLOCK', desc: '块级，独占一行', example: '段落、标题' },
                      { scope: 'Scope.INLINE', desc: '行内，可嵌套', example: '加粗、斜体' },
                      { scope: 'Scope.EMBED', desc: '嵌入，不可编辑', example: '图片、视频' },
                    ]}
                    pagination={false}
                    size="small"
                    style={{ marginTop: '12px' }}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      <Card title="Blot 接口" style={{ marginBottom: '24px' }}>
        <Paragraph>
          每个 Blot 必须实现以下核心方法：
        </Paragraph>
        <CodeBlock
          code={`class Blot {
  // 必须实现的静态属性
  static blotName = 'myblot';    // 格式名称
  static tagName = 'div';         // HTML 标签
  static className = 'my-class';  // CSS 类名（可选）

  // 必须实现的方法
  static create(value) {}         // 创建 DOM 节点
  static formats(node) {}         // 从 DOM 提取格式值
  static value(node) {}           // 从 DOM 提取值

  // 实例方法
  attach() {}                     // 挂载到 DOM
  detach() {}                     // 从 DOM 移除
  insertInto(parent, ref) {}      // 插入到父节点
  remove() {}                     // 移除自身

  // 格式化
  format(name, value) {}          // 应用格式
  formats() {}                    // 获取当前格式

  // 内容操作
  insertAt(index, value) {}       // 在指定位置插入
  deleteAt(index, length) {}      // 删除指定范围

  // 长度
  length() {}                     // 返回内容长度
}`}
          language="javascript"
        />
      </Card>

      <Alert
        message="Parchment vs Delta"
        description={
          <div>
            <p><strong>Parchment</strong> 是文档模型，定义文档的结构和格式。</p>
            <p><strong>Delta</strong> 是数据格式，描述文档内容和变更。</p>
            <p>两者的关系：Parchment 管理 DOM 树，Delta 描述数据流。</p>
          </div>
        }
        type="warning"
        showIcon
        style={{ marginBottom: '24px' }}
      />
    </div>
  )
}