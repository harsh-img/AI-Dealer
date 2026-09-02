import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import agentsData from '../../data/agents.json'

const getStatusBadge = (status) => {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      Inactive
    </span>
  )
}

const AgentDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const agent = (agentsData.agents || []).find((a) => String(a.id) === String(id))

  if (!agent) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Agent Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested AI agent doesn't exist in dummy records.
        </p>
        <Link
          to="/agents"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
        >
          Back to AI Agents
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
            <Link to="/agents" className="hover:text-indigo-600 transition">
              AI Agents
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{agent.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {agent.name}
            </h1>
            {getStatusBadge(agent.status)}
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => navigate('/agents')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            ← Back to Agents
          </button>
          <Link
            to={`/agents/${agent.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Agent</span>
          </Link>
        </div>
      </div>

      {/* 2. Overview Profile Summary */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Agent Overview</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Voice persona specifications and behavioral parameters.
          </p>
        </div>

        {/* Description */}
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Description
          </span>
          <p className="text-sm text-slate-800 mt-1 leading-relaxed">
            {agent.description || 'No description provided for this agent persona.'}
          </p>
        </div>

        {/* 4-Grid Specifications */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Voice Persona</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{agent.voice}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Language</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{agent.language}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Gender</span>
            <span className="text-sm font-bold text-slate-900 mt-0.5 block">{agent.gender}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Operational Status</span>
            <div className="mt-1">{getStatusBadge(agent.status)}</div>
          </div>
        </div>
      </div>

      {/* 3. System Prompt Container */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">System Prompt & Instructions</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Read-only view of the AI conversational script and context instructions.
            </p>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(agent.prompt)
              alert('System prompt copied to clipboard!')
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Copy Prompt</span>
          </button>
        </div>

        {/* Formatted prompt display */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-text">
          {agent.prompt}
        </div>
      </div>

      {/* 4. Metadata Footer Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          <span>Agent ID: </span>
          <span className="font-mono font-semibold text-slate-700">{agent.id}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>
            Created on: <strong className="text-slate-700">{agent.createdAt}</strong>
          </span>
          <span>•</span>
          <span>
            Last modified: <strong className="text-slate-700">{agent.updatedAt || agent.createdAt}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}

export default AgentDetails
