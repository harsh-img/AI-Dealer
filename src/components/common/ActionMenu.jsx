import React, { useState, useRef, useEffect } from 'react'

const ActionMenu = ({ items = [] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!items || items.length === 0) return null

  return (
    <div
      className="relative inline-block text-left"
      ref={menuRef}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 3-dots Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition flex items-center justify-center cursor-pointer shadow-2xs"
        aria-label="Actions menu"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 min-w-[150px] rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-30 animate-in fade-in zoom-in-95 duration-100">
          {items.map((item, idx) => {
            if (!item) return null
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpen(false)
                  item.onClick?.()
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition text-left cursor-pointer ${
                  item.danger
                    ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold'
                    : item.success
                    ? 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ActionMenu
