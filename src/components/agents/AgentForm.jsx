import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import agentsData from '../../data/agents.json'

const AgentForm = ({ initialValues, isEdit = false }) => {
  const navigate = useNavigate()
  const languages = agentsData.languages || []
  const voices = agentsData.voices || []
  const genders = agentsData.genders || []

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    prompt: '',
    language: languages[0] || 'English (US)',
    voice: voices[0] || 'Sarah (Warm & Energetic)',
    gender: genders[0] || 'Female',
    status: 'Active',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate initial values in edit mode
  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        description: initialValues.description || '',
        prompt: initialValues.prompt || '',
        language: initialValues.language || languages[0] || 'English (US)',
        voice: initialValues.voice || voices[0] || 'Sarah (Warm & Energetic)',
        gender: initialValues.gender || genders[0] || 'Female',
        status: initialValues.status || 'Active',
      })
    }
  }, [initialValues, languages, voices, genders])

  // Field validation function (Yup-aligned rules)
  const validateField = (name, value) => {
    let error = ''
    switch (name) {
      case 'name':
        if (!value || !value.trim()) {
          error = 'Agent Name is required'
        } else if (value.trim().length < 3) {
          error = 'Agent Name must be at least 3 characters'
        }
        break
      case 'prompt':
        if (!value || !value.trim()) {
          error = 'System Prompt / AI Instructions are required'
        } else if (value.trim().length < 15) {
          error = 'Please provide a more descriptive system prompt (at least 15 characters)'
        }
        break
      case 'language':
        if (!value) error = 'Please select a language'
        break
      case 'voice':
        if (!value) error = 'Please select a voice persona'
        break
      case 'gender':
        if (!value) error = 'Please select a gender'
        break
      default:
        break
    }
    return error
  }

  // Validate all fields
  const validateAll = (data) => {
    const newErrors = {}
    Object.keys(data).forEach((field) => {
      const error = validateField(field, data[field])
      if (error) newErrors[field] = error
    })
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error dynamically if valid
    if (touched[name]) {
      const error = validateField(name, value)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name, value)
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all as touched
    const allTouched = Object.keys(formData).reduce((acc, k) => ({ ...acc, [k]: true }), {})
    setTouched(allTouched)

    const validationErrors = validateAll(formData)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return
    }

    setIsSubmitting(true)
    // Simulate short submission feedback then navigate
    await new Promise((resolve) => setTimeout(resolve, 300))
    setIsSubmitting(false)
    navigate('/agents')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Basic Information Section */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Basic Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Set the display name and general summary for this AI persona.
          </p>
        </div>

        <div className="space-y-4">
          {/* Agent Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Agent Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. Sales Assistant, Support Concierge"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 ${
                touched.name && errors.name
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {touched.name && errors.name && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this agent's objective or target campaign..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>

      {/* 2. AI Voice & Personality Configuration */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">AI Configuration & Prompt</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure system behavior, conversation script guidelines, language, and voice model.
          </p>
        </div>

        <div className="space-y-4">
          {/* System Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                System Prompt / AI Instructions <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-normal">
                Defines conversational goals and behavior
              </span>
            </div>
            <textarea
              name="prompt"
              rows={6}
              value={formData.prompt}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="You are Sarah, a professional sales representative. Introduce AI Dialer to prospective leads, answer questions about automated calling, and schedule a 15-minute product demo..."
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white font-mono text-xs leading-relaxed transition focus:outline-none focus:ring-2 ${
                touched.prompt && errors.prompt
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
            {touched.prompt && errors.prompt && (
              <p className="mt-1 text-xs text-rose-500 font-medium">{errors.prompt}</p>
            )}
          </div>

          {/* 3-Column Dropdown Pickers: Language, Voice, Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Language */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Language <span className="text-rose-500">*</span>
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Voice */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Voice Persona <span className="text-rose-500">*</span>
              </label>
              <select
                name="voice"
                value={formData.voice}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 cursor-pointer"
              >
                {voices.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:border-indigo-500 focus:ring-indigo-500/20 cursor-pointer"
              >
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational Status */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900">Agent Status</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Active agents can be immediately assigned to calling campaigns.
          </p>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="status"
              value="Active"
              checked={formData.status === 'Active'}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Active
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="radio"
              name="status"
              value="Inactive"
              checked={formData.status === 'Inactive'}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
              Inactive
            </span>
          </label>
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigate('/agents')}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-600/20 transition cursor-pointer disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{isEdit ? 'Updating Agent...' : 'Saving Agent...'}</span>
            </>
          ) : (
            <span>{isEdit ? 'Update Agent' : 'Save Agent'}</span>
          )}
        </button>
      </div>
    </form>
  )
}

export default AgentForm
