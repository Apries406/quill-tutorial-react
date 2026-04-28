import React from 'react'
import { Typography, Tag, Divider, Space, Button } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'

const { Text } = Typography

export default function StepNavigation({ currentStep, totalSteps, currentIndex, onPrev, onNext, hasPrev, hasNext }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
      <Button
        icon={<ArrowLeftOutlined />}
        disabled={!hasPrev}
        onClick={onPrev}
      >
        上一步
      </Button>

      <Space>
        <Text type="secondary">{currentIndex + 1}</Text>
        <Text type="secondary">/</Text>
        <Text type="secondary">{totalSteps}</Text>
      </Space>

      <Button
        type="primary"
        onClick={onNext}
        disabled={!hasNext}
      >
        下一步 <ArrowRightOutlined />
      </Button>
    </div>
  )
}
