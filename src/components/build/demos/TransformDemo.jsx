import React, { useState } from 'react'
import { Typography, Card, Divider, Tag, Button, Space } from 'antd'
import CodeBlock from '../../CodeBlock'

const { Text } = Typography

function OpTag({ type, value }) {
  return (
    <Tag size="small" color={type === 'insert' ? 'green' : type === 'delete' ? 'red' : 'blue'}>
      {type}: {value}
    </Tag>
  )
}

export default function TransformDemo() {
  const [showTransform, setShowTransform] = useState(false)

  const original = { ops: [{ insert: 'Hello' }] }
  const changeA = { ops: [{ retain: 5 }, { insert: ' World' }] }
  const changeB = { ops: [{ retain: 5 }, { insert: '!' }] }
  const transformed = { ops: [{ retain: 11 }, { insert: '!' }] }

  return (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
        transform 用于解决协作编辑中的并发冲突
      </Text>

      <Card style={{ background: '#f5f5f5', marginBottom: '16px' }}>
        <Text strong>场景：</Text>
        <div style={{ marginTop: '8px', fontSize: '14px' }}>
          <p>📄 文档："<strong>Hello</strong>"</p>
          <p>👤 用户 A：在位置 5 插入 "<strong> World</strong>"</p>
          <p>👤 用户 B：在位置 5 插入 "<strong>!</strong>"</p>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>原始文档</Text>
          <div style={{ padding: '12px', background: 'white', borderRadius: '8px' }}>
            <CodeBlock code={JSON.stringify(original, null, 2)} language="json" />
          </div>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>变更 A（先到达）</Text>
          <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>retain(5) + insert(" World")</Text>
            <CodeBlock code={JSON.stringify(changeA, null, 2)} language="json" />
          </div>
        </div>

        <div>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>变更 B（后到达）</Text>
          <div style={{ padding: '12px', background: '#e3f2fd', borderRadius: '8px' }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>retain(5) + insert("!")</Text>
            <CodeBlock code={JSON.stringify(changeB, null, 2)} language="json" />
          </div>
        </div>
      </div>

      <Divider style={{ margin: '24px 0' }} />

      <Button type="primary" onClick={() => setShowTransform(!showTransform)}>
        {showTransform ? '隐藏 transform 结果' : '显示 transform 结果'}
      </Button>

      {showTransform && (
        <div style={{ marginTop: '16px' }}>
          <Card style={{ background: '#fff3e0', marginBottom: '16px' }}>
            <Text strong style={{ color: '#e65100' }}>⚡ transform 做了什么？</Text>
            <div style={{ marginTop: '8px', fontSize: '13px' }}>
              <p style={{ marginBottom: '8px' }}>
                B 的 <Text code>retain(5)</Text> 需要调整为 <Text code>retain(11)</Text>
              </p>
              <p style={{ color: '#666' }}>
                因为 A 已经插入了 " World"（6 个字符），所以 B 需要跳过更多字符
              </p>
            </div>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Text strong>调整前（B 的原始 Delta）</Text>
              <CodeBlock code={JSON.stringify(changeB, null, 2)} language="json" />
            </div>
            <div>
              <Text strong style={{ display: 'block', marginBottom: '8px' }}>调整后（transformed B）</Text>
              <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <Tag>retain: 11</Tag>
                  <Tag color="green">insert: "!"</Tag>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  现在跳过 11 个字符（Hello + World）
                </Text>
              </div>
            </div>
          </div>

          <Divider />

          <Text strong style={{ display: 'block', marginBottom: '8px' }}>最终结果</Text>
          <Card style={{ background: '#e8f5e9' }}>
            <div style={{ fontSize: '18px' }}>
              Hello<strong style={{ color: '#2e7d32' }}> World</strong><strong style={{ color: '#1565c0' }}>!</strong>
            </div>
            <Text type="secondary" style={{ display: 'block', marginTop: '8px', fontSize: '12px' }}>
              "Hello" + " World"（A 的插入） + "!"（B 的插入）
            </Text>
          </Card>
        </div>
      )}

      <Card style={{ marginTop: '16px', background: '#fce4ec' }}>
        <Text strong>🎯 transform 的核心思想</Text>
        <div style={{ marginTop: '8px', fontSize: '13px' }}>
          <p style={{ marginBottom: '8px' }}>
            当两个用户同时编辑时，先到的变更会先应用
          </p>
          <p style={{ marginBottom: '8px' }}>
            后到的变更需要 <strong>调整位置</strong> 以适应先到的变更
          </p>
          <p style={{ color: '#666' }}>
            这就是协作编辑的基础：transform 保证最终结果的一致性
          </p>
        </div>
      </Card>
    </div>
  )
}
