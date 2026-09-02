import React, { useState } from 'react'

const BalanceCard = ({ balance = {} }) => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(50)

  const currentBal = balance.currentBalance ?? 125.50
  const currency = balance.currency ?? '$'
  const todayUsed = balance.todayUsage ?? 14.80
  const estMins = balance.estimatedMinutes ?? 3140

  const handleTopUpConfirm = () => {
    alert(`Top-up simulation: Added ${currency}${selectedAmount} to balance.`)
    setIsTopUpOpen(false)
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white shadow-lg shadow-indigo-950/20 flex flex-col justify-between relative overflow-hidden">
      {/* Decorative subtle background elements */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>
      <div className="absolute right-6 bottom-4 text-indigo-500/10 pointer-events-none">
        <svg className="w-36 h-36" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 18v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1h-9a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9Zm-9-2h10V8H12v8Zm4-2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/10 backdrop-blur border border-white/10 flex items-center justify-center text-indigo-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-indigo-200 tracking-wider uppercase">
              Wallet & Credits
            </span>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Auto-Reload On
          </span>
        </div>

        {/* Balance Amount */}
        <div className="mt-4">
          <p className="text-xs text-indigo-200 font-medium">Available Balance</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {currency}{currentBal.toFixed(2)}
            </span>
            <span className="text-xs text-indigo-300 font-medium">USD</span>
          </div>
        </div>

        {/* Usage & Estimation Metrics */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 backdrop-blur p-2.5 rounded-xl border border-white/10">
            <span className="text-[11px] text-indigo-200 block">Today's Usage</span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              {currency}{todayUsed.toFixed(2)}
            </span>
          </div>

          <div className="bg-white/5 backdrop-blur p-2.5 rounded-xl border border-white/10">
            <span className="text-[11px] text-indigo-200 block">Est. Calling Time</span>
            <span className="text-sm font-bold text-emerald-300 mt-0.5 block">
              ~{estMins.toLocaleString()} mins
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-5 relative z-10">
        <button
          onClick={() => setIsTopUpOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold text-xs rounded-xl shadow-md shadow-indigo-900/40 transition cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Top Up Balance</span>
        </button>
      </div>

      {/* Top Up Modal Simulator */}
      {isTopUpOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 text-slate-900">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Top Up Calling Credits</h3>
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-500">
                Select an amount to add to your AI dialer balance:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      selectedAmount === amt
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400">
                ~${(selectedAmount / (balance.ratePerMinute || 0.04)).toFixed(0)} calling minutes estimated at $0.04/min.
              </p>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => setIsTopUpOpen(false)}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUpConfirm}
                className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm shadow-indigo-600/20 transition cursor-pointer"
              >
                Confirm (+${selectedAmount})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BalanceCard
