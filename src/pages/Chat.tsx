// Chat — maroon #5C0A1E, antique gold #B8860B, white surfaces

import { useState } from 'react'

const conversations = [
  { id: 1, name: 'Yuki Tanaka', title: 'Life Coach & English Tutor', image: 'https://randomuser.me/api/portraits/women/44.jpg', lastMessage: 'Looking forward to our session!', time: '2m ago', unread: 2, online: true },
  { id: 2, name: 'Kenji Mori', title: 'Golf Instructor', image: 'https://randomuser.me/api/portraits/men/32.jpg', lastMessage: 'Sure, Saturday works for me.', time: '1h ago', unread: 0, online: false },
  { id: 3, name: 'Rin Sato', title: 'Language Partner', image: 'https://randomuser.me/api/portraits/women/68.jpg', lastMessage: 'どうぞよろしく！', time: '3h ago', unread: 0, online: true },
  { id: 4, name: 'Aoi Nakamura', title: 'Piano Teacher', image: 'https://randomuser.me/api/portraits/women/26.jpg', lastMessage: 'I sent you the lesson plan.', time: 'Yesterday', unread: 0, online: false },
  { id: 5, name: 'Ryu Hashimoto', title: 'Startup Mentor', image: 'https://randomuser.me/api/portraits/men/41.jpg', lastMessage: 'Great progress this week!', time: 'Yesterday', unread: 0, online: false },
]

const messages = [
  { id: 1, from: 'them', text: 'Hi! I saw your profile and I think I can really help with your English confidence.', time: '10:02 AM' },
  { id: 2, from: 'me', text: "That sounds great! I've been looking for someone to practise with regularly.", time: '10:05 AM' },
  { id: 3, from: 'them', text: 'Perfect. I usually do 1-hour sessions, either online or in person around Shibuya. What works best for you?', time: '10:06 AM' },
  { id: 4, from: 'me', text: 'Online would be easier for now. Are you available on weekends?', time: '10:09 AM' },
  { id: 5, from: 'them', text: 'Yes! Saturday mornings are usually free. Shall we book a trial session first?', time: '10:10 AM' },
  { id: 6, from: 'me', text: 'That works perfectly for me.', time: '10:12 AM' },
  { id: 7, from: 'them', text: 'Looking forward to our session!', time: '10:13 AM' },
]

export default function Chat() {
  const [active, setActive] = useState(conversations[0])
  const [input, setInput] = useState('')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')

  const handleSelectConv = (conv: typeof conversations[0]) => {
    setActive(conv)
    setMobileView('chat')
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden" style={{ backgroundColor: '#FDF8F2' }}>

      {/* Left — conversation list */}
      <div
        className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-80 flex-col flex-shrink-0`}
        style={{ backgroundColor: '#fff', borderRight: '0.5px solid #E8DDD5' }}
      >
        <div className="p-4" style={{ borderBottom: '0.5px solid #E8DDD5' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: '#1A0208' }}>Messages</h2>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full rounded-full px-4 py-2 text-sm outline-none"
            style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8DDD5', color: '#1A0208' }}
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConv(conv)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
              style={{
                backgroundColor: active.id === conv.id ? '#FDF0E0' : 'transparent',
                borderRight: active.id === conv.id ? '2px solid #B8860B' : '2px solid transparent',
              }}
              onMouseEnter={e => { if (active.id !== conv.id) e.currentTarget.style.backgroundColor = '#FDF8F2' }}
              onMouseLeave={e => { if (active.id !== conv.id) e.currentTarget.style.backgroundColor = 'transparent' }}
            >
              <div className="relative flex-shrink-0">
                <img src={conv.image} alt={conv.name} className="w-11 h-11 rounded-full object-cover" />
                {conv.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: '#B8860B' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate" style={{ color: '#1A0208' }}>{conv.name}</p>
                  <span className="text-xs flex-shrink-0 ml-2" style={{ color: '#aaa' }}>{conv.time}</span>
                </div>
                <p className="text-xs truncate mt-0.5" style={{ color: '#7A6060' }}>{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="w-5 h-5 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#B8860B', color: '#3A2400' }}>{conv.unread}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right — active chat */}
      <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-1 flex-col`} style={{ backgroundColor: '#fff' }}>

        {/* Chat header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4" style={{ borderBottom: '0.5px solid #E8DDD5' }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileView('list')} className="md:hidden mr-1" style={{ color: '#5C0A1E' }}>←</button>
            <div className="relative">
              <img src={active.image} alt={active.name} className="w-10 h-10 rounded-full object-cover" />
              {active.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ backgroundColor: '#B8860B' }} />
              )}
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: '#1A0208' }}>{active.name}</p>
              <p className="text-xs" style={{ color: active.online ? '#B8860B' : '#aaa' }}>{active.online ? 'Online now' : 'Last seen recently'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-lg transition-colors" style={{ color: '#5C0A1E' }}>📞</button>
            <button className="text-lg transition-colors" style={{ color: '#5C0A1E' }}>📹</button>
            <button
              className="text-xs font-medium px-4 py-2 rounded-full transition-colors"
              style={{ backgroundColor: '#5C0A1E', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#3A0612')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#5C0A1E')}
            >
              Book Session
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3" style={{ backgroundColor: '#FDF8F2' }}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              {msg.from === 'them' && (
                <img src={active.image} alt={active.name} className="w-7 h-7 rounded-full object-cover mr-2 mt-1 flex-shrink-0" />
              )}
              <div
                className="max-w-sm px-4 py-2.5 rounded-2xl text-sm"
                style={
                  msg.from === 'me'
                    ? { backgroundColor: '#5C0A1E', color: '#fff', borderBottomRightRadius: '4px' }
                    : { backgroundColor: '#fff', color: '#1A0208', borderBottomLeftRadius: '4px', border: '0.5px solid #E8DDD5' }
                }
              >
                <p>{msg.text}</p>
                <p className="text-xs mt-1" style={{ color: msg.from === 'me' ? 'rgba(255,255,255,0.55)' : '#aaa' }}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="px-6 py-4 flex items-center gap-3" style={{ borderTop: '0.5px solid #E8DDD5', backgroundColor: '#fff' }}>
          <button className="text-xl" style={{ color: '#B8860B' }}>📎</button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full px-5 py-2.5 text-sm outline-none"
            style={{ backgroundColor: '#FDF8F2', border: '0.5px solid #E8DDD5', color: '#1A0208' }}
          />
          <button className="text-xl" style={{ color: '#B8860B' }}>🎤</button>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: input ? '#B8860B' : '#E8DDD5' }}
          >
            <span style={{ color: input ? '#3A2400' : '#aaa', fontSize: '14px' }}>➤</span>
          </button>
        </div>
      </div>
    </div>
  )
}
