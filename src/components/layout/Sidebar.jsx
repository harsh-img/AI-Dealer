import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Megaphone, Users, PhoneCall, Wallet, Settings, Radio, BarChart3, Bot } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()

  const mainNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Agents', path: '/agents', icon: Bot },
    { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
    { name: 'Live Agents', path: '/live-agents', icon: Users },
    { name: 'Call History', path: '/call-history', icon: PhoneCall },
    { name: 'Wallet & Billing', path: '/wallet', icon: Wallet },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  const handleLinkClick = () => {
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-40 md:z-30 w-60 h-screen shrink-0 bg-white border-r border-slate-200/80 flex flex-col justify-between select-none transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                AI
              </div>
              <span className="font-bold tracking-tight text-slate-800 text-base">AI Dialer MVP</span>
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 py-4 space-y-1 overflow-y-auto">
            {mainNavItems.map((item) => {
              const Icon = item.icon
              const isActive =
                (item.path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) ||
                (item.path !== '/' && item.path !== '/dashboard' && location.pathname.startsWith(item.path))

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100/80 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar