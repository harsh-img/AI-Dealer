import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import initialSettings from '../../data/settings.json'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [successMessage, setSuccessMessage] = useState('')

  const showSuccess = (msg) => {
    setSuccessMessage(msg)
    setTimeout(() => {
      setSuccessMessage('')
    }, 3500)
  }

  // 1. General Settings Formik
  const generalFormik = useFormik({
    initialValues: {
      companyName: initialSettings.general?.companyName || '',
      email: initialSettings.general?.email || '',
      phone: initialSettings.general?.phone || '',
    },
    validationSchema: Yup.object({
      companyName: Yup.string()
        .trim()
        .min(2, 'Company Name must be at least 2 characters')
        .required('Company Name is required'),
      email: Yup.string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email address is required'),
      phone: Yup.string()
        .trim()
        .required('Phone Number is required'),
    }),
    onSubmit: (values) => {
      console.log('Saved General Settings:', values)
      showSuccess('General settings updated successfully!')
    },
  })

  // 2. Calling Settings Formik
  const callingFormik = useFormik({
    initialValues: {
      defaultStartTime: initialSettings.calling?.defaultStartTime || '09:00',
      defaultEndTime: initialSettings.calling?.defaultEndTime || '18:00',
      defaultMaxAttempts: initialSettings.calling?.defaultMaxAttempts || 3,
      defaultConcurrency: initialSettings.calling?.defaultConcurrency || 10,
    },
    validationSchema: Yup.object({
      defaultStartTime: Yup.string().required('Default start time is required'),
      defaultEndTime: Yup.string().required('Default end time is required'),
      defaultMaxAttempts: Yup.number()
        .min(1, 'Minimum 1 attempt')
        .max(10, 'Maximum 10 attempts')
        .required('Maximum attempts is required'),
      defaultConcurrency: Yup.number()
        .min(1, 'Minimum 1 concurrent line')
        .max(100, 'Maximum 100 concurrent lines')
        .required('Concurrency is required'),
    }),
    onSubmit: (values) => {
      console.log('Saved Calling Settings:', values)
      showSuccess('Default calling settings saved successfully!')
    },
  })

  // 3. Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNotifications: initialSettings.notifications?.emailNotifications ?? true,
    campaignCompleted: initialSettings.notifications?.campaignCompleted ?? true,
    lowWalletBalance: initialSettings.notifications?.lowWalletBalance ?? true,
    callTransfer: initialSettings.notifications?.callTransfer ?? false,
  })

  const handleToggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSaveNotifications = (e) => {
    e.preventDefault()
    console.log('Saved Notification Settings:', notifications)
    showSuccess('Notification preferences saved successfully!')
  }

  const tabs = [
    {
      id: 'general',
      label: 'General Settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: 'calling',
      label: 'Calling Settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
  ]

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 pb-10">
      {/* 1. Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Account & Portal Settings
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Manage workspace profile information, default dialer parameters, and alert notifications.
        </p>
      </div>

      {/* Success Alert Banner */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs font-semibold text-emerald-800 animate-in fade-in duration-200 shadow-2xs">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'border-indigo-600 text-indigo-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 3. Tab Contents */}

      {/* TAB 1: General Settings */}
      {activeTab === 'general' && (
        <form onSubmit={generalFormik.handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Organization Information</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your business contact and organization identity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Company Name */}
              <div className="sm:col-span-2">
                <label htmlFor="companyName" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  name="companyName"
                  placeholder="e.g. Acme AI Corp"
                  value={generalFormik.values.companyName}
                  onChange={generalFormik.handleChange}
                  onBlur={generalFormik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                    generalFormik.touched.companyName && generalFormik.errors.companyName
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {generalFormik.touched.companyName && generalFormik.errors.companyName && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{generalFormik.errors.companyName}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Primary Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@company.com"
                  value={generalFormik.values.email}
                  onChange={generalFormik.handleChange}
                  onBlur={generalFormik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                    generalFormik.touched.email && generalFormik.errors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {generalFormik.touched.email && generalFormik.errors.email && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{generalFormik.errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contact Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={generalFormik.values.phone}
                  onChange={generalFormik.handleChange}
                  onBlur={generalFormik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                    generalFormik.touched.phone && generalFormik.errors.phone
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {generalFormik.touched.phone && generalFormik.errors.phone && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{generalFormik.errors.phone}</p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={generalFormik.isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: Calling Settings */}
      {activeTab === 'calling' && (
        <form onSubmit={callingFormik.handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Default Dialer Settings</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Set global defaults for new campaigns, calling windows, and line concurrency.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Default Start Time */}
              <div>
                <label htmlFor="defaultStartTime" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Calling Start Time <span className="text-rose-500">*</span>
                </label>
                <input
                  id="defaultStartTime"
                  type="time"
                  name="defaultStartTime"
                  value={callingFormik.values.defaultStartTime}
                  onChange={callingFormik.handleChange}
                  onBlur={callingFormik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 ${
                    callingFormik.touched.defaultStartTime && callingFormik.errors.defaultStartTime
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {callingFormik.touched.defaultStartTime && callingFormik.errors.defaultStartTime && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{callingFormik.errors.defaultStartTime}</p>
                )}
              </div>

              {/* Default End Time */}
              <div>
                <label htmlFor="defaultEndTime" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Calling End Time <span className="text-rose-500">*</span>
                </label>
                <input
                  id="defaultEndTime"
                  type="time"
                  name="defaultEndTime"
                  value={callingFormik.values.defaultEndTime}
                  onChange={callingFormik.handleChange}
                  onBlur={callingFormik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 ${
                    callingFormik.touched.defaultEndTime && callingFormik.errors.defaultEndTime
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {callingFormik.touched.defaultEndTime && callingFormik.errors.defaultEndTime && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{callingFormik.errors.defaultEndTime}</p>
                )}
              </div>

              {/* Default Max Attempts */}
              <div>
                <label htmlFor="defaultMaxAttempts" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Maximum Call Attempts <span className="text-rose-500">*</span>
                </label>
                <select
                  id="defaultMaxAttempts"
                  name="defaultMaxAttempts"
                  value={callingFormik.values.defaultMaxAttempts}
                  onChange={callingFormik.handleChange}
                  onBlur={callingFormik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 cursor-pointer ${
                    callingFormik.touched.defaultMaxAttempts && callingFormik.errors.defaultMaxAttempts
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                >
                  <option value="1">1 Attempt</option>
                  <option value="2">2 Attempts</option>
                  <option value="3">3 Attempts (Standard)</option>
                  <option value="4">4 Attempts</option>
                  <option value="5">5 Attempts</option>
                </select>
                {callingFormik.touched.defaultMaxAttempts && callingFormik.errors.defaultMaxAttempts && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{callingFormik.errors.defaultMaxAttempts}</p>
                )}
              </div>

              {/* Default Call Concurrency */}
              <div>
                <label htmlFor="defaultConcurrency" className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Default Call Concurrency (Active Lines) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="defaultConcurrency"
                  type="number"
                  name="defaultConcurrency"
                  min="1"
                  max="100"
                  value={callingFormik.values.defaultConcurrency}
                  onChange={callingFormik.handleChange}
                  onBlur={callingFormik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 bg-white transition focus:outline-none focus:ring-2 ${
                    callingFormik.touched.defaultConcurrency && callingFormik.errors.defaultConcurrency
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {callingFormik.touched.defaultConcurrency && callingFormik.errors.defaultConcurrency ? (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{callingFormik.errors.defaultConcurrency}</p>
                ) : (
                  <p className="mt-1 text-[11px] text-slate-400">
                    Simultaneous parallel calls made per active campaign.
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={callingFormik.isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: Notifications */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Notification Preferences</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose which system events and balance alerts trigger email notifications.
              </p>
            </div>

            <div className="space-y-4 divide-y divide-slate-100">
              {/* Toggle 1: Email Notifications */}
              <div className="flex items-center justify-between pt-3 first:pt-0">
                <div className="space-y-0.5 pr-4">
                  <span className="text-sm font-bold text-slate-900 block">
                    Email Notifications
                  </span>
                  <p className="text-xs text-slate-500">
                    Receive operational updates and daily summary digests via email.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.emailNotifications ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifications.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2: Campaign Completed */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 pr-4">
                  <span className="text-sm font-bold text-slate-900 block">
                    Campaign Completed
                  </span>
                  <p className="text-xs text-slate-500">
                    Send notification when an automated calling campaign finishes dialing all leads.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('campaignCompleted')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.campaignCompleted ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifications.campaignCompleted ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3: Low Wallet Balance */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 pr-4">
                  <span className="text-sm font-bold text-slate-900 block">
                    Low Wallet Balance Alert
                  </span>
                  <p className="text-xs text-slate-500">
                    Alert when remaining wallet credits drop below ₹1,000 threshold.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('lowWalletBalance')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.lowWalletBalance ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifications.lowWalletBalance ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 4: Call Transfer Notifications */}
              <div className="flex items-center justify-between pt-4">
                <div className="space-y-0.5 pr-4">
                  <span className="text-sm font-bold text-slate-900 block">
                    Call Transfer Notifications
                  </span>
                  <p className="text-xs text-slate-500">
                    Alert whenever AI voice transfers a qualified lead to a human live agent.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification('callTransfer')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    notifications.callTransfer ? 'bg-indigo-600' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      notifications.callTransfer ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}

export default Settings
