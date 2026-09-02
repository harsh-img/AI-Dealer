import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { useApp } from '../../context/AppContext'
import ConfirmationModal from '../common/ConfirmationModal'
import NotificationModal from '../notifications/NotificationModal'
import initialNotifications from '../../data/notifications.json'
import { Search, Wallet, Bell, ChevronDown } from 'lucide-react'

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth()
  const { wallet } = useApp()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [notifications] = useState(initialNotifications || [])
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationModalOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false)
    logout()
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
            AI
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight">AI Dialer MVP</span>
        </div>
      </div>

      {/* Middle: Global Search Input */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Global Search..."
            className="w-full pl-10 pr-4 py-1.5 text-xs bg-slate-100/70 border border-slate-200 rounded-full focus:outline-none focus:border-blue-500 focus:bg-white transition text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right: Wallet Balance Badge, Notifications & Profile */}
      <div className="flex items-center gap-3">
        {/* Wallet Balance Badge */}
        <Link
          to="/wallet"
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition"
          title="Click to view Wallet & Top Up"
        >
          <Wallet className="w-3.5 h-3.5 text-blue-600" />
          <span>${wallet?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setIsNotificationModalOpen((prev) => !prev)
              setIsDropdownOpen(false)
            }}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
            )}
          </button>

          <NotificationModal
            open={isNotificationModalOpen}
            onClose={() => setIsNotificationModalOpen(false)}
            notifications={notifications}
          />
        </div>

        {/* User Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => {
              setIsDropdownOpen((prev) => !prev)
              setIsNotificationModalOpen(false)
            }}
            className="flex items-center gap-2 p-1 rounded-full text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline-block">
              {user?.name || 'User'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'User'}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email || 'user@aidialer.com'}</p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    setIsLogoutModalOpen(true)
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign Out Confirmation"
        message="Are you sure you want to log out of your AI Dialer workspace?"
        confirmText="Yes, Log Out"
        cancelText="Cancel"
        type="danger"
      />
    </header>
  )
}

export default Header
