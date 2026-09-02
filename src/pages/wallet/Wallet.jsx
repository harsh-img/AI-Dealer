import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Wallet as WalletIcon, Plus, ArrowUpRight, Calculator, Check, PhoneCall, ShieldCheck, DollarSign } from 'lucide-react'

const Wallet = () => {
  const { wallet, topUpWallet, transferToVoip } = useApp()
  const [topUpAmount, setTopUpAmount] = useState('500')
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [voipTransferAmount, setVoipTransferAmount] = useState('200')
  const [transferSuccess, setTransferSuccess] = useState(false)

  // VOIP Calculation State (Matches input_file_3.png requirement)
  const [calcCalls, setCalcCalls] = useState(5000)
  const [calcAvgMins, setCalcAvgMins] = useState(1.5)
  const [calcRatePerMin, setCalcRatePerMin] = useState(0.015)
  const [calcConcurrency, setCalcConcurrency] = useState(20)

  // Calculations
  const estimatedTotalMins = Math.round(calcCalls * calcAvgMins)
  const calculatedVoipNeed = (estimatedTotalMins * calcRatePerMin).toFixed(2)

  const handleTopUpSubmit = (e) => {
    e.preventDefault()
    if (!topUpAmount || Number(topUpAmount) <= 0) return
    topUpWallet(Number(topUpAmount))
    setShowTopUpModal(false)
  }

  const handleAllocateToVoip = () => {
    const success = transferToVoip(Number(calculatedVoipNeed))
    if (success) {
      setTransferSuccess(true)
      setTimeout(() => setTransferSuccess(false), 2000)
    } else {
      alert('Insufficient wallet balance. Please top up your wallet first!')
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Client Wallet & VOIP Balance</h1>
          <p className="text-sm text-slate-500 mt-1">
            Self-service top-up wallet and VOIP carrier balance calculator.
          </p>
        </div>
        <button
          onClick={() => setShowTopUpModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Top Up Wallet Balance</span>
        </button>
      </div>

      {/* 1. WALLET SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Primary Wallet Balance */}
        <div className="dashboard-card p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-blue-100">
              <span className="text-xs font-semibold uppercase tracking-wider">Primary Client Wallet</span>
              <WalletIcon className="w-5 h-5 text-blue-200" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold tracking-tight">
                ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-blue-500/50 flex items-center justify-between text-xs text-blue-100">
            <span>Unified Balance</span>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 font-bold transition text-[11px]"
            >
              + Instant Add
            </button>
          </div>
        </div>

        {/* Card 2: VOIP Carrier Account Balance */}
        <div className="dashboard-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">VOIP Account Trunk Balance</span>
              <PhoneCall className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                ${wallet.voipBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Allocated for active call minutes & SIP trunks.
          </p>
        </div>

        {/* Card 3: Standard VOIP Tariff */}
        <div className="dashboard-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">VOIP Call Rate</span>
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div className="mt-3">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                ${wallet.ratePerMin}
                <span className="text-xs font-normal text-slate-500"> / min</span>
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Standard outbound trunk rate per answered call minute.
          </p>
        </div>

      </div>

      {/* 2. VOIP BALANCE CALCULATOR (Matches input_file_3.png requirement) */}
      <div className="dashboard-card p-6 space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              VOIP Account Balance Calculator
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Calculate exact VOIP account balance needed for upcoming campaign volumes.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-bold">
            Auto Calculation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Inputs (Col 7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Estimated Total Calls</label>
                <input
                  type="number"
                  value={calcCalls}
                  onChange={(e) => setCalcCalls(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Avg. Call Duration (minutes)</label>
                <input
                  type="number"
                  step="0.1"
                  value={calcAvgMins}
                  onChange={(e) => setCalcAvgMins(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Rate per Minute ($)</label>
                <input
                  type="number"
                  step="0.001"
                  value={calcRatePerMin}
                  onChange={(e) => setCalcRatePerMin(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Concurrent Lines Needed</label>
                <input
                  type="number"
                  value={calcConcurrency}
                  onChange={(e) => setCalcConcurrency(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Right Summary & Action (Col 5) */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Calculation Output</h3>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Total Minutes:</span>
                  <span className="font-bold text-slate-800 font-mono">{estimatedTotalMins.toLocaleString()} mins</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Target Concurrency:</span>
                  <span className="font-bold text-slate-800 font-mono">{calcConcurrency} lines</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Required VOIP Balance:</span>
                  <span className="text-2xl font-extrabold text-blue-600 font-mono">${calculatedVoipNeed}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAllocateToVoip}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {transferSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Funds Allocated to VOIP!</span>
                </>
              ) : (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Allocate ${calculatedVoipNeed} to VOIP Account</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 3. TRANSACTIONS LOG TABLE */}
      <div className="dashboard-card p-6">
        <h2 className="text-base font-bold text-slate-800 mb-4">Wallet Transactions History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="p-3">Date</th>
                <th className="p-3">Type</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {wallet.transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition">
                  <td className="p-3 text-slate-500 font-mono">{tx.date}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      tx.type === 'Credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-800 font-medium">{tx.description}</td>
                  <td className="p-3 text-right font-bold font-mono text-slate-900">
                    ${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Self Top-Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Top Up Wallet Balance</h3>
            <form onSubmit={handleTopUpSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Amount ($)</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['100', '500', '1000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-2 rounded-lg text-xs font-bold border transition ${
                        topUpAmount === amt ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs"
                >
                  Confirm Instant Top-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Wallet
