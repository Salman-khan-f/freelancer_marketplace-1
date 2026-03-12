import { useEffect, useRef, useState } from 'react'
import { useChatContext } from '../../chat/ChatProvider'
import { useAuth } from '../../context/AuthContext'

interface ChatWindowProps {
  taskId: string
}

export function ChatWindow({ taskId }: ChatWindowProps) {
  const { connectToRoom, sendMessage, messages } = useChatContext()
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    void connectToRoom(taskId)
  }, [connectToRoom, taskId])

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    sendMessage(trimmed)
    setInput('')
  }

  return (
    <div
      className="glass"
      style={{
        padding: '1.25rem',
        display: 'flex',
        flexDirection: 'column',
        height: '400px',
        background: 'rgba(255, 255, 255, 0.03)',
      }}
    >
      <div
        ref={listRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: '1rem',
          paddingRight: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifySelf: 'center', opacity: 0.5, fontSize: '0.9rem', textAlign: 'center' }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((m) => (
            <div 
              key={m.id} 
              className="glass"
              style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: '1rem',
                maxWidth: '85%',
                alignSelf: m.senderId === user?.id ? 'flex-end' : 'flex-start',
                background: m.senderId === user?.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: m.senderId === user?.id ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid var(--glass-border)'
              }}
            >
              <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>{m.content}</div>
            </div>
          ))
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
          style={{
            flex: 1,
            borderRadius: '0.75rem',
            border: '1px solid var(--glass-border)',
            padding: '0.6rem 1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            color: 'white',
            outline: 'none',
            fontSize: '0.9rem'
          }}
        />
        <button 
          type="button" 
          className="primary-button" 
          onClick={handleSend}
          style={{ padding: '0.6rem 1.25rem', height: 'auto' }}
        >
          Send
        </button>
      </div>
    </div>
  )
}

