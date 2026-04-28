import React from 'react'
import { Typography, Divider, Tag } from 'antd'
import StepThinking from './StepThinking'
import StepSections from './StepSections'
import * as Demos from './demos'

const { Title } = Typography

export default function StepContent({ step, thinking, sections, demo: DemoComponent }) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>{step.label}</Title>

      <Tag color="blue" style={{ marginBottom: '16px', fontSize: '14px' }}>
        学习目标：{step.learningGoal}
      </Tag>

      <StepThinking thinking={thinking} />

      {DemoComponent && (
        <>
          <Divider><Tag color="blue">交互体验</Tag></Divider>
          <div style={{ marginBottom: '24px' }}>
            <DemoComponent />
          </div>
        </>
      )}

      <Divider><Tag color="blue">代码实现</Tag></Divider>
      <div style={{ marginBottom: '24px' }}>
        <StepSections sections={sections} />
      </div>
    </div>
  )
}
