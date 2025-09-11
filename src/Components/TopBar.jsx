import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNotifications } from '../Api'

export default function TopBar({ setIsAuthenticated }) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }
    if (notifOpen || profileOpen) {
      window.addEventListener('mousedown', handleClickOutside)
    }
    return () => window.removeEventListener('mousedown', handleClickOutside)
  }, [notifOpen, profileOpen])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const data = await getNotifications()
      setNotifications(data)
      setLoading(false)
    }
    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleProfileClick = () => {
    navigate('/profile')
    setProfileOpen(false)
  }

  const handleSettingsClick = () => {
    navigate('/settings')
    setProfileOpen(false)
  }

  const handleSignOutClick = () => {
    localStorage.removeItem('isAuthenticated')
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <div className="flex items-center  justify-end h-16 px-4 sm:px-6 md:px-8 bg-white border-b border-gray-200 relative">
      <div className="flex items-center space-x-3">
        <div className="relative" ref={notifRef}>
          <button
            className={`w-10 h-10 flex cursor-pointer items-center justify-center rounded-full focus:outline-none ${
              notifOpen ? 'border-2 border-sky-500' : ''
            }`}
            onClick={() => {
              setNotifOpen((prev) => !prev)
              setProfileOpen(false)
            }}
            aria-label="Toggle notifications"
          >
            <svg
              className="w-7 h-7 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 15V11a6 6 0 10-12 0v4c0 .386-.149.735-.405 1.023L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
              />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-64 sm:w-80 rounded-lg bg-white border border-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="px-6 py-3 text-gray-900 font-medium border-b border-gray-400">
                Notifications
              </div>
              {loading ? (
                <div className="flex flex-col items-center justify-center px-6 py-8 text-gray-500">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-8 text-gray-400">
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 15V11a6 6 0 10-12 0v4c0 .386-.149.735-.405 1.023L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="text-base">No notifications</span>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="px-6 py-3 border-b border-gray-200 hover:bg-gray-50"
                    >
                      <p className="text-sm text-gray-800">{n.message}</p>
                      <p className="text-xs text-gray-500">{n.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button
            className={`w-10 h-10 flex items-center justify-center cursor-pointer rounded-full bg-gray-700 text-white text-sm font-semibold focus:outline-none ${
              profileOpen ? 'border-2 border-sky-400' : ''
            }`}
            onClick={() => {
              setProfileOpen((prev) => !prev)
              setNotifOpen(false)
            }}
            aria-label="Toggle profile menu"
          >
            S
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <div className="flex flex-col py-1">
                <button
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 border-b border-gray-100 focus:outline-none"
                  onClick={handleProfileClick}
                >
                  Your Profile
                </button>
                <button
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 border-b border-gray-100 focus:outline-none"
                  onClick={handleSettingsClick}
                >
                  Settings
                </button>
                <button
                  className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200 focus:outline-none"
                  onClick={handleSignOutClick}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
