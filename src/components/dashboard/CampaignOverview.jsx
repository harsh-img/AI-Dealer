import React from 'react'

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'running':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Running
        </span>
      )
    case 'paused':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Paused
        </span>
      )
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Completed
        </span>
      )
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Scheduled
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

const CampaignOverview = ({ campaigns = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Campaign Overview
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
              {campaigns.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time campaign execution, dialing performance, and lead outcomes
          </p>
        </div>
      </div>

      {/* Mobile Card List (Visible on Small Screens < md) */}
      <div className="block md:hidden divide-y divide-slate-100">
        {campaigns.map((camp) => (
          <div key={camp.id} className="p-4 space-y-3">
            {/* Top Row: Name & Status */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{camp.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Started {camp.startedAt}</p>
              </div>
              <div className="shrink-0">{getStatusBadge(camp.status)}</div>
            </div>

            {/* Agent Info (Clean without AI badge) */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
              <span className="font-semibold text-slate-800 block truncate">{camp.agentName}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">{camp.agentType}</span>
            </div>

            {/* Metrics 4-grid */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Leads</span>
                <span className="font-bold text-slate-800">{camp.leads}</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Calls</span>
                <span className="font-bold text-slate-800">{camp.calls}</span>
              </div>
              <div className="bg-emerald-50 p-1.5 rounded-lg border border-emerald-100">
                <span className="text-[10px] text-emerald-600 block">Answered</span>
                <span className="font-bold text-emerald-700">{camp.answered}</span>
              </div>
              <div className="bg-amber-50 p-1.5 rounded-lg border border-amber-100">
                <span className="text-[10px] text-amber-600 block">Transfer</span>
                <span className="font-bold text-amber-700">{camp.transferred}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Table (Hidden on Mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">Campaign Name</th>
              <th className="py-3.5 px-4">AI Agent</th>
              <th className="py-3.5 px-4 text-right">Leads</th>
              <th className="py-3.5 px-4 text-right">Calls</th>
              <th className="py-3.5 px-4 text-right">Answered</th>
              <th className="py-3.5 px-4 text-right">Transferred</th>
              <th className="py-3.5 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {campaigns.map((camp) => (
              <tr
                key={camp.id}
                className="hover:bg-slate-50/80 transition-colors group"
              >
                {/* Campaign Name */}
                <td className="py-4 px-4 sm:px-6">
                  <div>
                    <span className="font-semibold text-slate-900 group-hover:text-indigo-600 transition">
                      {camp.name}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5">
                      Started {camp.startedAt}
                    </span>
                  </div>
                </td>

                {/* AI Agent (Clean, without AI box badge) */}
                <td className="py-4 px-4">
                  <div>
                    <p className="font-medium text-slate-800">{camp.agentName}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{camp.agentType}</p>
                  </div>
                </td>

                {/* Leads */}
                <td className="py-4 px-4 text-right font-semibold text-slate-700">
                  {camp.leads.toLocaleString()}
                </td>

                {/* Calls */}
                <td className="py-4 px-4 text-right font-semibold text-slate-700">
                  {camp.calls.toLocaleString()}
                </td>

                {/* Answered */}
                <td className="py-4 px-4 text-right">
                  <span className="font-semibold text-emerald-600">
                    {camp.answered.toLocaleString()}
                  </span>
                  {camp.calls > 0 && (
                    <span className="block text-[10px] text-slate-400">
                      {((camp.answered / camp.calls) * 100).toFixed(0)}% rate
                    </span>
                  )}
                </td>

                {/* Transferred */}
                <td className="py-4 px-4 text-right font-semibold text-amber-600">
                  {camp.transferred.toLocaleString()}
                </td>

                {/* Status */}
                <td className="py-4 px-6 text-center">
                  {getStatusBadge(camp.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CampaignOverview
