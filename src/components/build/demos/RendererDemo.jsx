import React, { useRef, useEffect } from 'react'
import { Typography } from 'antd'
import CodeBlock from '../../CodeBlock'

const { Text } = Typography

export default function RendererDemo() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      const line1 = document.createElement('div')
      line1.style.padding = '4px 0'
      const strong = document.createElement('strong')
      strong.textContent = 'Hello'
      line1.appendChild(strong)
      line1.appendChild(document.createTextNode(' '))
      const em = document.createElement('em')
      em.textContent = 'World'
      em.style.color = '#e74c3c'
      line1.appendChild(em)
      containerRef.current.appendChild(line1)
      const line2 = document.createElement('div')
      line2.style.padding = '4px 0'
      line2.textContent = '这是第二段'
      containerRef.current.appendChild(line2)
    }
  }, [])

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <Text strong>输入：Delta</Text>
          <CodeBlock code={`{
  ops: [
    { insert: "Hello", attributes: { bold: true } },
    { insert: " " },
    { insert: "World", attributes: { italic: true, color: "#e74c3c" } },
    { insert: "\\n这是第二段\\n" }
  ]
}`} language="json" />
        </div>
        <div>
          <Text strong>输出：DOM</Text>
          <div ref={containerRef} style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', marginTop: '8px', minHeight: '80px' }} />
        </div>
      </div>
    </div>
  )
}
