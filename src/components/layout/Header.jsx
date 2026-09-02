import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import ConfirmationModal from '../common/ConfirmationModal'
import NotificationModal from '../notifications/NotificationModal'
import initialNotifications from '../../data/notifications.json'

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [notifications] = useState(initialNotifications || [])
  const dropdownRef = useRef(null)
  const notificationRef = useRef(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Compute current page title
  const getPageTitle = () => {
    if (location.pathname.startsWith('/agents/create')) return 'AI Agents / Create'
    if (location.pathname.includes('/edit')) return 'Edit'
    if (location.pathname.startsWith('/agents/')) return 'AI Agents / Details'
    if (location.pathname.startsWith('/agents')) return 'AI Agents'
    if (location.pathname.startsWith('/campaigns')) return 'Campaigns'
    if (location.pathname.startsWith('/live-agents')) return 'Live Agents'
    if (location.pathname.startsWith('/call-history')) return 'Call History'
    if (location.pathname.startsWith('/wallet')) return 'Wallet & Billing'
    if (location.pathname.startsWith('/settings')) return 'Settings'
    if (location.pathname.startsWith('/profile')) return 'User Profile'
    return 'Dashboard'
  }

  // Close dropdowns on outside click
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
    <header className="h-16 bg-white/90 backdrop-blur border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Brand / Breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Brand on Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-wide">AI DIALER</span>
        </div>

        {/* Desktop Welcome or Page indicator */}
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
          <span className="font-medium text-slate-700">AI Dialer Portal</span>
          <span>/</span>
          <span className="text-indigo-600 font-semibold">{getPageTitle()}</span>
        </div>
      </div>

      {/* Right: Notifications & Profile Dropdown */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Notification Button & Anchored Dropdown */}
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Notification Ping Badge */}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
            )}
          </button>

          {/* Anchored Notification Popover */}
          <NotificationModal
            open={isNotificationModalOpen}
            onClose={() => setIsNotificationModalOpen(false)}
            notifications={notifications}
          />
        </div>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          {/* Profile Trigger Button */}
          <button
            onClick={() => {
              setIsDropdownOpen((prev) => !prev)
              setIsNotificationModalOpen(false)
            }}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
            aria-expanded={isDropdownOpen}
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm shadow-indigo-600/30">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-none text-slate-800">
                {user?.name || user?.email?.split('@')[0] || 'User'}
              </p>
            </div>
            <svg
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu Modal / Popover */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* User Info Header */}
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {user?.name || 'User Profile'}
                </p>
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {user?.email || 'user@aidialer.com'}
                </p>
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  MVP Plan Active
                </div>
              </div>

              {/* Menu Actions */}
              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition"
                >
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>View Profile</span>
                </Link>
              </div>

              {/* Logout Action */}
              <div className="pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false)
                    setIsLogoutModalOpen(true)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        open={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        title="Sign Out Confirmation"
        message="Are you sure you want to log out of your AI Dialer workspace? You will need your login credentials to sign back in."
        confirmText="Yes, Log Out"
        cancelText="Cancel"
        type="danger"
      />
    </header>
  )
}

export default Header
