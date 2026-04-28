import React from 'react'
import { Typography, Menu } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { buildSteps, getActiveSteps, getStepIndex, getProgressPercent } from '../../data/buildSteps'

const { Text } = Typography

export default function StepNav({ currentStep, onStepChange }) {
  const activeSteps = getActiveSteps()
  const currentIndex = getStepIndex(currentStep)
  const progress = getProgressPercent(currentStep)
  const isCompleted = (key) => {
    const stepIdx = getStepIndex(key)
    return stepIdx < currentIndex
  }

  const handleMenuClick = ({ key }) => {
    const step = buildSteps.find(s => s.key === key)
    if (step && !step.disabled) {
      onStepChange(key)
    }
  }

  const menuItems = buildSteps.map((step) => {
    if (step.disabled) {
      return {
        key: step.key,
        label: (
          <Text type="secondary" style={{ fontSize: '12px' }}>{step.label}</Text>
        ),
        disabled: true,
      }
    }

    const completed = isCompleted(step.key)
    return {
      key: step.key,
      icon: completed ? <CheckOutlined style={{ color: '#52c41a' }} /> : null,
      label: step.label,
    }
  })

  return (
    <div
      style={{
        width: '220px',
        background: '#fafafa',
        borderRight: '1px solid #f0f0f0',
        padding: '16px 0',
        flexShrink: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: '0 16px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <Text strong style={{ fontSize: '14px' }}>从零构建 Quill</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>{progress}%</Text>
        </div>
        <div
          style={{
            height: '4px',
            background: '#e0e0e0',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2962ff, #7c4dff)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>

      <Menu
        mode="vertical"
        selectedKeys={[currentStep]}
        onClick={handleMenuClick}
        style={{ border: 'none', background: 'transparent', flex: 1 }}
        items={menuItems}
      />
    </div>
  )
}
