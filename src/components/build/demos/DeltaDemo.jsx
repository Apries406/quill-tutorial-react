import React, { useState } from 'react'
import { Typography, Button } from 'antd'
import CodeBlock from '../../CodeBlock'

const { Text } = Typography

export default function DeltaDemo() {
  const [text, setText] = useState('Hello World')
  const [isBold, setIsBold] = useState(false)

  const delta = {
    ops: [
      ...(isBold
        ? [{ insert: text.split(' ')[0], attributes: { bold: true } }]
        : [{ insert: text.split(' ')[0] }]),
      { insert: ' ' },
      ...(text.includes(' ')
        ? [{ insert: text.split(' ').slice(1).join(' ') }]
        : []),
      { insert: '\n' },
    ],
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ flex: 1, padding: '8px 12px', border: '1px solid #d9d9d9', borderRadius: '6px' }}
        />
        <Button
          type={isBold ? 'primary' : 'default'}
          onClick={() => setIsBold(!isBold)}
        >
          <strong>B</strong> 加粗第一个词
        </Button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong>渲染效果</Text>
          <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', marginTop: '8px', minHeight: '80px' }}>
            {isBold ? (
              <div><strong>{text.split(' ')[0]}</strong> {text.split(' ').slice(1).join(' ')}</div>
            ) : (
              <div>{text}</div>
            )}
          </div>
        </div>
        <div>
          <Text strong>Delta JSON</Text>
          <CodeBlock code={JSON.stringify(delta, null, 2)} language="json" />
        </div>
      </div>
    </div>
  )
}
