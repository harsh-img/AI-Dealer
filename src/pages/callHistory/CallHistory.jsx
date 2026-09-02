import React, { useState } from 'react'
import callHistoryData from '../../data/callHistory.json'
import DataTable from '../../components/common/DataTable'

const getInterestBadge = (interest) => {
  switch (interest?.toLowerCase()) {
    case 'interested':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
          Interested
        </span>
      )
    case 'not interested':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-800">
          Not Interested
        </span>
      )
    case 'unknown':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
          Unknown
        </span>
      )
  }
}

const CallHistory = () => {
  const [calls] = useState(callHistoryData.calls || [])

  const campaignOptions = [
    { label: 'All Campaigns', value: 'all' },
    ...(callHistoryData.campaignOptions || []).map((c) => ({
      label: c,
      value: c,
    })),
  ]

  // Columns definition for DataTable
  const columns = [
    {
      key: 'leadName',
      label: 'Lead Name',
      render: (val) => (
        <span className="font-bold text-slate-900">
          {val}
        </span>
      ),
    },
    {
      key: 'phone',
      label: 'Phone Number',
      render: (val) => (
        <span className="font-mono text-slate-700 text-xs">{val}</span>
      ),
    },
    {
      key: 'campaign',
      label: 'Campaign',
      render: (val) => (
        <span className="text-slate-800 font-medium line-clamp-1 max-w-xs" title={val}>
          {val}
        </span>
      ),
    },
    {
      key: 'interest',
      label: 'Interest',
      render: (val) => getInterestBadge(val),
    },
    {
      key: 'dateTime',
      label: 'Date & Time',
      render: (val) => (
        <span className="text-slate-500 whitespace-nowrap text-xs">{val}</span>
      ),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      <DataTable
        title="Call History Logs"
        data={calls}
        columns={columns}
        searchKeys={['leadName', 'phone', 'campaign', 'interest']}
        searchPlaceholder="Search by lead name, phone number, campaign..."
        statusFilter={{
          label: 'INTEREST',
          key: 'interest',
          options: (callHistoryData.interestOptions || []).map((i) => ({
            label: i,
            value: i,
          })),
        }}
        dropdownFilter={{
          label: 'CAMPAIGN',
          key: 'campaign',
          options: campaignOptions,
        }}
        showDateFilter={true}
        showExport={false}
        emptyState="No Call Records Found"
        pagination={{
          pageSize: 10,
        }}
      />
    </div>
  )
}

export default CallHistory
