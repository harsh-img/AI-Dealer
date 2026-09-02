import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Users,
  PhoneCall,
  AlertCircle,
  TrendingUp,
  Filter,
  Eye,
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Database,
  Bot,
} from "lucide-react";

// Gauge SVG Helper for KPI circular indicators matching reference
const CircularGauge = ({ value, label, displayValue, color = "#0284c7" }) => {
  const radius = 32;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

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
        <span className="absolute font-extrabold text-slate-800 text-sm tracking-tight">
          {displayValue}
        </span>
      </div>
      <span className="text-[11px] font-medium text-slate-500 mt-2 text-center leading-tight">
        {label}
      </span>
    </div>
  );
};

const Dashboard = () => {
  const { liveCalls, activityFeed } = useApp();
  const [pipelineTimeframe, setPipelineTimeframe] = useState("Today");
  const [agentFilter, setAgentFilter] = useState("All agents");
  const [leadSourceFilter, setLeadSourceFilter] = useState("All Source");
  const [activityResultFilter, setActivityResultFilter] =
    useState("All result");

  // State for Lead Info Modal
  const [selectedLeadInfo, setSelectedLeadInfo] = useState(null);

  // Stacked Bar Data (Mon - Sat) for Pipeline Health
  const pipelineData = [
    { day: "Mon", connected: 95, qualified: 60, voicemail: 30, noAnswer: 75 },
    { day: "Tue", connected: 55, qualified: 60, voicemail: 15, noAnswer: 35 },
    { day: "Wed", connected: 95, qualified: 70, voicemail: 20, noAnswer: 55 },
    { day: "Thu", connected: 80, qualified: 45, voicemail: 35, noAnswer: 60 },
    { day: "Fri", connected: 40, qualified: 40, voicemail: 65, noAnswer: 60 },
    { day: "Sat", connected: 60, qualified: 40, voicemail: 40, noAnswer: 50 },
  ];

  const maxTotal = 260;
  const barMaxHeightPx = 130;

  // Lead List Management rows with detailed info for popup
  const leadLists = [
    {
      id: 1,
      source: "Marketing Leads Q3",
      status: "Imported",
      fileName: "marketing_leads_q3.csv",
      totalCount: 1248,
      agentAssigned: "Sarah (Tech Sales AI)",
      importDate: "2026-03-01 10:30 AM",
      retention: "Transient (Auto-Purged on Finish)",
    },
    {
      id: 2,
      source: "Marketing Leads Q3",
      status: "Complete",
      fileName: "marketing_leads_q3_final.csv",
      totalCount: 850,
      agentAssigned: "David (Property Specialist)",
      importDate: "2026-02-28 04:15 PM",
      retention: "Purged & Archived",
    },
    {
      id: 3,
      source: "Marketing Leads Q4",
      status: "Imported",
      fileName: "inbound_q4_prospects.csv",
      totalCount: 2150,
      agentAssigned: "Frida Name",
      importDate: "2026-03-02 09:00 AM",
      retention: "Transient (Active Calling)",
    },
  ];

  // 1. DYNAMIC FILTER 1: Live Call Status Filter
  const filteredLiveCalls = liveCalls.filter((call) => {
    if (agentFilter === "AI Agents") return call.agentType === "AI Agents";
    if (agentFilter === "Live Agents") return call.agentType === "Live Agents";
    return true;
  });

  // 2. DYNAMIC FILTER 2: Lead List Management Source Filter
  const filteredLeadLists = leadLists.filter((item) => {
    if (leadSourceFilter === "All Source") return true;
    return item.source === leadSourceFilter;
  });

  // 3. DYNAMIC FILTER 3: Recent Activity Feed Result Filter
  const filteredActivityFeed = activityFeed.filter((act) => {
    if (activityResultFilter === "All result") return true;
    return act.result === activityResultFilter;
  });

  return (
    <div className="space-y-6 pt-2 pb-12">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          AI Dialer MVP Dashboard
        </h1>
      </div>

      {/* 1. TOP ROW CARDS (Campaign Overview | Live Call Status) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Card 1: Campaign Overview with Area Graph */}
        <div className="lg:col-span-4 dashboard-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">
              Campaign Overview
            </h2>
          </div>

          {/* Smooth Trend Area Graph */}
          <div className="h-20 w-full my-2 relative">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 300 70"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="campaignOverviewGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
              <circle
                cx="120"
                cy="25"
                r="3.5"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              <circle
                cx="300"
                cy="18"
                r="3.5"
                fill="#0284c7"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Stats Breakdown */}
          <div className="grid grid-cols-3 gap-2 items-end pt-2 border-t border-slate-100">
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                Active Campaigns
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">3</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                Leads Dialed Today
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                1,248
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">
                Total Calls
              </p>
              <p className="text-3xl font-extrabold text-slate-900 mt-1">
                5,670
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: LIVE CALL STATUS WITH WORKING FILTER 1 */}
        <div className="lg:col-span-8 dashboard-card p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800">
                Live Call Status
              </h2>
              {agentFilter !== "All agents" && (
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

          <div className="flex flex-col xl:flex-row items-center gap-6">
            {/* Left: Donut Chart & Legend */}
            <div className="flex items-center gap-4 shrink-0 border-b xl:border-b-0 xl:border-r border-slate-100 pb-3 xl:pb-0 xl:pr-6 w-full xl:w-auto">
              <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    stroke="#0284c7"
                    strokeWidth="16"
                    strokeDasharray="226.2"
                    strokeDashoffset="67.8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    stroke="#38bdf8"
                    strokeWidth="16"
                    strokeDasharray="226.2"
                    strokeDashoffset="203.5"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="36"
                    stroke="#f97316"
                    strokeWidth="16"
                    strokeDasharray="226.2"
                    strokeDashoffset="226.2"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Active Agents (AI)
                  </p>
                  <p className="text-xl font-extrabold text-slate-900">7</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Connecting
                  </p>
                  <p className="text-sm font-bold text-slate-800">2</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Idle</p>
                  <p className="text-sm font-bold text-slate-800">1</p>
                </div>
              </div>
            </div>

            {/* Right: Live Agent Interaction Table */}
            <div className="flex-1 w-full overflow-x-auto">
              {filteredLiveCalls.length > 0 ? (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="pb-2">Agent Name</th>
                      <th className="pb-2">Lead Name</th>
                      <th className="pb-2">Duration</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredLiveCalls.map((call) => (
                      <tr
                        key={call.id}
                        className="hover:bg-slate-50/60 transition"
                      >
                        <td className="py-2 flex items-center gap-2.5 font-semibold text-slate-800">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs">{call.agentName}</span>
                            <span className="block text-[9px] text-slate-400 font-normal">
                              {call.agentType}
                            </span>
                          </div>
                        </td>
                        <td className="py-2 text-slate-600 text-xs">
                          {call.leadName}
                        </td>
                        <td className="py-2 font-mono text-slate-500 text-xs">
                          {call.duration}
                        </td>
                        <td className="py-2">
                          {call.status === "Connected" ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-700">
                              Connected
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-orange-100 text-orange-700">
                              Voicemail
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500 font-medium">
                  No active calls match filter: <strong>"{agentFilter}"</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM ROW: LEAD LIST MANAGEMENT & RECENT ACTIVITY FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Lead List Management */}
        <div className="lg:col-span-7 dashboard-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">
                Lead List Management
              </h2>
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
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/60 transition"
                      >
                        <td className="py-3 font-semibold text-slate-800">
                          {item.source}
                        </td>
                        <td className="py-3">
                          {item.status === "Imported" ? (
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
                          <div className="flex items-center justify-end">
                            {/* View Button -> Opens Lead Info Popup */}
                            <button
                              onClick={() => setSelectedLeadInfo(item)}
                              className="px-3.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition cursor-pointer flex items-center gap-1"
                              title="View lead batch details"
                            >
                              <Eye className="w-3.5 h-3.5 text-slate-500" />
                              <span>View</span>
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
            <span>
              Note: Leads are automatically deleted on campaign completion for
              privacy.
            </span>
          </div>
        </div>

        {/* Recent Activity Feed WITH WORKING FILTER 3 */}
        <div className="lg:col-span-5 dashboard-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800">
                Recent Activity Feed
              </h2>
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
                  <div
                    key={act.id}
                    className="flex items-start justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <PhoneCall className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          {act.title}
                        </p>
                        <p className="text-xs font-medium mt-0.5 text-slate-600">
                          Result:{" "}
                          <span
                            className={
                              act.result === "Connected"
                                ? "text-blue-600 font-bold"
                                : act.result === "Qualified"
                                  ? "text-emerald-600 font-bold"
                                  : "text-orange-500 font-bold"
                            }
                          >
                            {act.result}
                          </span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {act.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 font-medium">
                  No activity logs matching result{" "}
                  <strong>"{activityResultFilter}"</strong>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LEAD INFO POPUP MODAL (ON CLICKING VIEW) */}
      {selectedLeadInfo && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-100" />
                <div>
                  <h3 className="font-bold text-base leading-tight">
                    Lead Batch Information
                  </h3>
                  <p className="text-[11px] text-blue-100">
                    Source: {selectedLeadInfo.source}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLeadInfo(null)}
                className="text-white/80 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium text-slate-500">Lead Source Name:</span>
                  <span className="font-bold text-slate-900">
                    {selectedLeadInfo.source}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium text-slate-500">Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedLeadInfo.status === "Imported"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {selectedLeadInfo.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium text-slate-500">CSV File Name:</span>
                  <span className="font-mono text-slate-800">
                    {selectedLeadInfo.fileName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium text-slate-500">Total Contacts:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {selectedLeadInfo.totalCount?.toLocaleString()} Leads
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium text-slate-500">Assigned AI Agent:</span>
                  <span className="font-semibold text-blue-600">
                    {selectedLeadInfo.agentAssigned}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-medium text-slate-500">Import Date:</span>
                  <span className="text-slate-600">{selectedLeadInfo.importDate}</span>
                </div>
              </div>

              {/* Data Retention Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Privacy Rule:</strong> {selectedLeadInfo.retention}. Contact logs will be automatically erased once campaign finishes.
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setSelectedLeadInfo(null)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-xs"
              >
                Close Information
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
