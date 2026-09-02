import React from 'react'
import { Link } from 'react-router-dom'
import LiveAgentForm from '../../components/liveAgents/LiveAgentForm'

const CreateLiveAgent = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-10">
      {/* Header & Breadcrumb */}
      <div className="space-y-2 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/live-agents" className="hover:text-indigo-600 transition">
            Live Agents
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Add New Live Agent</span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Add Live Agent
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Register a human agent for AI call transfers, escalation handling, and lead closings.
          </p>
        </div>
      </div>

      {/* Unified Form */}
      <LiveAgentForm isEdit={false} />
    </div>
  )
}

export default CreateLiveAgent
