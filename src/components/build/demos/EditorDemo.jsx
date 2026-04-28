import React, { useState, useRef, useEffect } from 'react'
import { Typography, Button } from 'antd'
import CodeBlock from '../../CodeBlock'

const { Text } = Typography

const formatButtons = [
  { key: 'bold', label: 'B', style: { fontWeight: 'bold' }, command: 'bold' },
  { key: 'italic', label: 'I', style: { fontStyle: 'italic' }, command: 'italic' },
  { key: 'underline', label: 'U', style: { textDecoration: 'underline' }, command: 'underline' },
  { key: 'strikeThrough', label: 'S', style: { textDecoration: 'line-through' }, command: 'strikeThrough' },
]

export default function EditorDemo() {
  const [delta, setDelta] = useState([{ insert: '试试输入文字...\n' }])
  const containerRef = useRef(null)
  const [history, setHistory] = useState([[{ insert: '试试输入文字...\n' }]])
  const [historyIndex, setHistoryIndex] = useState(0)

  useEffect(() => {
    if (containerRef.current && !containerRef.current.innerHTML.includes('试试输入文字')) {
      containerRef.current.innerHTML = '<div>试试输入文字...</div>'
    }
  }, [])

  const handleInput = () => {
    if (containerRef.current) {
      const newDelta = [{ insert: containerRef.current.innerText + '\n' }]
      setDelta(newDelta)
      const newHistory = [...history.slice(0, historyIndex + 1), newDelta]
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setDelta(history[newIndex])
      if (containerRef.current) {
        const content = history[newIndex][0].insert.replace(/\n$/, '')
        containerRef.current.innerHTML = `<div>${content}</div>`
      }
    }
  }

  const handleFormat = (command) => {
    document.execCommand(command, false, null)
    containerRef.current?.focus()
    handleInput()
  }

  const extractDelta = () => {
    if (!containerRef.current) return
    const ops = []
    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_TEXT
    )
    while (walker.nextNode()) {
      const text = walker.currentNode.textContent
      if (text) {
        let parent = walker.currentNode.parentElement
        const attrs = {}
        while (parent && parent !== containerRef.current) {
          const tag = parent.tagName?.toLowerCase()
          if (tag === 'b' || tag === 'strong') attrs.bold = true
          if (tag === 'i' || tag === 'em') attrs.italic = true
          if (tag === 'u') attrs.underline = true
          if (tag === 's' || tag === 'strike') attrs.strike = true
          parent = parent.parentElement
        }
        ops.push({
          insert: text,
          ...(Object.keys(attrs).length > 0 && { attributes: attrs })
        })
      }
    }
    ops.push({ insert: '\n' })
    return ops
  }

  const handleFormatBtn = (command) => {
    if (containerRef.current) {
      handleFormat(command)
      setTimeout(() => {
        const ops = extractDelta()
        if (ops) {
          setDelta(ops)
        }
      }, 0)
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e0e0e0',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    }}>
      <div style={{
        padding: '12px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28ca41' }} />
        </div>
        <Text style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>Mini Quill Editor</Text>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px' }}>
          <Button
            size="small"
            ghost
            style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
            onClick={handleUndo}
            disabled={historyIndex <= 0}
          >
            ↩ 撤销
          </Button>
        </div>
      </div>

      <div style={{
        padding: '8px 12px',
        background: '#f8f9fa',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        gap: '4px'
      }}>
        {formatButtons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => handleFormatBtn(btn.command)}
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '13px',
              cursor: 'pointer',
              ...btn.style,
            }}
          >
            {btn.label}
          </button>
        ))}
        <div style={{ width: '1px', background: '#d9d9d9', margin: '0 4px' }} />
        {['H1', 'H2', 'H3'].map((btn) => (
          <div
            key={btn}
            style={{
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'white',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'not-allowed',
              color: '#999',
            }}
            title="暂未实现"
          >
            {btn}
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={(e) => {
          if (e.ctrlKey || e.metaKey) {
            if (e.key === 'b') {
              e.preventDefault()
              handleFormatBtn('bold')
            } else if (e.key === 'i') {
              e.preventDefault()
              handleFormatBtn('italic')
            } else if (e.key === 'u') {
              e.preventDefault()
              handleFormatBtn('underline')
            }
          }
        }}
        style={{
          padding: '20px',
          minHeight: '150px',
          outline: 'none',
          fontSize: '15px',
          lineHeight: '1.7',
        }}
      >
        试试输入文字...
      </div>

      <div style={{ padding: '12px 16px', background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>Delta 输出：</Text>
        <CodeBlock code={JSON.stringify(delta, null, 2)} language="json" />
      </div>
    </div>
  )
}
