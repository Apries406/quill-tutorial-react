import React, { useState } from 'react'
import { Typography } from 'antd'

const { Text } = Typography

export default function SelectionDemo() {
  const [info, setInfo] = useState({ index: 0, length: 0, text: '-' })

  const handleSelect = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      setInfo({
        index: range.startOffset,
        length: selection.toString().length,
        text: selection.toString() || '-',
      })
    }
  }

  return (
    <div>
      <div
        onMouseUp={handleSelect}
        onKeyUp={handleSelect}
        style={{
          padding: '16px',
          background: 'white',
          border: '2px solid #2962ff',
          borderRadius: '8px',
          cursor: 'text',
          userSelect: 'text',
          minHeight: '80px',
          lineHeight: '1.7',
        }}
      >
        这是一段测试文本，请选择部分内容来查看选区信息。选区包含两个关键数据：index（光标位置）和 length（选区长度）。
      </div>
      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ padding: '12px', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#1565c0' }}>{info.index}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>光标位置</div>
        </div>
        <div style={{ padding: '12px', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#2e7d32' }}>{info.length}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>选区长度</div>
        </div>
        <div style={{ padding: '12px', background: '#fff3e0', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#e65100', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{info.text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>选中文本</div>
        </div>
      </div>
    </div>
  )
}
