import React from 'react'
import { Link } from 'react-router-dom'
import CampaignForm from '../../components/campaigns/CampaignForm'

const CreateCampaign = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 pb-10">
      {/* Header & Breadcrumb */}
      <div className="space-y-2 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link to="/campaigns" className="hover:text-indigo-600 transition">
            Campaigns
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">Create New Campaign</span>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Create Campaign
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Set up a new AI voice campaign, assign an AI agent persona, upload leads CSV, and configure calling hours.
          </p>
        </div>
      </div>

      {/* Unified Form */}
      <CampaignForm isEdit={false} />
    </div>
  )
}

export default CreateCampaign
