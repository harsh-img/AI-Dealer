import React, { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Bot, Sliders, MessageSquare, Volume2, Globe, Cpu, Check, Save, Sparkles } from 'lucide-react'

const Agents = () => {
  const { aiAgents, updateAiAgent } = useApp()
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Edit form state
  const [editPrompt, setEditPrompt] = useState('')
  const [editGender, setEditGender] = useState('Female')
  const [editLanguage, setEditLanguage] = useState('English (US)')
  const [editConcurrency, setEditConcurrency] = useState(15)
  const [editSpeed, setEditSpeed] = useState(1.0)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleOpenEdit = (agent) => {
    setSelectedAgent(agent)
    setEditPrompt(agent.prompt || '')
    setEditGender(agent.gender || 'Female')
    setEditLanguage(agent.language || 'English (US)')
    setEditConcurrency(agent.concurrency || 15)
    setEditSpeed(agent.speed || 1.0)
    setSavedSuccess(false)
    setIsEditModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!selectedAgent) return
    updateAiAgent(selectedAgent.id, {
      prompt: editPrompt,
      gender: editGender,
      language: editLanguage,
      concurrency: editConcurrency,
      speed: editSpeed
    })
    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      setIsEditModalOpen(false)
    }, 1000)
  }

  const insertVariable = (varName) => {
    setEditPrompt((prev) => `${prev} {${varName}}`)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Agent Settings</h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure system prompts, voice gender, languages, and concurrency limits for outbounds.
          </p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {aiAgents.map((agent) => (
          <div key={agent.id} className="dashboard-card p-5 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={agent.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={agent.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{agent.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold">
                        {agent.gender}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                        {agent.language}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700">
                  {agent.status}
                </span>
              </div>

              {/* Prompt snippet preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 my-3">
                <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  System Prompt:
                </p>
                <p className="text-xs text-slate-600 line-clamp-3 italic">"{agent.prompt}"</p>
              </div>

              {/* Concurrency & Active Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-t border-slate-100 text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px]">Concurrency Limit</span>
                  <span className="font-bold text-slate-800 text-sm">{agent.concurrency} lines</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Active Calls Now</span>
                  <span className="font-bold text-blue-600 text-sm">{agent.activeCalls} active</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 mt-2 border-t border-slate-100">
              <button
                onClick={() => handleOpenEdit(agent)}
                className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure Agent & Prompt</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Drawer / Modal */}
      {isEditModalOpen && selectedAgent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Configure {selectedAgent.name}</h3>
                  <p className="text-xs text-slate-500">Update system prompt, voice, language, and line availability</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* 1. Change Prompt */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    Change Agent Prompt
                  </label>
                  {/* Dynamic Variable Chips */}
                  <div className="flex items-center gap-1 text-[11px]">
                    <span className="text-slate-400">Insert:</span>
                    <button
                      type="button"
                      onClick={() => insertVariable('client_name')}
                      className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 font-mono text-[10px]"
                    >
                      + client_name
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable('phone_number')}
                      className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 font-mono text-[10px]"
                    >
                      + phone_number
                    </button>
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  placeholder="Enter AI System Prompt..."
                />
              </div>

              {/* 2. Gender & Language Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                    Agent Voice Gender
                  </label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Female">Female (Natural Professional)</option>
                    <option value="Male">Male (Standard Professional)</option>
                    <option value="Neutral">Neutral (Warm Assistant)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    Language / Accent
                  </label>
                  <select
                    value={editLanguage}
                    onChange={(e) => setEditLanguage(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="English (US)">English (US)</option>
                    <option value="English (UK)">English (UK)</option>
                    <option value="Hindi">Hindi (India)</option>
                    <option value="Spanish">Spanish (Castilian)</option>
                    <option value="French">French (Parisian)</option>
                    <option value="German">German (Standard)</option>
                  </select>
                </div>
              </div>

              {/* 3. Concurrency & Availability */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    Availability & Concurrency Lines
                  </label>
                  <span className="px-2.5 py-0.5 bg-blue-600 text-white font-bold rounded text-xs">
                    {editConcurrency} Parallel Calls
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={editConcurrency}
                  onChange={(e) => setEditConcurrency(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <p className="text-[11px] text-slate-500">
                  Increasing concurrency allows this agent to place up to <strong>{editConcurrency} simultaneous calls</strong>.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Agent Settings</span>
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

export default Agents
