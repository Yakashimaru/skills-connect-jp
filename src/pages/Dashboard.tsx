// Dashboard — user control center
// Toggle between Provider view and Seeker view
// Provider: sessions, earnings, bookings, verification, settings
// Seeker: sessions, saved profiles, subscription, settings

import { useState } from 'react'

const upcomingSessions = [
  { id: 1, name: 'James R.', image: 'https://randomuser.me/api/portraits/men/11.jpg', type: '1-on-1 Session', date: 'Sat 29 Mar · 10:00 AM', duration: '1 hour', price: '¥8,000', status: 'confirmed' },
  { id: 2, name: 'Sophie M.', image: 'https://randomuser.me/api/portraits/women/29.jpg', type: 'Online Call', date: 'Sun 30 Mar · 2:00 PM', duration: '1 hour', price: '¥8,000', status: 'pending' },
]

const pastBookings = [
  { id: 1, name: 'Hiroshi T.', image: 'https://randomuser.me/api/portraits/men/63.jpg', type: '1-on-1 Session', date: 'Sat 22 Mar', price: '¥8,000', rating: 5 },
  { id: 2, name: 'Emma L.', image: 'https://randomuser.me/api/portraits/women/35.jpg', type: 'Online Call', date: 'Thu 20 Mar', price: '¥8,000', rating: 4 },
  { id: 3, name: 'Kenji S.', image: 'https://randomuser.me/api/portraits/men/22.jpg', type: '1-on-1 Session', date: 'Sat 15 Mar', price: '¥8,000', rating: 5 },
]

const savedProfiles = [
  { id: 1, name: 'Kenji Mori', title: 'Golf Instructor', image: 'https://randomuser.me/api/portraits/men/32.jpg', price: '¥10,000/hr' },
  { id: 2, name: 'Rin Sato', title: 'Language Partner', image: 'https://randomuser.me/api/portraits/women/68.jpg', price: '¥5,000/hr' },
]

function ProviderDashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">

      {/* Left column */}
      <div className="col-span-2 flex flex-col gap-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total earnings', value: '¥248,000', sub: 'This month' },
            { label: 'Sessions completed', value: '31', sub: 'This month' },
            { label: 'Average rating', value: '4.9 ⭐', sub: 'All time' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-teal-500 mt-1">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Upcoming sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Upcoming sessions</h3>
          <div className="flex flex-col gap-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <img src={session.image} alt={session.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{session.name}</p>
                  <p className="text-xs text-gray-400">{session.type} · {session.date}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  session.status === 'confirmed' ? 'bg-teal-50 text-teal-600' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {session.status}
                </span>
                <span className="text-sm font-semibold text-gray-700">{session.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Past bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Past bookings</h3>
          <div className="flex flex-col gap-3">
            {pastBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <img src={booking.image} alt={booking.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                  <p className="text-xs text-gray-400">{booking.type} · {booking.date}</p>
                </div>
                <span className="text-xs text-yellow-500">{'⭐'.repeat(booking.rating)}</span>
                <span className="text-sm font-semibold text-gray-700">{booking.price}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6">

        {/* Profile summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="profile" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-teal-100" />
          <p className="font-semibold text-gray-900">Yuki Tanaka</p>
          <p className="text-xs text-gray-400 mb-3">Life Coach & English Tutor</p>
          <span className="bg-teal-50 text-teal-600 text-xs font-medium px-3 py-1 rounded-full">✔ Verified</span>
          <button className="w-full mt-4 text-sm border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Edit profile
          </button>
        </div>

        {/* Verification status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Verification</h3>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Email', done: true },
              { label: 'Phone number', done: true },
              { label: 'ID verification', done: true },
              { label: 'Background check', done: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className={`text-xs font-medium ${item.done ? 'text-teal-500' : 'text-gray-300'}`}>
                  {item.done ? '✔ Done' : '○ Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Subscription</h3>
          <p className="text-xs text-gray-400 mb-3">Current plan</p>
          <div className="bg-teal-500 rounded-xl p-4 text-white text-center">
            <p className="font-bold text-lg">Premium</p>
            <p className="text-teal-100 text-xs mt-0.5">¥10,000 / month</p>
          </div>
          <button className="w-full mt-3 text-sm border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Manage plan
          </button>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Settings</h3>
          <div className="flex flex-col gap-2">
            {['Notifications', 'Privacy', 'Payment methods', 'Help & support', 'Log out'].map((item) => (
              <button key={item} className={`text-left text-sm py-1.5 transition-colors ${item === 'Log out' ? 'text-red-400 hover:text-red-600' : 'text-gray-600 hover:text-gray-900'}`}>
                {item} →
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function SeekerDashboard() {
  return (
    <div className="grid grid-cols-3 gap-6">

      {/* Left column */}
      <div className="col-span-2 flex flex-col gap-6">

        {/* Upcoming sessions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Upcoming sessions</h3>
          <div className="flex flex-col gap-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <img src={session.image} alt={session.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{session.name}</p>
                  <p className="text-xs text-gray-400">{session.type} · {session.date}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  session.status === 'confirmed' ? 'bg-teal-50 text-teal-600' : 'bg-yellow-50 text-yellow-600'
                }`}>
                  {session.status}
                </span>
                <span className="text-sm font-semibold text-gray-700">{session.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Past bookings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Past bookings</h3>
          <div className="flex flex-col gap-3">
            {pastBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <img src={booking.image} alt={booking.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{booking.name}</p>
                  <p className="text-xs text-gray-400">{booking.type} · {booking.date}</p>
                </div>
                <span className="text-xs text-yellow-500">{'⭐'.repeat(booking.rating)}</span>
                <span className="text-sm font-semibold text-gray-700">{booking.price}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Saved profiles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4">Saved profiles</h3>
          <div className="flex flex-col gap-3">
            {savedProfiles.map((profile) => (
              <div key={profile.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                <img src={profile.image} alt={profile.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                  <p className="text-xs text-gray-400">{profile.title}</p>
                </div>
                <span className="text-xs text-teal-500 font-medium">{profile.price}</span>
                <button className="text-xs bg-black text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">Book</button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right column */}
      <div className="flex flex-col gap-6">

        {/* Profile summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <img src="https://randomuser.me/api/portraits/men/11.jpg" alt="profile" className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-teal-100" />
          <p className="font-semibold text-gray-900">James R.</p>
          <p className="text-xs text-gray-400 mb-3">Seeker · Tokyo</p>
          <button className="w-full text-sm border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Edit profile
          </button>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-1">Subscription</h3>
          <p className="text-xs text-gray-400 mb-3">Current plan</p>
          <div className="bg-gray-900 rounded-xl p-4 text-white text-center">
            <p className="font-bold text-lg">Elite</p>
            <p className="text-gray-400 text-xs mt-0.5">¥50,000 / month</p>
          </div>
          <button className="w-full mt-3 text-sm border border-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Manage plan
          </button>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Settings</h3>
          <div className="flex flex-col gap-2">
            {['Notifications', 'Privacy', 'Payment methods', 'Help & support', 'Log out'].map((item) => (
              <button key={item} className={`text-left text-sm py-1.5 transition-colors ${item === 'Log out' ? 'text-red-400 hover:text-red-600' : 'text-gray-600 hover:text-gray-900'}`}>
                {item} →
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default function Dashboard() {
  const [view, setView] = useState<'provider' | 'seeker'>('provider')

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header + toggle */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, Yuki</p>
          </div>
          <div className="flex items-center bg-white border border-gray-200 p-1 rounded-full shadow-sm">
            <button
              onClick={() => setView('provider')}
              className={`text-sm px-5 py-2 rounded-full transition-colors font-medium ${view === 'provider' ? 'bg-teal-500 text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Provider
            </button>
            <button
              onClick={() => setView('seeker')}
              className={`text-sm px-5 py-2 rounded-full transition-colors font-medium ${view === 'seeker' ? 'bg-teal-500 text-white' : 'text-gray-400 hover:text-gray-700'}`}
            >
              Seeker
            </button>
          </div>
        </div>

        {view === 'provider' ? <ProviderDashboard /> : <SeekerDashboard />}
      </div>
    </div>
  )
}
