import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // 1. Wallet & VOIP State
  const [wallet, setWallet] = useState({
    balance: 1250.0,
    voipBalance: 450.0,
    ratePerMin: 0.015,
    transactions: [
      {
        id: "tx-1",
        type: "Credit",
        amount: 500.0,
        description: "Self Top-Up (Card ****4242)",
        date: "2026-03-01 14:20",
      },
      {
        id: "tx-2",
        type: "Transfer",
        amount: 250.0,
        description: "Trunk Allocation",
        date: "2026-03-02 09:15",
      },
    ],
  });

  // 2. AI Agents State
  const [aiAgents, setAiAgents] = useState([
    {
      id: "agent-1",
      name: "Sarah (Tech Sales AI)",
      prompt:
        "You are Sarah, a warm and professional outbound SDR for SaaS products. Qualify prospects by asking about team size and current workflow friction.",
      gender: "Female",
      language: "English (US)",
      accent: "Neutral Professional",
      speed: 1.0,
      concurrency: 15,
      activeCalls: 3,
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "agent-2",
      name: "David (Property Specialist)",
      prompt:
        "You are David, an expert Real Estate qualifier. Ask prospects if they are looking to buy or sell within the next 90 days.",
      gender: "Male",
      language: "English (US)",
      accent: "Standard Male",
      speed: 1.05,
      concurrency: 10,
      activeCalls: 2,
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      id: "agent-3",
      name: "Frida Name",
      prompt:
        "You are Frida, an empathetic survey and marketing agent collecting user feedback for Q3 marketing leads.",
      gender: "Female",
      language: "Spanish",
      accent: "Castilian",
      speed: 0.95,
      concurrency: 8,
      activeCalls: 2,
      status: "Active",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  ]);

  // 3. Live Agents (Human transfer targets)
  const [liveAgents, setLiveAgents] = useState([
    {
      id: "live-1",
      name: "John Doe",
      phone: "+1 (555) 019-2834",
      extension: "101",
      department: "Sales",
      weight: 50,
      status: "Available",
      currentTransfers: 1,
    },
    {
      id: "live-2",
      name: "Emily Clark",
      phone: "+1 (555) 019-5821",
      extension: "102",
      department: "Real Estate",
      weight: 30,
      status: "In Call",
      currentTransfers: 1,
    },
    {
      id: "live-3",
      name: "Michael Scott",
      phone: "+1 (555) 019-9942",
      extension: "103",
      department: "Support",
      weight: 20,
      status: "Available",
      currentTransfers: 0,
    },
  ]);

  // 4. Campaigns State
  const [campaigns, setCampaigns] = useState([
    {
      id: "camp-1",
      name: "Marketing Leads Q3",
      agentId: "agent-1",
      agentName: "Sarah (Tech Sales AI)",
      leadsCount: 1248,
      dialedCount: 1248,
      status: "Running",
      callingHours: { start: "09:00", end: "18:00", timezone: "EST" },
      loopTimes: 2,
      distribution: "weighted", // shuffle, all_together, weighted
      telegram: {
        enabled: true,
        botToken: "bot123456:ABC-DEF...",
        chatId: "-1009876543",
      },
      autoDeleteLeads: true,
      transferWeights: { "live-1": 50, "live-2": 30, "live-3": 20 },
      createdAt: "2026-03-01",
    },
    {
      id: "camp-2",
      name: "Real Estate Outreach",
      agentId: "agent-2",
      agentName: "David (Property Specialist)",
      leadsCount: 850,
      dialedCount: 850,
      status: "Completed",
      callingHours: { start: "10:00", end: "17:00", timezone: "PST" },
      loopTimes: 1,
      distribution: "shuffle",
      telegram: {
        enabled: true,
        botToken: "bot123456:ABC-DEF...",
        chatId: "-1009876543",
      },
      autoDeleteLeads: true,
      leadsDeleted: true,
      transferWeights: { "live-1": 60, "live-2": 40 },
      createdAt: "2026-02-25",
    },
  ]);

  // 5. Live Call Status (Categorized by agentType)
  const [liveCalls, setLiveCalls] = useState([
    {
      id: "lc-1",
      agentName: "Marco John",
      agentType: "AI Agents",
      leadName: "Marketing Leads Q3",
      duration: "00:00:00",
      status: "Connected",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    },
    {
      id: "lc-2",
      agentName: "Nova (AI SDR)",
      agentType: "AI Agents",
      leadName: "Marketing Leads Q4",
      duration: "00:00:30",
      status: "Connected",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100",
    },
    {
      id: "lc-3",
      agentName: "John Doe",
      agentType: "Live Agents",
      leadName: "Real Estate Lead",
      duration: "00:02:34",
      status: "Voicemail",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    },
    {
      id: "lc-4",
      agentName: "Emily Clark",
      agentType: "Live Agents",
      leadName: "Inbound Client",
      duration: "00:01:12",
      status: "Connected",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
    },
  ]);

  // 6. Recent Activity Feed
  const [activityFeed, setActivityFeed] = useState([
    {
      id: "act-1",
      type: "call",
      title: "Call Mathnanma (328)",
      result: "Connected",
      time: "3 hours ago",
      statusColor: "green",
    },
    {
      id: "act-2",
      type: "call",
      title: "Call Mathnanma (42%)",
      result: "Qualified",
      time: "4 hours ago",
      statusColor: "emerald",
    },
    {
      id: "act-3",
      type: "call",
      title: "Call Duration (1:15)",
      result: "Voicemail",
      time: "3 hours ago",
      statusColor: "orange",
    },
    {
      id: "act-4",
      type: "call",
      title: "Call Tech Outreach (512)",
      result: "Connected",
      time: "5 hours ago",
      statusColor: "green",
    },
    {
      id: "act-5",
      type: "call",
      title: "Call Real Estate (210)",
      result: "Qualified",
      time: "6 hours ago",
      statusColor: "emerald",
    },
  ]);

  // 7. Telegram Notification Logs
  const [telegramLogs, setTelegramLogs] = useState([
    {
      id: "tg-1",
      campaignName: "Real Estate Outreach",
      sentAt: "2026-03-01 16:45",
      status: "Sent Successfully",
      messagePreview:
        "📊 *Campaign Finished Summary*\n• Name: Real Estate Outreach\n• Total Dialed: 850\n• Connected: 357 (42%)\n• Transferred: 48\n⚠️ *Privacy Notice*: Lead contact log auto-purged on completion.",
    },
  ]);

  // Actions
  const topUpWallet = (amount) => {
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance + Number(amount),
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: "Credit",
          amount: Number(amount),
          description: "Self Top-Up",
          date: new Date().toLocaleString(),
        },
        ...prev.transactions,
      ],
    }));
  };

  const transferToVoip = (amount) => {
    if (wallet.balance < amount) return false;
    setWallet((prev) => ({
      ...prev,
      balance: prev.balance - Number(amount),
      voipBalance: prev.voipBalance + Number(amount),
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: "Transfer to VOIP",
          amount: Number(amount),
          description: "VOIP Account Balance Top-Up",
          date: new Date().toLocaleString(),
        },
        ...prev.transactions,
      ],
    }));
    return true;
  };

  const addAiAgent = (newAgent) => {
    const created = {
      ...newAgent,
      id: `agent-${Date.now()}`,
      activeCalls: 0,
      status: newAgent.status || "Active",
      avatar:
        newAgent.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    };
    setAiAgents((prev) => [created, ...prev]);
    return created;
  };

  const deleteAiAgent = (agentId) => {
    setAiAgents((prev) => prev.filter((ag) => ag.id !== agentId));
  };

  const updateAiAgent = (agentId, updatedFields) => {
    setAiAgents((prev) =>
      prev.map((ag) => (ag.id === agentId ? { ...ag, ...updatedFields } : ag)),
    );
  };

  const createCampaign = (newCamp) => {
    const created = {
      ...newCamp,
      id: `camp-${Date.now()}`,
      status: "Running",
      dialedCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCampaigns((prev) => [created, ...prev]);
  };

  const distributeCampaignCalls = (
    campaignId,
    distributionMode,
    updatedTransferWeights,
  ) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campaignId) {
          return {
            ...c,
            distribution: distributionMode,
            transferWeights: {
              ...c.transferWeights,
              ...updatedTransferWeights,
            },
          };
        }
        return c;
      }),
    );
  };

  const finishCampaign = (campId) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campId) {
          const logEntry = {
            id: `tg-${Date.now()}`,
            campaignName: c.name,
            sentAt: new Date().toLocaleString(),
            status: c.telegram?.enabled
              ? "Sent Successfully"
              : "Disabled (Skipped)",
            messagePreview: `📊 *Campaign Finished Summary*\n• Name: ${c.name}\n• Total Dialed: ${c.leadsCount}\n• Connected: ${Math.floor(c.leadsCount * 0.42)} (42%)\n• Transferred: ${Math.floor(c.leadsCount * 0.08)}\n⚠️ *Privacy Notice*: Lead contact log auto-purged on completion.`,
          };
          setTelegramLogs((tg) => [logEntry, ...tg]);

          return {
            ...c,
            status: "Completed",
            leadsDeleted: c.autoDeleteLeads,
            dialedCount: c.leadsCount,
          };
        }
        return c;
      }),
    );
  };

  const updateLiveAgentWeights = (updatedAgents) => {
    setLiveAgents(updatedAgents);
  };

  return (
    <AppContext.Provider
      value={{
        wallet,
        topUpWallet,
        transferToVoip,
        aiAgents,
        addAiAgent,
        deleteAiAgent,
        updateAiAgent,
        liveAgents,
        updateLiveAgentWeights,
        setLiveAgents,
        campaigns,
        createCampaign,
        distributeCampaignCalls,
        finishCampaign,
        liveCalls,
        activityFeed,
        telegramLogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
