import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import liveAgentsData from '../../data/liveAgents.json'

const LiveAgentForm = ({ initialValues, isEdit = false }) => {
  const navigate = useNavigate()
  const statuses = liveAgentsData.statuses || ['Available', 'Busy', 'Offline']

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .min(2, 'Agent Name must be at least 2 characters')
      .required('Agent Name is required'),
    phone: Yup.string()
      .trim()
      .required('Phone Number is required'),
    email: Yup.string()
      .trim()
      .email('Please enter a valid email address')
      .required('Email address is required'),
    status: Yup.string()
      .oneOf(statuses, 'Please select a valid status')
      .required('Status is required'),
    weight: Yup.number()
      .typeError('Weight must be a number')
      .min(1, 'Minimum weight is 1')
      .max(100, 'Maximum weight is 100')
      .required('Weight is required'),
  })

  // Formik Hook
  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || '',
      phone: initialValues?.phone || '',
      email: initialValues?.email || '',
      status: initialValues?.status || 'Available',
      weight: initialValues?.weight !== undefined ? initialValues.weight : 5,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      console.log(isEdit ? 'Updated Live Agent data:' : 'Created Live Agent data:', {
        ...values,
        weight: Number(values.weight),
      })

      if (isEdit && initialValues?.id) {
        navigate(`/live-agents/${initialValues.id}`)
      } else {
        navigate('/live-agents')
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Agent Profile Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Live Agent Profile</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure contact details and call transfer priority for this human agent.
          </p>
        </div>

        <div className="space-y-4">
          {/* Agent Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Agent Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g. Rohan Sharma"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="e.g. +1 (555) 234-5678"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                  formik.touched.phone && formik.errors.phone
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.phone}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="e.g. rohan.sharma@aidialer.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                  formik.touched.email && formik.errors.email
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.email}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Routing & Status Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Availability & Routing Weight</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Define call transfer availability status and transfer distribution weighting.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Status <span className="text-rose-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 cursor-pointer ${
                formik.touched.status && formik.errors.status
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            >
              <option value="Available">Available (Ready for call transfers)</option>
              <option value="Busy">Busy (Currently on a call / occupied)</option>
              <option value="Offline">Offline (Unavailable for transfer)</option>
            </select>
            {formik.touched.status && formik.errors.status && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.status}</p>
            )}
          </div>

          {/* Weight */}
          <div>
            <label htmlFor="weight" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Routing Weight (1 - 100) <span className="text-rose-500">*</span>
            </label>
            <input
              id="weight"
              type="number"
              name="weight"
              min="1"
              max="100"
              placeholder="e.g. 5"
              value={formik.values.weight}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 ${
                formik.touched.weight && formik.errors.weight
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {formik.touched.weight && formik.errors.weight ? (
              <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.weight}</p>
            ) : (
              <p className="mt-1 text-[11px] text-slate-400">
                Higher weight assigns a greater percentage of live transfers to this agent.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form Submission Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/live-agents')}
          className="px-5 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-indigo-600/20 transition cursor-pointer disabled:opacity-70"
        >
          <span>{isEdit ? 'Save Changes' : 'Add Live Agent'}</span>
        </button>
      </div>
    </form>
  )
}

export default LiveAgentForm
