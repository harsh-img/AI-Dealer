import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Plus, Send, Trash2, CheckCircle, Clock, ShieldCheck, AlertCircle } from 'lucide-react'

const Campaigns = () => {
  const { campaigns, finishCampaign } = useApp()

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Campaign Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage calling hours, agent distribution, live transfer weights, and Telegram notifications.
          </p>
        </div>
        <Link
          to="/campaigns/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </Link>
      </div>

      {/* Campaign Privacy Rules Notice */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Lead Privacy & Retention Protocol:</span>
          <p className="mt-0.5 text-blue-800">
            We don't manage client lead history long-term. When you finish a campaign, all contact logs and leads are automatically deleted permanently so no track or logs remain over the leads.
          </p>
        </div>
      </div>

      {/* Campaigns Table / Cards */}
      <div className="dashboard-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-base">All Campaigns</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-3.5">Campaign Name</th>
                <th className="p-3.5">AI Agent</th>
                <th className="p-3.5">Calling Hours</th>
                <th className="p-3.5">Loop Times</th>
                <th className="p-3.5">Leads Status</th>
                <th className="p-3.5">Telegram</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 font-bold text-slate-900">{camp.name}</td>
                  <td className="p-3.5 font-medium text-slate-800">{camp.agentName}</td>
                  <td className="p-3.5 font-mono text-slate-600">
                    {camp.callingHours?.start} - {camp.callingHours?.end} ({camp.callingHours?.timezone})
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800">{camp.loopTimes}x Loops</td>
                  <td className="p-3.5">
                    {camp.leadsDeleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                        <Trash2 className="w-3 h-3 text-slate-400" />
                        Auto-Purged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
                        {camp.leadsCount?.toLocaleString()} Active Leads
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {camp.telegram?.enabled ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <Send className="w-3.5 h-3.5" />
                        Enabled
                      </span>
                    ) : (
                      <span className="text-slate-400">Off</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {camp.status === 'Running' ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 animate-pulse">
                        Running
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {camp.status === 'Running' && (
                      <button
                        onClick={() => finishCampaign(camp.id)}
                        className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs flex items-center gap-1 ml-auto cursor-pointer"
                        title="Finish campaign, send stats to Telegram, and purge lead database"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Finish & Purge Leads
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Campaigns
