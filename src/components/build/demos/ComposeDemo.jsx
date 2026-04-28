import React, { useState } from 'react'
import { Typography, Card, Divider, Tag, Button, Space } from 'antd'
import CodeBlock from '../../CodeBlock'

const { Text } = Typography

function OpRow({ label, type, value, attrs, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 12px',
      background: color || '#f5f5f5',
      borderRadius: '6px',
      marginBottom: '4px',
    }}>
      <Tag size="small" color={type === 'insert' ? 'green' : type === 'delete' ? 'red' : 'blue'}>
        {type}
      </Tag>
      <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
        {label}: <strong>{value}</strong>
      </span>
      {attrs && (
        <Tag size="small" color="purple">{attrs}</Tag>
      )}
    </div>
  )
}

export default function ComposeDemo() {
  const [showCompose, setShowCompose] = useState(false)

  const a = { ops: [{ retain: 5 }, { insert: ' World' }] }
  const b = { ops: [{ retain: 11 }, { insert: '!' }] }
  const composed = { ops: [{ retain: 5 }, { insert: ' World!' }] }

  return (
    <div>
      <Text type="secondary" style={{ display: 'block', marginBottom: '12px' }}>
        compose 将两个连续的变更合并成一个
      </Text>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'center' }}>
        <div>
          <Text strong>操作 A</Text>
          <Text type="secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
            在末尾加 " World"
          </Text>
          <OpRow label="retain" type="retain" value="5" />
          <OpRow label="insert" type="insert" value='" World"' color="#e8f5e9" />
        </div>

        <div style={{ fontSize: '24px', color: '#666' }}>+</div>

        <div>
          <Text strong>操作 B</Text>
          <Text type="secondary" style={{ display: 'block', marginBottom: '8px', fontSize: '12px' }}>
            在末尾加 "!"
          </Text>
          <OpRow label="retain" type="retain" value="11" />
          <OpRow label="insert" type="insert" value='"!"' color="#e8f5e9" />
        </div>
      </div>

      <Divider style={{ margin: '24px 0' }} />

      <Button type="primary" onClick={() => setShowCompose(!showCompose)}>
        {showCompose ? '隐藏 compose 结果' : '显示 compose 结果'}
      </Button>

      {showCompose && (
        <div style={{ marginTop: '16px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>合并后的 Delta</Text>
          <div style={{
            padding: '16px',
            background: '#e8f5e9',
            borderRadius: '8px',
            marginBottom: '16px',
          }}>
            <OpRow label="retain" type="retain" value="5" />
            <OpRow label="insert" type="insert" value='" World!"' color="#c8e6c9" />
          </div>

          <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
            JSON 表示：
          </Text>
          <CodeBlock code={JSON.stringify(composed, null, 2)} language="json" />

          <Card style={{ marginTop: '16px', background: '#fff3e0' }}>
            <Text strong>💡 为什么需要 compose？</Text>
            <ul style={{ marginTop: '8px', fontSize: '13px', marginLeft: '20px' }}>
              <li>批量操作：多次小变更合并成一次大变更</li>
              <li>网络优化：减少传输次数</li>
              <li>历史压缩：撤销历史占用空间更小</li>
            </ul>
          </Card>
        </div>
      )}

      <Card style={{ marginTop: '16px', background: '#f3e5f5' }}>
        <Text strong>📝 compose 规则</Text>
        <div style={{ marginTop: '12px', fontSize: '13px' }}>
          <div style={{ marginBottom: '8px' }}>
            <Tag color="green">insert</Tag> + <Tag color="blue">retain</Tag> = 直接添加 insert
          </div>
          <div style={{ marginBottom: '8px' }}>
            <Tag color="red">delete</Tag> + 任何 = 保留 delete
          </div>
          <div>
            <Tag color="blue">retain</Tag> + <Tag color="blue">retain</Tag> = 合并 attributes
          </div>
        </div>
      </Card>
    </div>
  )
}
