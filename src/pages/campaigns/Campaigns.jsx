import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import campaignsData from '../../data/campaigns.json'
import DataTable from '../../components/common/DataTable'
import ActionMenu from '../../components/common/ActionMenu'

const getStatusBadge = (status) => {
  switch (status?.toLowerCase()) {
    case 'running':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Running
        </span>
      )
    case 'paused':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Paused
        </span>
      )
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Completed
        </span>
      )
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Scheduled
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {status}
        </span>
      )
  }
}

const Campaigns = () => {
  const navigate = useNavigate()
  const [campaigns, setCampaigns] = useState(campaignsData.campaigns || [])

  // Columns definition for DataTable
  const columns = [
    {
      key: 'name',
      label: 'Campaign Name',
      render: (val, row) => (
        <Link
          to={`/campaigns/${row.id}`}
          className="font-bold text-slate-900 hover:text-indigo-600 transition"
        >
          {val}
        </Link>
      ),
    },
    {
      key: 'agentName',
      label: 'AI Agent',
      render: (val) => (
        <span className="font-medium text-slate-800">{val}</span>
      ),
    },
    {
      key: 'totalLeads',
      label: 'Total Leads',
      render: (val) => (
        <span className="text-slate-700 font-medium">
          {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'callsMade',
      label: 'Calls Made',
      render: (val) => (
        <span className="text-slate-700 font-medium">
          {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'answeredCalls',
      label: 'Answered',
      render: (val) => (
        <span className="text-emerald-700 font-semibold">
          {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'transferredCalls',
      label: 'Transferred',
      render: (val) => (
        <span className="text-indigo-700 font-semibold">
          {Number(val || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => getStatusBadge(val),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <DataTable
        title="Active & Scheduled Campaigns"
        data={campaigns}
        columns={columns}
        searchKeys={['name', 'agentName', 'status']}
        searchPlaceholder="Search by campaign name or agent..."
        statusFilter={{
          label: 'STATUS',
          key: 'status',
          options: [
            { label: 'Running', value: 'Running' },
            { label: 'Scheduled', value: 'Scheduled' },
            { label: 'Paused', value: 'Paused' },
            { label: 'Completed', value: 'Completed' },
          ],
        }}
        showExport={true}
        exportFileName="ai-campaigns"
        toolbarSlot={
          <Link
            to="/campaigns/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition cursor-pointer"
          >
            <span>+ Create Campaign</span>
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
                onClick: () => navigate(`/campaigns/${row.id}`),
              },
              {
                label: 'Edit Campaign',
                icon: (
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                onClick: () => navigate(`/campaigns/${row.id}/edit`),
              },
            ]}
          />
        )}
        emptyState="No Campaigns Found"
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  )
}

export default Campaigns
