import React from 'react'
import { Highlight, themes } from 'prism-react-renderer'

export default function CodeBlock({ code, language = 'javascript' }) {
  return (
    <Highlight theme={themes.nightOwl} code={code.trim()} language={language}>
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          style={{
            ...style,
            padding: '16px',
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
  )
}