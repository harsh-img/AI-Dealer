import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import liveAgentsData from '../../data/liveAgents.json'

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'available':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Available
        </span>
      )
    case 'busy':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Busy
        </span>
      )
    case 'offline':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Offline
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {status}
        </span>
      )
  }
}

const LiveAgentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
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
      {/* 1. Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/live-agents" className="hover:text-indigo-600 transition">
              Live Agents
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{agent.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {agent.name}
            </h1>
            {getStatusBadge(agent.status)}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => navigate('/live-agents')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            ← Back to Live Agents
          </button>
          <Link
            to={`/live-agents/${agent.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Agent</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Calls Handled */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Calls Handled
          </span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">
            {Number(agent.callsHandled || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Total transferred calls taken</span>
        </div>

        {/* Routing Weight */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Routing Priority Weight
          </span>
          <span className="text-2xl font-bold text-indigo-600 mt-1 block">
            {agent.weight} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Transfer queue weight</span>
        </div>

        {/* Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Current Status
          </span>
          <div className="mt-2">
            {getStatusBadge(agent.status)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Transfer availability</span>
        </div>
      </div>

      {/* 3. Live Agent Profile Details */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Agent Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Contact information and transfer routing specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Agent Full Name */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Agent Name
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {agent.name}
            </span>
          </div>

          {/* Phone Number */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Direct Phone Number
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {agent.phone}
            </span>
          </div>

          {/* Email Address */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Email Address
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {agent.email}
            </span>
          </div>

          {/* Created Date */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Registered Date
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {agent.createdAt || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveAgentDetails
