import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Bot,
  Sliders,
  MessageSquare,
  Volume2,
  Globe,
  Check,
  Save,
  Plus,
  X,
} from "lucide-react";

const PRESET_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
];

const Agents = () => {
  const { aiAgents, updateAiAgent, addAiAgent } = useApp();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edit form state
  const [editPrompt, setEditPrompt] = useState("");
  const [editGender, setEditGender] = useState("Female");
  const [editLanguage, setEditLanguage] = useState("English (US)");
  const [editSpeed, setEditSpeed] = useState(1.0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Add agent form state
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentAvatar, setNewAgentAvatar] = useState(PRESET_AVATARS[0]);
  const [newAgentPrompt, setNewAgentPrompt] = useState("");
  const [newAgentGender, setNewAgentGender] = useState("Female");
  const [newAgentLanguage, setNewAgentLanguage] = useState("English (US)");
  const [addSavedSuccess, setAddSavedSuccess] = useState(false);

  // Toggle status between Active and Inactive
  const toggleAgentStatus = (agentId, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    updateAiAgent(agentId, { status: nextStatus });
  };

  const handleOpenEdit = (agent) => {
    setSelectedAgent(agent);
    setEditPrompt(agent.prompt || "");
    setEditGender(agent.gender || "Female");
    setEditLanguage(agent.language || "English (US)");
    setEditSpeed(agent.speed || 1.0);
    setSavedSuccess(false);
    setIsEditModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedAgent) return;
    updateAiAgent(selectedAgent.id, {
      prompt: editPrompt,
      gender: editGender,
      language: editLanguage,
      speed: editSpeed,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsEditModalOpen(false);
    }, 800);
  };

  const handleCreateAgent = (e) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    addAiAgent({
      name: newAgentName.trim(),
      avatar: newAgentAvatar,
      prompt:
        newAgentPrompt.trim() ||
        "You are a helpful AI sales representative. Introduce our service, answer caller questions politely, and qualify interested leads.",
      gender: newAgentGender,
      language: newAgentLanguage,
      accent: "Neutral Professional",
      speed: 1.0,
      concurrency: 15,
      status: "Active",
    });

    setAddSavedSuccess(true);
    setTimeout(() => {
      setAddSavedSuccess(false);
      setIsAddModalOpen(false);
      // Reset form
      setNewAgentName("");
      setNewAgentAvatar(PRESET_AVATARS[0]);
      setNewAgentPrompt("");
      setNewAgentGender("Female");
      setNewAgentLanguage("English (US)");
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI Agent Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure system prompts, voice gender, languages, and live status.
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-blue-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add AI Agent</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {aiAgents.map((agent) => (
          <div
            key={agent.id}
            className={`dashboard-card p-5 flex flex-col justify-between hover:shadow-md transition relative ${
              agent.status === "Active"
                ? "border-emerald-200/80 ring-1 ring-emerald-500/10"
                : "opacity-85"
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={
                        agent.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      }
                      alt={agent.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/20"
                    />
                    {agent.status === "Active" && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {agent.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-semibold">
                        {agent.gender}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium">
                        {agent.language}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge + Toggle Switch */}
                <div className="flex items-center gap-2">
                  {agent.status === "Active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      LIVE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      Inactive
                    </span>
                  )}

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={agent.status === "Active"}
                    onClick={() => toggleAgentStatus(agent.id, agent.status)}
                    title={
                      agent.status === "Active"
                        ? "Click to Deactivate Agent"
                        : "Click to Make Agent Live"
                    }
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      agent.status === "Active"
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        agent.status === "Active"
                          ? "translate-x-4"
                          : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Prompt snippet preview */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 my-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    System Prompt:
                  </p>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 italic">
                  "{agent.prompt}"
                </p>
              </div>
            </div>

            {/* Action */}
            <div className="pt-3 mt-2 border-t border-slate-100 flex items-center gap-2">
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

      {/* MODAL 1: ADD NEW AI AGENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Create New AI Agent
                  </h3>
                  <p className="text-xs text-slate-500">
                    Set persona identity, script prompt, and voice settings
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateAgent}
              className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              {/* Agent Name */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  Agent Persona Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g. Alex (SaaS Closer AI), Priya (Customer Support)"
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-medium"
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-2 block">
                  Choose Avatar Image
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {PRESET_AVATARS.map((av, idx) => (
                    <img
                      key={idx}
                      src={av}
                      alt="Avatar option"
                      onClick={() => setNewAgentAvatar(av)}
                      className={`w-11 h-11 rounded-full object-cover cursor-pointer border-2 transition ${
                        newAgentAvatar === av
                          ? "border-blue-600 scale-110 shadow-md ring-2 ring-blue-500/30"
                          : "border-slate-200 opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  AI System Prompt / Script Instructions
                </label>
                <textarea
                  rows={4}
                  required
                  value={newAgentPrompt}
                  onChange={(e) => setNewAgentPrompt(e.target.value)}
                  className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white text-slate-800"
                  placeholder="You are Alex, an articulate and friendly SDR for outbound calling. Qualify prospects on budget and timeline..."
                />
              </div>

              {/* Voice Gender & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                    Voice Gender
                  </label>
                  <select
                    value={newAgentGender}
                    onChange={(e) => setNewAgentGender(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Female">
                      Female (Natural Professional)
                    </option>
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
                    value={newAgentLanguage}
                    onChange={(e) => setNewAgentLanguage(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
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

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  {addSavedSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Created Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Create Agent</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIGURE EXISTING AI AGENT */}
      {isEditModalOpen && selectedAgent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Configure {selectedAgent.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update system prompt, voice, and language settings
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
            >
              {/* 1. Change Prompt */}
              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  Change Agent Prompt
                </label>
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Female">
                      Female (Natural Professional)
                    </option>
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
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
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

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
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
  );
};

export default Agents;
