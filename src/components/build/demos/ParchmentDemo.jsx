import React, { useState } from 'react'
import { Typography, Tag, Card, Space, Divider } from 'antd'
import CodeBlock from '../../CodeBlock'

const { Text } = Typography

const blotTypes = [
  { type: 'Scroll', tag: '<div class="ql-editor">', scope: 'BLOCK', desc: '根节点，管理整个文档', example: '最外层容器' },
  { type: 'Block', tag: '<p>', scope: 'BLOCK', desc: '块级元素，独占一行', example: '<p>段落</p>' },
  { type: 'Inline', tag: '<span>, <strong>', scope: 'INLINE', desc: '行内格式，可嵌套', example: '<strong>加粗</strong>' },
  { type: 'Embed', tag: '<img>', scope: 'INLINE', desc: '嵌入内容，长度固定为1', example: '<img src="...">' },
  { type: 'Text', tag: '#text', scope: 'INLINE', desc: '纯文本节点，叶子节点', example: '这是文本' },
]

function BlotTree({ depth = 0, children }) {
  return (
    <div style={{ marginLeft: depth * 20 }}>
      {children}
    </div>
  )
}

export default function ParchmentDemo() {
  const [selected, setSelected] = useState('Block')

  const selectedBlot = blotTypes.find(b => b.type === selected)

  return (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
        点击 Blot 类型，了解其作用和对应的 HTML 标签
      </Text>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: '12px' }}>Blot 类型体系</Text>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {blotTypes.map((blot) => (
              <div
                key={blot.type}
                onClick={() => setSelected(blot.type)}
                style={{
                  padding: '12px 16px',
                  background: selected === blot.type ? '#e3f2fd' : '#f5f5f5',
                  border: selected === blot.type ? '2px solid #2962ff' : '2px solid transparent',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text strong>{blot.type}</Text>
                  <Tag size="small">{blot.scope}</Tag>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>{blot.desc}</Text>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: '12px' }}>详情</Text>
          {selectedBlot && (
            <Card size="small" style={{ background: '#fafafa' }}>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary">HTML 标签：</Text>
                <CodeBlock code={selectedBlot.tag} language="html" />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <Text type="secondary">说明：</Text>
                <p style={{ margin: '4px 0', fontSize: '13px' }}>{selectedBlot.desc}</p>
              </div>
              <div>
                <Text type="secondary">示例：</Text>
                <div style={{ marginTop: '4px', padding: '8px', background: 'white', borderRadius: '4px', fontSize: '13px' }}>
                  {selectedBlot.example}
                </div>
              </div>
            </Card>
          )}

          <Divider />

          <Text strong style={{ display: 'block', marginBottom: '12px' }}>文档树结构</Text>
          <div style={{
            padding: '16px',
            background: '#f5f5f5',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: 'monospace',
          }}>
            <div style={{ color: '#9c27b0' }}>Scroll (根节点)</div>
            <div style={{ marginLeft: '16px', color: '#1565c0' }}>
              <div style={{ color: '#4caf50' }}>Block</div>
              <div style={{ marginLeft: '16px', color: '#ff9800' }}>
                <span style={{ color: '#795548' }}>Inline: </span>
                <span style={{ color: '#9c27b0' }}>"文本内容"</span>
              </div>
              <div style={{ marginLeft: '16px', color: '#795548' }}>
                Inline:
                <span style={{ color: '#9c27b0' }}> "Text 节点"</span>
              </div>
              <div style={{ marginLeft: '16px', color: '#ff5722' }}>
                Embed: &lt;img /&gt;
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card style={{ marginTop: '16px', background: '#f3e5f5' }}>
        <Text strong>📝 Blot 与 DOM 的关系</Text>
        <div style={{ marginTop: '12px', fontSize: '13px' }}>
          <p style={{ marginBottom: '8px' }}>
            <Text code>Blot</Text> 是 <Text code>DOM 节点</Text> 的抽象：
          </p>
          <ul style={{ marginLeft: '20px' }}>
            <li>每种 Blot 类型对应一种 DOM 结构</li>
            <li>Blot 知道如何创建自己的 DOM 节点</li>
            <li>Blot 知道如何从 DOM 节点提取值</li>
            <li>Registry 负责管理所有 Blot 类型</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
