import React from 'react'

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'successful':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Successful
        </span>
      )
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Pending
        </span>
      )
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          Failed
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {status}
        </span>
      )
  }
}

const TransactionDetailsModal = ({ transaction, open, onClose }) => {
  if (!open || !transaction) return null

  const isCredit = transaction.type?.toLowerCase() === 'credit'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-100 transform transition-all space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isCredit
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {isCredit ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Transaction Details</h3>
              <p className="text-xs text-slate-500 font-mono">{transaction.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Amount Display */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
          <span className="text-xs font-semibold text-slate-500 block uppercase tracking-wider">
            Transaction Amount
          </span>
          <span
            className={`text-3xl font-extrabold mt-1 block ${
              isCredit ? 'text-emerald-600' : 'text-slate-900'
            }`}
          >
            {isCredit ? '+' : '-'}₹{Number(transaction.amount || 0).toLocaleString()}
          </span>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold ${
                isCredit
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-800'
              }`}
            >
              {transaction.type}
            </span>
            {getStatusBadge(transaction.status)}
          </div>
        </div>

        {/* Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium block">Date & Time</span>
            <span className="font-semibold text-slate-800 block">{transaction.date}</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1">
            <span className="text-slate-400 font-medium block">Payment Method</span>
            <span className="font-semibold text-slate-800 block">
              {transaction.method || (isCredit ? 'Online Recharge' : 'Usage Deduction')}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-1 sm:col-span-2">
            <span className="text-slate-400 font-medium block">Description / Reference</span>
            <span className="font-medium text-slate-800 block leading-relaxed">
              {transaction.description}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetailsModal
