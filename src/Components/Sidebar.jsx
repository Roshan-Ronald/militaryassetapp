import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  HomeIcon,
  CubeIcon,
  ArrowRightOnRectangleIcon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  UsersIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'

const navItems = [
  { name: 'Dashboard', to: '/home', icon: HomeIcon },
  { name: 'Assets', to: '/assets', icon: CubeIcon },
  { name: 'Transfers', to: '/transfers', icon: ArrowRightOnRectangleIcon },
  { name: 'Purchases', to: '/purchases', icon: ShoppingBagIcon },
  { name: 'Assignments', to: '/assignments', icon: ClipboardDocumentListIcon },
  { name: 'Expenditures', to: '/expenditures', icon: CreditCardIcon },
  { name: 'Users', to: '/users', icon: UsersIcon },
  { name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
]

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <div className="bg-[#101726] text-white fixed inset-y-0 left-0 w-64 px-4 pt-6 flex flex-col h-screen z-40">        <div className="text-2xl font-bold">Military Asset Management</div>
        <button
          className="focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`bg-[#101726] text-white fixed inset-y-0 left-0 w-64 px-4 pt-6 transform
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out
          md:translate-x-0 md:relative md:flex md:flex-col md:h-screen md:w-64 z-40`}
      >
        <div className="text-2xl font-bold mb-8 leading-tight hidden md:block">
          Military Asset
          <br />
          Management
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ name, to, icon: Icon }) => (
            <NavLink
              to={to}
              key={name}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg font-medium hover:bg-[#222d3b] ${isActive ? 'bg-[#22324b] text-white' : 'text-gray-200'
                }`
              }
              end
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="text-gray-400 group-hover:text-white mr-3 flex-shrink-0 h-6 w-6" />
              {name}
            </NavLink>
          ))}
        </nav>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}
