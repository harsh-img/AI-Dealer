import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  Plus,
  Send,
  Trash2,
  CheckCircle,
  ShieldCheck,
  Sliders,
  Users,
  Check,
  X,
  MessageSquare,
} from "lucide-react";

const Campaigns = () => {
  const { campaigns, finishCampaign, liveAgents, distributeCampaignCalls } =
    useApp();

  // State for Call Distribution Modal
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [distributeMode, setDistributeMode] = useState("weighted");
  const [weightsMap, setWeightsMap] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // State for Finished Telegram Notification Modal
  const [finishedModalData, setFinishedModalData] = useState(null);

  const handleOpenDistributeModal = (camp) => {
    setSelectedCampaign(camp);
    setDistributeMode(camp.distribution || "weighted");

    // Initialize transfer weights map
    const initialMap = {};
    liveAgents.forEach((ag) => {
      initialMap[ag.id] = camp.transferWeights?.[ag.id] ?? ag.weight ?? 30;
    });
    setWeightsMap(initialMap);
    setSaveSuccess(false);
    setShowDistributeModal(true);
  };

  const handleWeightChange = (agId, val) => {
    setWeightsMap((prev) => ({
      ...prev,
      [agId]: Number(val),
    }));
  };

  const handleSaveDistribution = (e) => {
    e.preventDefault();
    if (!selectedCampaign) return;

    distributeCampaignCalls(selectedCampaign.id, distributeMode, weightsMap);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowDistributeModal(false);
    }, 1200);
  };

  const handleFinish = (camp) => {
    finishCampaign(camp.id);
    setFinishedModalData({
      campaignName: camp.name,
      leadsCount: camp.leadsCount || 1248,
      connected: Math.floor((camp.leadsCount || 1248) * 0.42),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campaign Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage calling hours, agent distribution, and track campaigns.
          </p>
        </div>
        <Link
          to="/campaigns/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Campaign</span>
        </Link>
      </div>

      {/* Campaigns Table */}
      <div className="dashboard-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-base">All Campaigns</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="p-3.5">Campaign Name</th>
                <th className="p-3.5">AI Agent</th>
                <th className="p-3.5">Calling Hours</th>
                <th className="p-3.5">Distribution Mode</th>
                <th className="p-3.5">Leads Status</th>
                <th className="p-3.5">Telegram</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5 font-bold text-slate-900">
                    {camp.name}
                  </td>
                  <td className="p-3.5 font-medium text-slate-800">
                    {camp.agentName}
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">
                    {camp.callingHours?.start} - {camp.callingHours?.end} (
                    {camp.callingHours?.timezone})
                  </td>
                  <td className="p-3.5 font-semibold capitalize text-blue-700">
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-[11px]">
                      {camp.distribution || "weighted"}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {camp.leadsDeleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-[11px] font-semibold border border-slate-200">
                        <Trash2 className="w-3 h-3 text-slate-400" />
                        Auto-Purged
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-[11px] font-semibold">
                        {camp.leadsCount?.toLocaleString()} Active Leads
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {camp.telegram?.enabled ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                        <Send className="w-3.5 h-3.5" />
                        Enabled
                      </span>
                    ) : (
                      <span className="text-slate-400">Off</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    {camp.status === "Running" ? (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-100 text-emerald-700 border border-emerald-200 animate-pulse">
                        Running
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        Completed
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Post-Creation Call Distribution Option */}
                      <button
                        onClick={() => handleOpenDistributeModal(camp)}
                        className="px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] border border-blue-200 flex items-center gap-1 cursor-pointer transition"
                        title="Configure post-creation call distribution between agents"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Distribute Calls</span>
                      </button>

                      {camp.status === "Running" && (
                        <button
                          onClick={() => handleFinish(camp)}
                          className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-xs flex items-center gap-1 cursor-pointer transition"
                          title="Finish campaign and send report to Telegram"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Finish</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: TELEGRAM REPORT SENT POPUP */}
      {finishedModalData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center relative">
              <button
                onClick={() => setFinishedModalData(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-lg font-bold cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Send className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg">Campaign Report Sent!</h3>
              <p className="text-xs text-blue-100 mt-1">
                The campaign final report has been successfully sent to your
                Telegram.
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium text-slate-500">Campaign:</span>
                  <span className="font-bold text-slate-900">
                    {finishedModalData.campaignName}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium text-slate-500">
                    Total Dialed:
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {finishedModalData.leadsCount?.toLocaleString()} Leads
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-medium text-slate-500">
                    Connected Calls:
                  </span>
                  <span className="font-mono font-bold text-emerald-600">
                    {finishedModalData.connected?.toLocaleString()} (42%)
                  </span>
                </div>
                <div className="flex justify-between text-slate-700 border-t border-blue-200/60 pt-2">
                  <span className="font-medium text-slate-500">
                    Telegram Channel:
                  </span>
                  <span className="font-semibold text-blue-600 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Delivered
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px] flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Privacy Notice:</strong> Contact logs have been
                  automatically purged upon campaign completion.
                </p>
              </div>

              <button
                onClick={() => setFinishedModalData(null)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition cursor-pointer shadow-sm shadow-blue-600/20"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALL DISTRIBUTION MODAL FOR POST-CREATION */}
      {showDistributeModal && selectedCampaign && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  Post-Creation Call Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Campaign:{" "}
                  <strong className="text-slate-800">
                    {selectedCampaign.name}
                  </strong>
                </p>
              </div>
              <button
                onClick={() => setShowDistributeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveDistribution} className="space-y-4">
              {/* Distribution Mode Choice */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Choose How Calls Distributed Between Agents
                </label>
                <select
                  value={distributeMode}
                  onChange={(e) => setDistributeMode(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="shuffle">
                    Shuffle (Random distribution between agents)
                  </option>
                  <option value="all_together">
                    All Together (Simultaneous blast calling)
                  </option>
                  <option value="weighted">
                    Weighted Round-Robin (Distributed by routing weights)
                  </option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowDistributeModal(false)}
                  className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Calls Distributed!</span>
                    </>
                  ) : (
                    <>
                      <Sliders className="w-4 h-4" />
                      <span>Apply & Distribute Calls</span>
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

export default Campaigns;
