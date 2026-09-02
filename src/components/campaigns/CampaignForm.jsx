import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Upload, PhoneCall, Clock, ShieldAlert, Send, Sliders, Repeat, Users, CheckCircle, AlertTriangle } from 'lucide-react'

const CampaignForm = ({ initialValues, isEdit = false }) => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const { aiAgents, liveAgents, createCampaign } = useApp()

  // Form State
  const [name, setName] = useState(initialValues?.name || '')
  const [agentId, setAgentId] = useState(initialValues?.agentId || (aiAgents[0]?.id || ''))
  const [startTime, setStartTime] = useState(initialValues?.callingHours?.start || '09:00')
  const [endTime, setEndTime] = useState(initialValues?.callingHours?.end || '18:00')
  const [timezone, setTimezone] = useState(initialValues?.callingHours?.timezone || 'EST')
  const [loopTimes, setLoopTimes] = useState(initialValues?.loopTimes || 2)
  const [distribution, setDistribution] = useState(initialValues?.distribution || 'weighted')
  const [csvFileName, setCsvFileName] = useState(initialValues?.csvFileName || '')
  const [leadsCount, setLeadsCount] = useState(initialValues?.leadsCount || 1248)
  
  // Telegram settings
  const [telegramEnabled, setTelegramEnabled] = useState(true)
  const [telegramBotToken, setTelegramBotToken] = useState('bot74920481:AAG_x9320kLms-pQx')
  const [telegramChatId, setTelegramChatId] = useState('-1009876543')

  // Transfer weights state (map of liveAgentId -> weight)
  const [transferWeights, setTransferWeights] = useState(() => {
    const initialMap = {}
    liveAgents.forEach((ag, idx) => {
      initialMap[ag.id] = ag.weight || (idx === 0 ? 50 : idx === 1 ? 30 : 20)
    })
    return initialMap
  })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCsvFileName(file.name)
      const estimated = Math.max(300, Math.round(file.size / 40))
      setLeadsCount(estimated)
    }
  }

  const handleWeightChange = (liveId, val) => {
    setTransferWeights(prev => ({
      ...prev,
      [liveId]: Number(val)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const selectedAgentObj = aiAgents.find(a => a.id === agentId)
    const campaignPayload = {
      name: name || 'New AI Outbound Campaign',
      agentId,
      agentName: selectedAgentObj ? selectedAgentObj.name : 'AI Agent',
      leadsCount,
      callingHours: { start: startTime, end: endTime, timezone },
      loopTimes: Number(loopTimes),
      distribution,
      autoDeleteLeads: true,
      telegram: {
        enabled: telegramEnabled,
        botToken: telegramBotToken,
        chatId: telegramChatId
      },
      transferWeights
    }

    createCampaign(campaignPayload)
    navigate('/campaigns')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* 1. Campaign Basics Card */}
      <div className="dashboard-card p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-blue-600" />
            Campaign Basics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define campaign identifier and assign the calling AI Agent persona.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Campaign Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q3 Sales Outreach"
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign AI Agent Persona <span className="text-rose-500">*</span>
            </label>
            <select
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
            >
              {aiAgents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} ({agent.gender}, {agent.language}) — {agent.concurrency} lines
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Leads CSV Upload */}
      <div className="dashboard-card p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Upload Leads File
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload contact numbers in CSV format.
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
            csvFileName ? 'border-emerald-400 bg-emerald-50/30' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          {csvFileName ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
              <p className="text-xs font-bold text-slate-900">{csvFileName}</p>
              <p className="text-[11px] text-slate-500">~{leadsCount.toLocaleString()} leads detected • Click to replace file</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-blue-600" />
              <p className="text-xs font-semibold text-slate-700">Click to browse or drop CSV leads file</p>
              <p className="text-[11px] text-slate-400">Supports phone number column, customer name, metadata (Max 10MB)</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Calling Hours, Loops & Call Distribution */}
      <div className="dashboard-card p-6 space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Calling Schedule, Loop Times & Distribution Strategy
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage daily calling windows, repeat loops over leads, and incoming/outbound call allocation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Calling Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Calling End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="EST">EST (Eastern Time)</option>
              <option value="CST">CST (Central Time)</option>
              <option value="PST">PST (Pacific Time)</option>
              <option value="IST">IST (India Standard)</option>
              <option value="GMT">GMT (London)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Calling Loop Times */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-blue-600" />
              Calling Loop Times (Repeat over leads)
            </label>
            <select
              value={loopTimes}
              onChange={(e) => setLoopTimes(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value={1}>1 Loop (Single attempt per contact)</option>
              <option value={2}>2 Loops (Retry un-answered once)</option>
              <option value={3}>3 Loops (Retry un-answered twice)</option>
              <option value={5}>5 Loops (Maximum retry persistence)</option>
            </select>
          </div>

          {/* Call Distribution Strategy */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              Call Distribution Strategy
            </label>
            <select
              value={distribution}
              onChange={(e) => setDistribution(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
            >
              <option value="shuffle">Shuffle (Random distribution)</option>
              <option value="all_together">All Together (Simultaneous blast)</option>
              <option value="weighted">Weighted Round-Robin (By agent capacity)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form Action */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={() => navigate('/campaigns')}
          className="px-5 py-2.5 border border-slate-300 bg-white text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition cursor-pointer"
        >
          {isEdit ? 'Save Campaign Settings' : 'Create & Launch Campaign'}
        </button>
      </div>

    </form>
  )
}

export default CampaignForm
