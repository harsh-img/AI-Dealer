import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Plus, Send, Trash2, CheckCircle, ShieldCheck, Sliders, Users, Check } from 'lucide-react'

const Campaigns = () => {
  const { campaigns, finishCampaign, liveAgents, distributeCampaignCalls } = useApp()

  // State for Call Distribution Modal
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [showDistributeModal, setShowDistributeModal] = useState(false)
  const [distributeMode, setDistributeMode] = useState('weighted')
  const [weightsMap, setWeightsMap] = useState({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleOpenDistributeModal = (camp) => {
    setSelectedCampaign(camp)
    setDistributeMode(camp.distribution || 'weighted')
    
    // Initialize transfer weights map
    const initialMap = {}
    liveAgents.forEach((ag) => {
      initialMap[ag.id] = camp.transferWeights?.[ag.id] ?? ag.weight ?? 30
    })
    setWeightsMap(initialMap)
    setSaveSuccess(false)
    setShowDistributeModal(true)
  }

  const handleWeightChange = (agId, val) => {
    setWeightsMap(prev => ({
      ...prev,
      [agId]: Number(val)
    }))
  }

  const handleSaveDistribution = (e) => {
    e.preventDefault()
    if (!selectedCampaign) return

    distributeCampaignCalls(selectedCampaign.id, distributeMode, weightsMap)
    setSaveSuccess(true)
    setTimeout(() => {
      setSaveSuccess(false)
      setShowDistributeModal(false)
    }, 1200)
  }

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

      {/* Campaigns Table */}
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
                <th className="p-3.5">Distribution Mode</th>
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
                  <td className="p-3.5 font-semibold capitalize text-blue-700">
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[11px]">
                      {camp.distribution || 'weighted'}
                    </span>
                  </td>
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
                    <div className="flex items-center justify-end gap-2">
                      {/* Post-Creation Call Distribution Option */}
                      <button
                        onClick={() => handleOpenDistributeModal(camp)}
                        className="px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] border border-blue-200 flex items-center gap-1 cursor-pointer transition"
                        title="Configure post-creation call distribution between agents"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Distribute Calls</span>
                      </button>

                      {camp.status === 'Running' && (
                        <button
                          onClick={() => finishCampaign(camp.id)}
                          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition"
                          title="Finish campaign, send stats to Telegram, and purge lead database"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Finish & Purge</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CALL DISTRIBUTION MODAL FOR POST-CREATION */}
      {showDistributeModal && selectedCampaign && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  Post-Creation Call Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Campaign: <strong className="text-slate-800">{selectedCampaign.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowDistributeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveDistribution} className="space-y-4">
              
              {/* Distribution Mode Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose How Calls Distributed Between Agents
                </label>
                <select
                  value={distributeMode}
                  onChange={(e) => setDistributeMode(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="shuffle">Shuffle (Random distribution between agents)</option>
                  <option value="all_together">All Together (Simultaneous blast calling)</option>
                  <option value="weighted">Weighted Round-Robin (Distributed by routing weights)</option>
                </select>
              </div>

              {/* Agent Routing Weight Sliders */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-600" />
                  Agent Transfer Routing Weights (%)
                </label>
                <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {liveAgents.map((ag) => (
                    <div key={ag.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="w-2/5">
                        <span className="font-bold text-slate-800">{ag.name}</span>
                        <span className="block text-[10px] text-slate-500">{ag.department}</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={weightsMap[ag.id] ?? 30}
                          onChange={(e) => handleWeightChange(ag.id, e.target.value)}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                        <span className="font-bold text-blue-600 min-w-[32px] text-right">
                          {weightsMap[ag.id] ?? 30}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDistributeModal(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Calls Distributed!</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="w-4 h-4" />
                      <span>Apply & Distribute Calls</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Campaigns
