// Chat page — two-panel layout: conversation list left, active chat right
// Left: list of recent conversations
// Right: active chat with profile header, messages, input bar + book session shortcut

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
  { id: 2, from: 'me', text: 'That sounds great! I\'ve been looking for someone to practise with regularly.', time: '10:05 AM' },
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
    <div className="flex h-[calc(100vh-64px)] bg-white overflow-hidden">

      {/* Left — conversation list */}
      <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex w-full md:w-80 border-r border-gray-100 flex-col flex-shrink-0`}>
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Messages</h2>
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConv(conv)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${active.id === conv.id ? 'bg-teal-50 border-r-2 border-teal-500' : ''}`}
            >
              {/* Avatar + online dot */}
              <div className="relative flex-shrink-0">
                <img src={conv.image} alt={conv.name} className="w-11 h-11 rounded-full object-cover" />
                {conv.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-900 truncate">{conv.name}</p>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{conv.time}</span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">{conv.lastMessage}</p>
              </div>

              {conv.unread > 0 && (
                <span className="w-5 h-5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">{conv.unread}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right — active chat */}
      <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-1 flex-col`}>

        {/* Chat header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileView('list')} className="md:hidden text-gray-400 hover:text-gray-700 mr-1">←</button>
            <div className="relative">
              <img src={active.image} alt={active.name} className="w-10 h-10 rounded-full object-cover" />
              {active.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-teal-500 rounded-full border-2 border-white" />}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{active.name}</p>
              <p className="text-xs text-gray-400">{active.online ? 'Online now' : 'Last seen recently'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-700 transition-colors text-lg">📞</button>
            <button className="text-gray-400 hover:text-gray-700 transition-colors text-lg">📹</button>
            <button className="bg-black text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors">
              Book Session
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              {msg.from === 'them' && (
                <img src={active.image} alt={active.name} className="w-7 h-7 rounded-full object-cover mr-2 mt-1 flex-shrink-0" />
              )}
              <div className={`max-w-sm px-4 py-2.5 rounded-2xl text-sm ${
                msg.from === 'me'
                  ? 'bg-teal-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}>
                <p>{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.from === 'me' ? 'text-teal-100' : 'text-gray-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600 transition-colors text-xl">📎</button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-full px-5 py-2.5 text-sm outline-none text-gray-700 placeholder-gray-400"
          />
          <button className="text-gray-400 hover:text-gray-600 transition-colors text-xl">🎤</button>
          <button className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${input ? 'bg-teal-500 hover:bg-teal-600' : 'bg-gray-200'}`}>
            <span className="text-white text-sm">➤</span>
          </button>
        </div>
      </div>
    </div>
  )
}
