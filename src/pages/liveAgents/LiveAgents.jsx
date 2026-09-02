import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Users, PhoneForwarded, UserCheck, Sliders, Shield, Plus, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react'

const LiveAgents = () => {
  const { liveAgents, setLiveAgents } = useApp()
  const [showAddModal, setShowAddModal] = useState(false)
  const [newAgentName, setNewAgentName] = useState('')
  const [newAgentPhone, setNewAgentPhone] = useState('')
  const [newAgentDept, setNewAgentDept] = useState('Sales')

  // Sample Transferred Client Data Cards (User section matching input_file_1.png requirement)
  const [transferredClients] = useState([
    {
      id: 'client-101',
      clientName: 'Robert Vance',
      phone: '+1 (555) 234-5678',
      agentAssigned: 'John Doe',
      aiSummary: 'Interested in Q3 Enterprise SaaS package. Team size 45. Ready for demo schedule.',
      qualificationScore: '92 / 100 (High Intent)',
      timeTransferred: '10 mins ago',
      campaign: 'Marketing Leads Q3'
    },
    {
      id: 'client-102',
      clientName: 'Samantha Myers',
      phone: '+1 (555) 876-5432',
      agentAssigned: 'Emily Clark',
      aiSummary: 'Looking for 3-bedroom property listing in downtown. Budget $850k.',
      qualificationScore: '88 / 100 (High Intent)',
      timeTransferred: '25 mins ago',
      campaign: 'Real Estate Outreach'
    }
  ])

  const handleWeightChange = (id, newWeight) => {
    setLiveAgents(prev => prev.map(ag => ag.id === id ? { ...ag, weight: Number(newWeight) } : ag))
  }

  const handleAddAgent = (e) => {
    e.preventDefault()
    if (!newAgentName) return
    const newAg = {
      id: `live-${Date.now()}`,
      name: newAgentName,
      phone: newAgentPhone || '+1 (555) 000-0000',
      extension: String(104 + liveAgents.length),
      department: newAgentDept,
      weight: 30,
      status: 'Available',
      currentTransfers: 0
    }
    setLiveAgents(prev => [...prev, newAg])
    setNewAgentName('')
    setNewAgentPhone('')
    setShowAddModal(false)
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Live Agents & Transfer Setup</h1>
          <p className="text-sm text-slate-500 mt-1">
            Set up live human agents, configure call routing weights, and inspect live client data during transfers.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Live Agent</span>
        </button>
      </div>

      {/* 1. USER SECTION: LIVE CLIENT DATA ON CALL TRANSFER (Matches input_file_1.png) */}
      <div className="dashboard-card p-6 space-y-4 bg-gradient-to-br from-blue-50/40 via-white to-white border-blue-200/80">
        <div className="flex items-center justify-between border-b border-blue-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PhoneForwarded className="w-5 h-5 text-blue-600" />
              Live Transferred Client Data Payload
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Client details and AI conversation analysis shared in real-time with human agents upon call handover.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200">
            Real-Time Handover
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transferredClients.map((client) => (
            <div key={client.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{client.clientName}</h3>
                  <p className="text-xs text-slate-500 font-mono">{client.phone} • {client.campaign}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  Score: {client.qualificationScore}
                </span>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-xs">
                <span className="font-semibold text-slate-700 block mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  AI Summary & Intent:
                </span>
                <p className="text-slate-600 italic">"{client.aiSummary}"</p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Handed to: <strong className="text-slate-800 font-semibold">{client.agentAssigned}</strong></span>
                <span>{client.timeTransferred}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. LIVE AGENTS SETUP & ROUTING WEIGHTS */}
      <div className="dashboard-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Live Agents Setup & Routing Weights
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Adjust the weight percentage for each agent to control call transfer ratio.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {liveAgents.map((agent) => (
            <div key={agent.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-bold text-blue-700 text-sm">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{agent.name}</h3>
                  <p className="text-xs text-slate-500">{agent.department} • Ext: {agent.extension} • {agent.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 min-w-[240px]">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 font-medium">Transfer Weight</span>
                    <span className="font-bold text-blue-600">{agent.weight}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={agent.weight}
                    onChange={(e) => handleWeightChange(agent.id, e.target.value)}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                  agent.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {agent.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add Live Agent</h3>
            <form onSubmit={handleAddAgent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newAgentPhone}
                  onChange={(e) => setNewAgentPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 392-1049"
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={newAgentDept}
                  onChange={(e) => setNewAgentDept(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                >
                  <option value="Sales">Sales</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Support">Support</option>
                  <option value="Appointments">Appointments</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-xs"
                >
                  Add Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveAgents
