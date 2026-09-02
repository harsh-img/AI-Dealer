import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import agentsData from '../../data/agents.json'

const CampaignForm = ({ initialValues, isEdit = false }) => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const agents = agentsData.agents || []

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(3, 'Campaign name must be at least 3 characters')
      .required('Campaign name is required'),
    agentId: Yup.string().required('Please select an AI Agent persona'),
    startTime: Yup.string().required('Calling start time is required'),
    endTime: Yup.string().required('Calling end time is required'),
    maxAttempts: Yup.number()
      .min(1, 'Minimum 1 attempt required')
      .max(10, 'Maximum 10 attempts allowed')
      .required('Maximum attempts is required'),
    csvFileName: Yup.string().when([], {
      is: () => !isEdit,
      then: (schema) => schema.required('Please select a leads CSV file for the campaign'),
      otherwise: (schema) => schema.optional(),
    }),
  })

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || '',
      agentId: initialValues?.agentId || (agents[0]?.id || ''),
      startTime: initialValues?.startTime || '09:00',
      endTime: initialValues?.endTime || '18:00',
      maxAttempts: initialValues?.maxAttempts || 3,
      csvFileName: initialValues?.csvFileName || '',
      totalLeads: initialValues?.totalLeads || 1000,
      status: initialValues?.status || 'Scheduled',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      // Find selected agent's name
      const selectedAgent = agents.find((a) => String(a.id) === String(values.agentId))
      const agentName = selectedAgent ? selectedAgent.name : 'AI Agent'

      console.log(isEdit ? 'Updated campaign data:' : 'Created campaign data:', {
        ...values,
        agentName,
      })

      if (isEdit && initialValues?.id) {
        navigate(`/campaigns/${initialValues.id}`)
      } else {
        navigate('/campaigns')
      }
    },
  })

  // Handle local CSV file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      formik.setFieldValue('csvFileName', file.name)
      // Estimate dummy leads count based on file size or default
      if (!isEdit) {
        const estimatedCount = Math.max(250, Math.min(10000, Math.round(file.size / 45)))
        formik.setFieldValue('totalLeads', estimatedCount || 1000)
      }
    }
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Campaign Basics Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Campaign Details</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure the campaign identifier, assigned AI voice agent, and outreach parameters.
          </p>
        </div>

        <div className="space-y-5">
          {/* Campaign Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Campaign Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g. Q1 SaaS Outbound Outreach"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                formik.touched.name && formik.errors.name
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.name}</p>
            )}
          </div>

          {/* AI Agent Selection */}
          <div>
            <label htmlFor="agentId" className="block text-xs font-semibold text-slate-700 mb-1.5">
              AI Voice Agent <span className="text-rose-500">*</span>
            </label>
            <select
              id="agentId"
              name="agentId"
              value={formik.values.agentId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 cursor-pointer ${
                formik.touched.agentId && formik.errors.agentId
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            >
              <option value="" disabled>
                Select an AI Agent
              </option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name} — {agent.voice} ({agent.language})
                </option>
              ))}
            </select>
            {formik.touched.agentId && formik.errors.agentId ? (
              <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.agentId}</p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                The agent persona handles all outbound calls, responses, and live escalations for this campaign.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Leads CSV Upload Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Leads Contact List</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload contact phone numbers and custom metadata via CSV spreadsheet.
            </p>
          </div>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
            Frontend Only
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Upload Leads CSV {!isEdit && <span className="text-rose-500">*</span>}
          </label>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileChange}
            className="hidden"
            id="leadsCsvUpload"
          />

          {/* Custom Upload Drop Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition hover:bg-slate-50/70 flex flex-col items-center justify-center ${
              formik.touched.csvFileName && formik.errors.csvFileName
                ? 'border-rose-300 bg-rose-50/20'
                : formik.values.csvFileName
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-slate-300 bg-slate-50/40'
            }`}
          >
            {formik.values.csvFileName ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{formik.values.csvFileName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formik.values.totalLeads?.toLocaleString()} leads detected • Click to replace file
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-2xs">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    <span className="text-indigo-600 hover:underline">Click to browse</span> or drag and drop CSV
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports .CSV files with name, phone, email columns (Max 10MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {formik.touched.csvFileName && formik.errors.csvFileName && (
            <p className="mt-1.5 text-xs text-rose-500 font-medium">{formik.errors.csvFileName}</p>
          )}
        </div>
      </div>

      {/* 3. Operational Settings Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Calling Hours & Schedule</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define compliance calling windows and retry attempt frequency.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Calling Start Time */}
          <div>
            <label htmlFor="startTime" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Calling Start Time <span className="text-rose-500">*</span>
            </label>
            <input
              id="startTime"
              type="time"
              name="startTime"
              value={formik.values.startTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 ${
                formik.touched.startTime && formik.errors.startTime
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {formik.touched.startTime && formik.errors.startTime && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.startTime}</p>
            )}
          </div>

          {/* Calling End Time */}
          <div>
            <label htmlFor="endTime" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Calling End Time <span className="text-rose-500">*</span>
            </label>
            <input
              id="endTime"
              type="time"
              name="endTime"
              value={formik.values.endTime}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 ${
                formik.touched.endTime && formik.errors.endTime
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {formik.touched.endTime && formik.errors.endTime && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.endTime}</p>
            )}
          </div>

          {/* Maximum Call Attempts */}
          <div className="sm:col-span-2">
            <label htmlFor="maxAttempts" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Maximum Call Attempts Per Lead <span className="text-rose-500">*</span>
            </label>
            <select
              id="maxAttempts"
              name="maxAttempts"
              value={formik.values.maxAttempts}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 cursor-pointer ${
                formik.touched.maxAttempts && formik.errors.maxAttempts
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            >
              <option value="1">1 Attempt (No retries on unanswered calls)</option>
              <option value="2">2 Attempts</option>
              <option value="3">3 Attempts (Standard Recommended)</option>
              <option value="4">4 Attempts</option>
              <option value="5">5 Attempts</option>
            </select>
            {formik.touched.maxAttempts && formik.errors.maxAttempts && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.maxAttempts}</p>
            )}
            <p className="mt-1 text-[11px] text-slate-400">
              The dialer will retry busy or unanswered numbers up to this count across scheduled calling hours.
            </p>
          </div>
        </div>
      </div>

      {/* Form Submission Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/campaigns')}
          className="px-5 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-indigo-600/20 transition cursor-pointer disabled:opacity-70"
        >
          <span>{isEdit ? 'Save Changes' : 'Create Campaign'}</span>
        </button>
      </div>
    </form>
  )
}

export default CampaignForm
