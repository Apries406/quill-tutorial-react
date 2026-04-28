import React, { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'
import { Button, message } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'

const languageLabels = {
  javascript: 'JavaScript',
  html: 'HTML',
  css: 'CSS',
  json: 'JSON',
}

export default function CodeBlock({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      message.error('复制失败')
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1,
      }}>
        <span style={{
          fontSize: '12px',
          color: '#666',
          background: 'rgba(255,255,255,0.9)',
          padding: '2px 8px',
          borderRadius: '4px',
        }}>
          {languageLabels[language] || language}
        </span>
        <Button
          size="small"
          icon={copied ? <CheckOutlined /> : <CopyOutlined />}
          onClick={handleCopy}
          style={{ borderRadius: '4px' }}
        >
          {copied ? '已复制' : '复制'}
        </Button>
      </div>
      <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            style={{
              ...style,
              padding: '16px',
              paddingTop: '40px',
              borderRadius: '8px',
              fontSize: '13px',
              lineHeight: '1.6',
              overflow: 'auto',
              margin: 0,
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '2em',
                    userSelect: 'none',
                    opacity: 0.3,
                    marginRight: '1em',
                  }}
                >
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
