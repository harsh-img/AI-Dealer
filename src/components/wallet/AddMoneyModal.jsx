import React, { useState } from 'react'

const PRESET_AMOUNTS = [500, 1000, 2000, 5000]

const AddMoneyModal = ({ open, onClose, onAddSuccess }) => {
  const [selectedAmount, setSelectedAmount] = useState(1000)
  const [customAmount, setCustomAmount] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [addedAmount, setAddedAmount] = useState(0)

  if (!open) return null

  const handleSelectPreset = (amt) => {
    setSelectedAmount(amt)
    setCustomAmount('')
  }

  const handleCustomChange = (e) => {
    const val = e.target.value
    setCustomAmount(val)
    if (val) {
      setSelectedAmount(Number(val) || 0)
    } else {
      setSelectedAmount(0)
    }
  }

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!effectiveAmount || effectiveAmount < 100) return

    setAddedAmount(effectiveAmount)
    setIsSuccess(true)

    // Notify parent component to update local balance
    if (onAddSuccess) {
      onAddSuccess(effectiveAmount)
    }
  }

  const handleClose = () => {
    setIsSuccess(false)
    setSelectedAmount(1000)
    setCustomAmount('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {!isSuccess ? (
          <div>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add Money to Wallet</h3>
                  <p className="text-xs text-slate-500">Recharge balance for AI voice dialing minutes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-5">
              {/* Preset Amounts Grid */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Select Recharge Amount
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_AMOUNTS.map((amt) => {
                    const isSelected = !customAmount && selectedAmount === amt
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleSelectPreset(amt)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-600/20'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Custom Amount Input */}
              <div>
                <label htmlFor="customAmount" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Or Enter Custom Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    id="customAmount"
                    type="number"
                    min="100"
                    max="100000"
                    placeholder="e.g. 3500"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white"
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  Minimum recharge amount is ₹100.
                </p>
              </div>

              {/* Calling minutes calculation preview */}
              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100/80 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Estimated Voice Minutes:</span>
                <span className="font-bold text-indigo-700">
                  ~{Math.round((effectiveAmount || 0) / 1.5).toLocaleString()} mins (@ ₹1.5/min)
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-xl hover:bg-slate-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!effectiveAmount || effectiveAmount < 100}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
                >
                  Continue to Add ₹{effectiveAmount > 0 ? effectiveAmount.toLocaleString() : '0'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Frontend Success View */
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Recharge Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">
                <span className="font-bold text-emerald-700">₹{addedAmount.toLocaleString()}</span> has been added to your wallet balance.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
              Transaction ID: <span className="font-mono font-semibold text-slate-700">TXN-{String(Date.now()).slice(-5)}</span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition cursor-pointer"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AddMoneyModal
