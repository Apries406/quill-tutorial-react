import React, { useRef } from 'react'
import { Typography, Button } from 'antd'

const { Text } = Typography

export default function FormatterDemo() {
  const containerRef = useRef(null)

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <Button size="small" onMouseDown={(e) => { e.preventDefault(); document.execCommand('bold') }}>
          <strong>B</strong> 加粗
        </Button>
        <Button size="small" onMouseDown={(e) => { e.preventDefault(); document.execCommand('italic') }}>
          <em>I</em> 斜体
        </Button>
        <Button size="small" onMouseDown={(e) => { e.preventDefault(); document.execCommand('underline') }}>
          <u>U</u> 下划线
        </Button>
      </div>
      <div
        ref={containerRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: '选择这段文本，然后点击上方按钮应用格式。格式化的本质是修改 Delta 中文本的 attributes。' }}
        style={{
          padding: '16px',
          background: 'white',
          border: '2px solid #2962ff',
          borderRadius: '8px',
          minHeight: '80px',
          outline: 'none',
          lineHeight: '1.7',
        }}
      />
    </div>
  )
}
