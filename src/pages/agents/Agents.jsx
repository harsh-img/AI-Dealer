import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import agentsData from "../../data/agents.json";
import DataTable from "../../components/common/DataTable";
import ActionMenu from "../../components/common/ActionMenu";
import ConfirmationModal from "../../components/common/ConfirmationModal";

const getStatusBadge = (status) => {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
      Inactive
    </span>
  );
};

const Agents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState(agentsData.agents || []);
  const [agentToDelete, setAgentToDelete] = useState(null);

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (!agentToDelete) return;
    setAgents((prev) => prev.filter((a) => a.id !== agentToDelete.id));
    setAgentToDelete(null);
  };

  // DataTable columns definition (NakshatraLive format)
  const columns = [
    {
      key: "name",
      label: "Agent Name",
      render: (val, row) => (
        <Link
          to={`/agents/${row.id}`}
          className="font-bold text-slate-900 hover:text-indigo-600 transition"
        >
          {val}
        </Link>
      ),
    },
    {
      key: "voice",
      label: "Voice",
      render: (val) => (
        <span className="font-medium text-slate-800">{val}</span>
      ),
    },
    {
      key: "gender",
      label: "Gender",
      render: (val) => (
        <span className="text-slate-600 font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-[11px]">
          {val}
        </span>
      ),
    },
    {
      key: "language",
      label: "Language",
      render: (val) => (
        <span className="text-slate-700 font-medium">{val}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => getStatusBadge(val),
    },
    {
      key: "createdAt",
      label: "Created Date",
      render: (val) => <span className="text-slate-500">{val}</span>,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* 2. Reusable NakshatraLive DataTable */}
      <DataTable
        title="Agent Directory"
        data={agents}
        columns={columns}
        statusFilter={{
          label: "STATUS",
          key: "status",
          options: [
            { label: "Active", value: "Active" },
            { label: "Inactive", value: "Inactive" },
          ],
        }}
        genderFilter={{
          label: "GENDER",
          key: "gender",
          options: ["Female", "Male", "Neutral"],
        }}
        showExport={true}
        exportFileName="ai-agents"
        toolbarSlot={
          <Link
            to="/agents/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition cursor-pointer"
          >
            <span>+ Add AI Agent</span>
          </Link>
        }
        actions={(row) => (
          <ActionMenu
            items={[
              {
                label: 'View Details',
                icon: (
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
                onClick: () => navigate(`/agents/${row.id}`),
              },
              {
                label: 'Edit Agent',
                icon: (
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                onClick: () => navigate(`/agents/${row.id}/edit`),
              },
              {
                label: 'Delete Agent',
                danger: true,
                icon: (
                  <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                ),
                onClick: () => setAgentToDelete(row),
              },
            ]}
          />
        )}
        emptyState="No AI Agents Found"
        pagination={{
          pageSize: 10,
        }}
      />

      {/* Reusable Delete Confirmation Modal */}
      <ConfirmationModal
        open={Boolean(agentToDelete)}
        onClose={() => setAgentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete AI Agent"
        message={
          <>
            Are you sure you want to delete{' '}
            <strong className="text-slate-800 font-semibold">"{agentToDelete?.name}"</strong>?
            This will remove the agent persona from active campaign options.
          </>
        }
        confirmText="Yes, Delete Agent"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Agents;
