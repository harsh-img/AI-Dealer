import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import profileData from '../../data/profile.json'

const Profile = () => {
  const [profile, setProfile] = useState(profileData.profile || {})
  const [imagePreview, setImagePreview] = useState(profile.profileImage || null)
  const [successMessage, setSuccessMessage] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      formik.setFieldValue('profileImage', previewUrl)
    }
  }

  const formik = useFormik({
    initialValues: {
      name: profile.name || '',
      email: profile.email || '',
      mobile: profile.mobile || '',
      profileImage: profile.profileImage || '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
      email: Yup.string()
        .trim()
        .email('Invalid email address')
        .required('Email is required'),
      mobile: Yup.string()
        .trim()
        .required('Mobile number is required'),
    }),
    onSubmit: (values) => {
      setProfile({
        ...profile,
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        profileImage: values.profileImage || imagePreview,
      })
      setSuccessMessage('Profile information saved successfully!')
      setTimeout(() => {
        setSuccessMessage('')
      }, 3500)
    },
  })

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      {/* 1. Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Edit Profile
        </h1>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-xs font-semibold text-emerald-800 animate-in fade-in duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span>{successMessage}</span>
        </div>
      )}

      {/* 2. Main Two-Column Layout (Left: Profile Summary, Right: Admin Information Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Profile Summary Card */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
          {/* Avatar / Photo */}
          <div className="flex flex-col items-start gap-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt={profile.name || 'Profile'}
                className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-600 shadow-md shadow-indigo-600/30 flex items-center justify-center text-white text-3xl font-extrabold">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'P'}
              </div>
            )}
          </div>

          {/* Details List */}
          <div className="space-y-4 pt-2">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                NAME
              </span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">
                {formik.values.name || profile.name || 'Superadmin'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                TYPE
              </span>
              <span className="text-sm font-semibold text-slate-800 block mt-0.5">
                {profile.type || 'admin'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                MOBILE
              </span>
              <span className="text-sm font-mono font-medium text-slate-800 block mt-0.5">
                {formik.values.mobile || profile.mobile || '6997667868'}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                EMAIL
              </span>
              <span className="text-sm font-medium text-slate-800 block mt-0.5 break-all">
                {formik.values.email || profile.email || 'nakshatra.aneva@gmail.com'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Admin Information Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              ADMIN INFORMATION
            </h2>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Superadmin"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                    formik.touched.name && formik.errors.name
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                    formik.touched.email && formik.errors.email
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.email}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label htmlFor="mobile" className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Mobile
                </label>
                <input
                  id="mobile"
                  type="tel"
                  name="mobile"
                  placeholder="6997667868"
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                    formik.touched.mobile && formik.errors.mobile
                      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                  }`}
                />
                {formik.touched.mobile && formik.errors.mobile && (
                  <p className="mt-1 text-xs text-rose-500 font-medium">{formik.errors.mobile}</p>
                )}
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Profile Image
                </label>
                <div className="flex items-center gap-3">
                  <label className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs transition cursor-pointer shrink-0">
                    Choose file
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-slate-400 truncate">
                    {imagePreview ? 'Image chosen' : 'No file chosen'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Image Preview Box */}
            {imagePreview && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <span className="text-xs text-slate-500 font-medium">Profile preview</span>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={formik.isSubmitting}
                className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm shadow-indigo-600/20 transition cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
