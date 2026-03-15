// DiscoverFilters — single clean filter bar: search + dropdowns
import { useState } from 'react'

export default function DiscoverFilters() {
  const [search, setSearch] = useState('')

  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-10">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-3">

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search skills or people..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-full outline-none text-gray-700 placeholder-gray-400 focus:bg-gray-200 transition-colors"
          />
        </div>

        <div className="h-5 w-px bg-gray-200" />

        {/* Dropdowns */}
        <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
          <option>Category</option>
          <option>Skills</option>
          <option>Social</option>
          <option>Meetups</option>
          <option>Online</option>
        </select>

        <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
          <option>Location</option>
          <option>Tokyo</option>
          <option>Osaka</option>
          <option>Kyoto</option>
          <option>Online</option>
        </select>

        <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
          <option>Price</option>
          <option>Under ¥5,000/hr</option>
          <option>¥5,000 – ¥10,000/hr</option>
          <option>Over ¥10,000/hr</option>
        </select>

        <select className="text-sm text-gray-500 border border-gray-200 rounded-full px-4 py-2 outline-none bg-white hover:border-gray-400 transition-colors cursor-pointer">
          <option>Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Any</option>
        </select>

        {/* Verified toggle */}
        <label className="flex items-center gap-2 cursor-pointer ml-1">
          <input type="checkbox" className="accent-teal-500 w-4 h-4" />
          <span className="text-sm text-gray-500 whitespace-nowrap">Verified only</span>
        </label>

      </div>
    </div>
  )
}
