import React from 'react'
import { Typography, Card } from 'antd'
import { BulbOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function StepThinking({ thinking }) {
  return (
    <Card
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f4f8 100%)',
        borderRadius: '8px',
        marginBottom: '24px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <BulbOutlined style={{ color: '#2962ff', fontSize: '18px' }} />
        <Text strong style={{ color: '#2962ff' }}>设计思路</Text>
      </div>
      <div style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}>{thinking}</div>
    </Card>
  )
}
