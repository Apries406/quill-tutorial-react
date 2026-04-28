import React, { useState } from 'react'
import { Typography, Alert } from 'antd'
import CodeBlock from '../../CodeBlock'

const { Text } = Typography

export default function InitDemo() {
  const [html, setHtml] = useState('<p>试试在这里输入...</p>')

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong>编辑器</Text>
          <div
            contentEditable
            onInput={(e) => setHtml(e.currentTarget.innerHTML)}
            style={{
              padding: '16px',
              marginTop: '8px',
              background: 'white',
              border: '2px solid #2962ff',
              borderRadius: '8px',
              minHeight: '120px',
              outline: 'none',
              lineHeight: '1.7',
            }}
          >
            <p>试试在这里输入...</p>
          </div>
        </div>
        <div>
          <Text strong>浏览器生成的 HTML</Text>
          <CodeBlock code={html} language="html" />
        </div>
      </div>
      <Alert
        message="问题：我们无法控制浏览器生成什么 HTML"
        description="不同浏览器可能生成不同的标签（b vs strong），这导致无法精确追踪变更。"
        type="warning"
        showIcon
        style={{ marginTop: '16px' }}
      />
    </div>
  )
}
