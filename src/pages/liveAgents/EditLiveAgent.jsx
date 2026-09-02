import React from 'react'
import { Link, useParams } from 'react-router-dom'
import liveAgentsData from '../../data/liveAgents.json'
import LiveAgentForm from '../../components/liveAgents/LiveAgentForm'

const EditLiveAgent = () => {
  const { id } = useParams()
  const agent = (liveAgentsData.liveAgents || []).find((a) => String(a.id) === String(id))

  if (!agent) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Live Agent Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested live agent record does not exist.
        </p>
        <Link
          to="/live-agents"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
        >
          Back to Live Agents
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-10">
      {/* Header & Breadcrumb */}
      <div className="space-y-2 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/live-agents" className="hover:text-indigo-600 transition">
            Live Agents
          </Link>
          <span>/</span>
          <Link to={`/live-agents/${agent.id}`} className="hover:text-indigo-600 transition">
            {agent.name}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Edit</span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Edit Live Agent
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Update agent contact details, availability status, or call transfer priority weight.
          </p>
        </div>
      </div>

      {/* Unified Form */}
      <LiveAgentForm initialValues={agent} isEdit={true} />
    </div>
  )
}

export default EditLiveAgent
