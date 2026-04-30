import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { getConversations, getMessages, sendMessage, subscribeToMessages } from '../lib/messages'

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

function Avatar({ profile, size = 'w-10 h-10', textSize = 'text-sm' }: { profile: any; size?: string; textSize?: string }) {
  return (
    <div className={`${size} rounded-full overflow-hidden flex items-center justify-center font-bold flex-shrink-0 ${textSize}`}
      style={{ backgroundColor: '#FDF0E0', color: '#B8860B' }}>
      {profile?.avatar_url
        ? <img src={profile.avatar_url} alt={profile?.name ?? ''} className="w-full h-full object-cover" />
        : profile?.name?.[0]?.toUpperCase() ?? '?'
      }
    </div>
  )
}

export default function Chat() {
  const { t } = useTranslation()
  const { user } = useAuth()

  const [convList, setConvList] = useState<any[]>([])
  const [activeConv, setActiveConv] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const bottomRef = useRef<HTMLDivElement>(null)

  // Fetch conversations on mount
  useEffect(() => {
    if (!user) return
    getConversations(user.id).then(({ data }) => {
      setConvList(data ?? [])
      setLoading(false)
    })
  }, [user])

  // Fetch messages + subscribe when active conversation changes
  useEffect(() => {
    if (!activeConv) return
    setMessages([])

    getMessages(activeConv.id).then(({ data }) => setMessages(data ?? []))

    const channel = subscribeToMessages(activeConv.id, (newMsg) => {
      setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg])
    })

    return () => { channel.unsubscribe() }
  }, [activeConv?.id])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getOther = useCallback((conv: any) =>
    conv.participant1_id === user?.id ? conv.participant2 : conv.participant1
  , [user?.id])

  const handleSelectConv = (conv: any) => {
    setActiveConv(conv)
    setMobileView('chat')
  }

  const handleSend = async () => {
    if (!input.trim() || !activeConv || !user || sending) return
    const text = input.trim()
    setInput('')
    setSending(true)

    // Optimistic update
    setMessages(prev => [...prev, {
      id: `temp-${Date.now()}`,
      conversation_id: activeConv.id,
      sender_id: user.id,
      text,
      attachment_url: null,
      created_at: new Date().toISOString(),
    }])

    await sendMessage({ conversation_id: activeConv.id, sender_id: user.id, text, attachment_url: null })
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center" style={{ backgroundColor: '#FDF8F2' }}>
        <p className="text-sm" style={{ color: '#aaa' }}>Loading...</p>
      </div>
    )
  }

  const other = activeConv ? getOther(activeConv) : null

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden" style={{ backgroundColor: '#FDF8F2' }}>

      {/* Left — conversation list */}
      <div
        className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-80 flex-col flex-shrink-0`}
        style={{ backgroundColor: '#fff', borderRight: '0.5px solid #E8DDD5' }}
      >
        <div className="p-4" style={{ borderBottom: '0.5px solid #E8DDD5' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>{t('chat.title')}</h2>
          <input type="text" placeholder={t('chat.search_placeholder')}
            className="w-full rounded-full px-4 py-2 text-sm outline-none"
            style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8DDD5', color: '#1A0208' }} />
        </div>

        <div className="overflow-y-auto flex-1">
          {convList.length === 0 ? (
            <p className="text-sm text-center py-10" style={{ color: '#aaa' }}>No conversations yet</p>
          ) : convList.map((conv) => {
            const person = getOther(conv)
            const isActive = activeConv?.id === conv.id
            return (
              <div key={conv.id} onClick={() => handleSelectConv(conv)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                style={{
                  backgroundColor: isActive ? '#FDF0E0' : 'transparent',
                  borderRight: isActive ? '2px solid #B8860B' : '2px solid transparent',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#FDF8F2' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}>
                <Avatar profile={person} size="w-11 h-11" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate" style={{ color: '#1A0208' }}>{person?.name ?? '—'}</p>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: '#aaa' }}>{relativeTime(conv.last_message_at)}</span>
                  </div>
                  <p className="text-xs truncate mt-0.5" style={{ color: '#7A6060' }}>
                    {person?.provider_profile?.title ?? person?.location ?? ''}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right — active chat */}
      <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-1 flex-col`} style={{ backgroundColor: '#fff' }}>
        {!activeConv ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: '#aaa' }}>Select a conversation</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 md:px-6 py-4" style={{ borderBottom: '0.5px solid #E8DDD5' }}>
              <div className="flex items-center gap-3">
                <button onClick={() => setMobileView('list')} className="md:hidden mr-1" style={{ color: '#5C0A1E' }}>←</button>
                <Avatar profile={other} />
                <div>
                  <p className="font-semibold text-sm" style={{ color: '#1A0208' }}>{other?.name ?? '—'}</p>
                  <p className="text-xs" style={{ color: '#aaa' }}>
                    {other?.provider_profile?.title ?? other?.location ?? ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-lg" style={{ color: '#5C0A1E' }}>📞</button>
                <button className="text-lg" style={{ color: '#5C0A1E' }}>📹</button>
                <button className="text-xs font-medium px-4 py-2 rounded-full transition-colors"
                  style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3A0612')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5C0A1E')}>
                  {t('chat.book_session')}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3" style={{ backgroundColor: '#FDF8F2' }}>
              {messages.length === 0 && (
                <p className="text-sm text-center py-10" style={{ color: '#aaa' }}>No messages yet. Say hello!</p>
              )}
              {messages.map((msg) => {
                const isMe = msg.sender_id === user?.id
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && <Avatar profile={other} size="w-7 h-7" textSize="text-xs" />}
                    <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${!isMe ? 'ml-2' : ''}`}
                      style={isMe
                        ? { backgroundColor: '#5C0A1E', color: '#fff', borderBottomRightRadius: '4px' }
                        : { backgroundColor: '#fff', color: '#1A0208', borderBottomLeftRadius: '4px', border: '0.5px solid #E8DDD5' }}>
                      <p>{msg.text}</p>
                      <p className="text-xs mt-1" style={{ color: isMe ? 'rgba(255,255,255,0.55)' : '#aaa' }}>
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-6 py-4 flex items-center gap-3" style={{ borderTop: '0.5px solid #E8DDD5', backgroundColor: '#fff' }}>
              <button className="text-xl" style={{ color: '#B8860B' }}>📎</button>
              <input type="text" value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.input_placeholder')}
                className="flex-1 rounded-full px-5 py-2.5 text-sm outline-none"
                style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8DDD5', color: '#1A0208' }} />
              <button className="text-xl" style={{ color: '#B8860B' }}>🎤</button>
              <button onClick={handleSend} disabled={!input.trim() || sending}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                style={{ backgroundColor: input.trim() ? '#B8860B' : '#E8DDD5' }}>
                <span style={{ color: input.trim() ? '#3A2400' : '#aaa', fontSize: '14px' }}>➤</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
