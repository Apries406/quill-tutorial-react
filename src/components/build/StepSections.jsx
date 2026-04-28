import React, { useState } from 'react'
import { Tabs, Typography, Card } from 'antd'
import CodeBlock from '../CodeBlock'

const { Text } = Typography

export default function StepSections({ sections }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!sections || sections.length === 0) {
    return null
  }

  const renderSection = (section, isComplete = false) => (
    <div>
      {isComplete && (
        <Card
          size="small"
          style={{ marginBottom: '12px', background: '#fff3e0', border: '1px solid #ffb74d' }}
          bodyStyle={{ padding: '12px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Text strong style={{ color: '#e65100' }}>
              完整代码对照
            </Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              学习完以上内容后，对照检查
            </Text>
          </div>
        </Card>
      )}
      <Text
        type="secondary"
        style={{ display: 'block', marginBottom: '12px', fontSize: '13px' }}
      >
        {section.desc}
      </Text>
      <CodeBlock code={section.code} language="javascript" />
    </div>
  )

  if (sections.length === 1) {
    return renderSection(sections[0])
  }

  const items = sections.map((section, index) => ({
    key: String(index),
    label: <span style={{ padding: '0 8px' }}>{section.title}</span>,
    children: renderSection(section, section.isComplete),
  }))

  return (
    <Tabs
      activeKey={String(activeIndex)}
      onChange={(key) => setActiveIndex(Number(key))}
      items={items}
      size="small"
      style={{ marginTop: '8px' }}
    />
  )
}