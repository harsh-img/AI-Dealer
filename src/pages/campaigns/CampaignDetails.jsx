import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import campaignsData from '../../data/campaigns.json'

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'running':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Running
        </span>
      )
    case 'paused':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Paused
        </span>
      )
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Completed
        </span>
      )
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Scheduled
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

const CampaignDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const campaign = (campaignsData.campaigns || []).find((c) => String(c.id) === String(id))

  if (!campaign) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-900">Campaign Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The requested campaign does not exist in records.
        </p>
        <Link
          to="/campaigns"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition"
        >
          Back to Campaigns
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-10">
      {/* 1. Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/campaigns" className="hover:text-indigo-600 transition">
              Campaigns
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{campaign.name}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {campaign.name}
            </h1>
            {getStatusBadge(campaign.status)}
          </div>
        </div>

        {/* Action Buttons: Back & Edit */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => navigate('/campaigns')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold shadow-2xs transition cursor-pointer"
          >
            ← Back to Campaigns
          </button>
          <Link
            to={`/campaigns/${campaign.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit Campaign</span>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Leads */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Leads
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">
            {Number(campaign.totalLeads || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Contact pool size</span>
        </div>

        {/* Calls Made */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Calls Made
          </span>
          <span className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 block">
            {Number(campaign.callsMade || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Total dialed attempts
          </span>
        </div>

        {/* Answered Calls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Answered Calls
          </span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-600 mt-1 block">
            {Number(campaign.answeredCalls || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {campaign.callsMade ? Math.round((campaign.answeredCalls / campaign.callsMade) * 100) : 0}% pickup rate
          </span>
        </div>

        {/* Interested Leads */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Interested Leads
          </span>
          <span className="text-xl sm:text-2xl font-bold text-indigo-600 mt-1 block">
            {Number(campaign.interestedLeads || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {campaign.answeredCalls ? Math.round((campaign.interestedLeads / campaign.answeredCalls) * 100) : 0}% conv. rate
          </span>
        </div>

        {/* Transferred Calls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Transferred Calls
          </span>
          <span className="text-xl sm:text-2xl font-bold text-violet-600 mt-1 block">
            {Number(campaign.transferredCalls || 0).toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Live agent handoffs</span>
        </div>
      </div>

      {/* 3. Campaign Specifications & Operational Parameters */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Operational Configuration</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Voice agent specifications, timing schedule, and retry rules.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* AI Voice Agent */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              AI Voice Agent
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {campaign.agentName || 'Default Agent'}
            </span>
            {campaign.agentId && (
              <Link
                to={`/agents/${campaign.agentId}`}
                className="text-[11px] text-indigo-600 hover:underline font-medium inline-block mt-0.5"
              >
                View Agent Persona →
              </Link>
            )}
          </div>

          {/* Calling Hours */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Calling Hours
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {campaign.startTime || '09:00'} – {campaign.endTime || '18:00'}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Active dialer schedule window
            </span>
          </div>

          {/* Maximum Attempts */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Maximum Attempts
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {campaign.maxAttempts || 3} {Number(campaign.maxAttempts) === 1 ? 'Attempt' : 'Attempts'} per lead
            </span>
            <span className="text-[11px] text-slate-400 block">
              Retry on unanswered / busy calls
            </span>
          </div>

          {/* Leads CSV File */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Attached Leads CSV
            </span>
            <span className="text-sm font-bold text-slate-900 block truncate" title={campaign.csvFileName}>
              {campaign.csvFileName || 'leads.csv'}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Imported contact list
            </span>
          </div>

          {/* Status */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Campaign Status
            </span>
            <div className="pt-0.5">
              {getStatusBadge(campaign.status)}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              Current operational state
            </span>
          </div>

          {/* Created Date */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
              Created Date
            </span>
            <span className="text-sm font-bold text-slate-900 block">
              {campaign.createdAt || 'N/A'}
            </span>
            <span className="text-[11px] text-slate-400 block">
              Campaign initialization date
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CampaignDetails
