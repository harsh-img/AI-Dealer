import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Users, PhoneCall, AlertCircle, TrendingUp, Filter } from 'lucide-react'

// Gauge SVG Helper for KPI circular indicators matching reference
const CircularGauge = ({ value, label, displayValue, color = '#0284c7' }) => {
  const radius = 32
  const strokeWidth = 5
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="text-slate-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute font-extrabold text-slate-800 text-sm tracking-tight">{displayValue}</span>
      </div>
      <span className="text-[11px] font-medium text-slate-500 mt-2 text-center leading-tight">{label}</span>
    </div>
  )
}

const Dashboard = () => {
  const { liveCalls, activityFeed } = useApp()
  const [pipelineTimeframe, setPipelineTimeframe] = useState('Today')
  const [agentFilter, setAgentFilter] = useState('All agents')
  const [leadSourceFilter, setLeadSourceFilter] = useState('All Source')
  const [activityResultFilter, setActivityResultFilter] = useState('All result')

  // Stacked Bar Data (Mon - Sat) for Pipeline Health
  const pipelineData = [
    { day: 'Mon', connected: 95, qualified: 60, voicemail: 30, noAnswer: 75 },
    { day: 'Tue', connected: 55, qualified: 60, voicemail: 15, noAnswer: 35 },
    { day: 'Wed', connected: 95, qualified: 70, voicemail: 20, noAnswer: 55 },
    { day: 'Thu', connected: 80, qualified: 45, voicemail: 35, noAnswer: 60 },
    { day: 'Fri', connected: 40, qualified: 40, voicemail: 65, noAnswer: 60 },
    { day: 'Sat', connected: 60, qualified: 40, voicemail: 40, noAnswer: 50 }
  ]

  const maxTotal = 260
  const barMaxHeightPx = 130

  // Lead List Management rows
  const leadLists = [
    { id: 1, source: 'Marketing Leads Q3', status: 'Imported' },
    { id: 2, source: 'Marketing Leads Q3', status: 'Complete' },
    { id: 3, source: 'Marketing Leads Q4', status: 'Imported' }
  ]

  // 1. DYNAMIC FILTER 1: Live Call Status Filter
  const filteredLiveCalls = liveCalls.filter((call) => {
    if (agentFilter === 'AI Agents') return call.agentType === 'AI Agents'
    if (agentFilter === 'Live Agents') return call.agentType === 'Live Agents'
    return true
  })

  // 2. DYNAMIC FILTER 2: Lead List Management Source Filter
  const filteredLeadLists = leadLists.filter((item) => {
    if (leadSourceFilter === 'All Source') return true
    return item.source === leadSourceFilter
  })

  // 3. DYNAMIC FILTER 3: Recent Activity Feed Result Filter
  const filteredActivityFeed = activityFeed.filter((act) => {
    if (activityResultFilter === 'All result') return true
    return act.result === activityResultFilter
  })

  return (
    <div className="space-y-6 pt-2 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Dialer MVP Dashboard</h1>
      </div>

      {/* 1. TOP ROW CARDS (Campaign Overview | Key Performance Indicators | Pipeline Health) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Card 1: Campaign Overview with Area Graph */}
        <div className="lg:col-span-4 dashboard-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Campaign Overview</h2>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <TrendingUp className="w-3 h-3" />
              +14.2%
            </span>
          </div>

          {/* Smooth Trend Area Graph */}
          <div className="h-20 w-full my-2 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 70" preserveAspectRatio="none">
              <defs>
                <linearGradient id="campaignOverviewGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0,50 C 40,20 80,45 120,25 C 160,35 220,10 300,18 L 300,70 L 0,70 Z"
                fill="url(#campaignOverviewGradient)"
              />
              <path
                d="M 0,50 C 40,20 80,45 120,25 C 160,35 220,10 300,18"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="120" cy="25" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="300" cy="18" r="3.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-2 items-end pt-2 border-t border-slate-100">
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Active Campaigns</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">3</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Leads Dialed Today</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">1,248</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Total Calls</p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">5,670</p>
            </div>
          </div>
        </div>

        {/* Card 2: Key Performance Indicators */}
        <div className="lg:col-span-4 dashboard-card p-5">
          <h2 className="text-sm font-bold text-slate-800 mb-2">Key Performance Indicators</h2>
          <div className="grid grid-cols-3 gap-2 items-center justify-center">
            <CircularGauge value={80} displayValue="16" label="Calls per Hour" color="#0284c7" />
            <CircularGauge value={42} displayValue="42%" label="Connection Rate" color="#0284c7" />
            <CircularGauge value={60} displayValue="1:15" label="Avg. Call Duration" color="#0284c7" />
          </div>
        </div>

        {/* Card 3: Pipeline Health Stacked Bar Chart */}
        <div className="lg:col-span-4 dashboard-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-slate-800">Pipeline Health</h2>
            <select
              value={pipelineTimeframe}
              onChange={(e) => setPipelineTimeframe(e.target.value)}
              className="text-[11px] bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-600 focus:outline-none cursor-pointer font-medium"
            >
              <option value="Today">Today</option>
              <option value="This Week">This Week</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          {/* Stacked Bar Chart */}
          <div className="h-[140px] flex items-end justify-between gap-3 px-2 pt-2">
            {pipelineData.map((item, idx) => {
              const scale = barMaxHeightPx / maxTotal
              const hConn = Math.max(8, Math.round(item.connected * scale))
              const hQual = Math.max(8, Math.round(item.qualified * scale))
              const hVoice = Math.max(8, Math.round(item.voicemail * scale))
              const hNoAns = Math.max(8, Math.round(item.noAnswer * scale))

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div className="w-full max-w-[24px] flex flex-col rounded overflow-hidden">
                    <div style={{ height: `${hConn}px` }} className="bg-[#0284c7]" title={`Connected: ${item.connected}`} />
                    <div style={{ height: `${hQual}px` }} className="bg-[#10b981]" title={`Qualified: ${item.qualified}`} />
                    <div style={{ height: `${hVoice}px` }} className="bg-[#f97316]" title={`Voicemail: ${item.voicemail}`} />
                    <div style={{ height: `${hNoAns}px` }} className="bg-[#94a3b8]" title={`No Answer: ${item.noAnswer}`} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 mt-2">{item.day}</span>
                </div>
              )
            })}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-between text-[10px] text-slate-600 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#0284c7] inline-block" />
              <span>Connected</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10b981] inline-block" />
              <span>Qualified</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#f97316] inline-block" />
              <span>Voicemail</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#94a3b8] inline-block" />
              <span>No Answer</span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. MIDDLE ROW: LIVE CALL STATUS WITH WORKING FILTER 1 */}
      <div className="dashboard-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800">Live Call Status</h2>
            {agentFilter !== 'All agents' && (
              <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                Filtered: {agentFilter}
              </span>
            )}
          </div>
          {/* Working Dropdown Filter 1 */}
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="text-[11px] bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="All agents">All agents</option>
            <option value="AI Agents">AI Agents</option>
            <option value="Live Agents">Live Agents</option>
          </select>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          
          {/* Left: Donut Chart & Legend */}
          <div className="flex items-center gap-5 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 pb-4 lg:pb-0 lg:pr-8 w-full lg:w-auto">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50" cy="50" r="36"
                  stroke="#0284c7" strokeWidth="16"
                  strokeDasharray="226.2" strokeDashoffset="67.8"
                  fill="transparent"
                />
                <circle
                  cx="50" cy="50" r="36"
                  stroke="#38bdf8" strokeWidth="16"
                  strokeDasharray="226.2" strokeDashoffset="203.5"
                  fill="transparent"
                />
                <circle
                  cx="50" cy="50" r="36"
                  stroke="#f97316" strokeWidth="16"
                  strokeDasharray="226.2" strokeDashoffset="226.2"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Active Agents (AI)</p>
                <p className="text-xl font-extrabold text-slate-900">7</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Connecting</p>
                <p className="text-base font-bold text-slate-800">2</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Idle</p>
                <p className="text-base font-bold text-slate-800">1</p>
              </div>
            </div>
          </div>

          {/* Right: Live Agent Interaction Table filtered by Filter 1 */}
          <div className="flex-1 w-full overflow-x-auto">
            {filteredLiveCalls.length > 0 ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-2.5">Agent Name</th>
                    <th className="pb-2.5">Lead Name</th>
                    <th className="pb-2.5">Duration</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredLiveCalls.map((call) => (
                    <tr key={call.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5 flex items-center gap-2.5 font-semibold text-slate-800">
                        <img
                          src={call.avatar}
                          alt={call.agentName}
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span>{call.agentName}</span>
                          <span className="block text-[10px] text-slate-400 font-normal">{call.agentType}</span>
                        </div>
                      </td>
                      <td className="py-2.5 text-slate-600">{call.leadName}</td>
                      <td className="py-2.5 font-mono text-slate-500">{call.duration}</td>
                      <td className="py-2.5">
                        {call.status === 'Connected' ? (
                          <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                            Connected
                          </span>
                        ) : (
                          <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-700">
                            Voicemail
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-center text-xs text-slate-500 font-medium">
                No active calls match filter: <strong>"{agentFilter}"</strong>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* 3. BOTTOM ROW: LEAD LIST MANAGEMENT & RECENT ACTIVITY FEED WITH WORKING FILTERS 2 & 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Lead List Management WITH WORKING FILTER 2 */}
        <div className="lg:col-span-7 dashboard-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">Lead List Management</h2>
              {/* Working Dropdown Filter 2 */}
              <select
                value={leadSourceFilter}
                onChange={(e) => setLeadSourceFilter(e.target.value)}
                className="text-[11px] bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-slate-700 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All Source">All Source</option>
                <option value="Marketing Leads Q3">Marketing Leads Q3</option>
                <option value="Marketing Leads Q4">Marketing Leads Q4</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              {filteredLeadLists.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold tracking-wider text-[10px] uppercase">
                      <th className="pb-2">Lead Source</th>
                      <th className="pb-2">Status</th>
                      <th className="pb-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeadLists.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 font-semibold text-slate-800">{item.source}</td>
                        <td className="py-3">
                          {item.status === 'Imported' ? (
                            <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700">
                              Imported
                            </span>
                          ) : (
                            <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700">
                              Complete
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="px-3 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer">
                              View
                            </button>
                            <button className="px-3.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition cursor-pointer shadow-xs">
                              Start Call
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 font-medium">
                  No lead source matching <strong>"{leadSourceFilter}"</strong>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-400">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Note: Leads are automatically deleted on campaign completion for privacy.</span>
          </div>
        </div>

        {/* Recent Activity Feed WITH WORKING FILTER 3 */}
        <div className="lg:col-span-5 dashboard-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">Recent Activity Feed</h2>
              {/* Working Dropdown Filter 3 */}
              <select
                value={activityResultFilter}
                onChange={(e) => setActivityResultFilter(e.target.value)}
                className="text-[11px] bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="All result">All result</option>
                <option value="Connected">Connected</option>
                <option value="Qualified">Qualified</option>
                <option value="Voicemail">Voicemail</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredActivityFeed.length > 0 ? (
                filteredActivityFeed.map((act) => (
                  <div key={act.id} className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{act.title}</p>
                        <p className="text-xs font-medium mt-0.5 text-slate-600">
                          Result:{' '}
                          <span className={
                            act.result === 'Connected' ? 'text-blue-600 font-bold' :
                            act.result === 'Qualified' ? 'text-emerald-600 font-bold' :
                            'text-orange-500 font-bold'
                          }>
                            {act.result}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{act.time}</span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 font-medium">
                  No activity logs matching result <strong>"{activityResultFilter}"</strong>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard
