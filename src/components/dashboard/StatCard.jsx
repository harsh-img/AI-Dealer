import React from 'react'

const getIcon = (iconName) => {
  switch (iconName) {
    case 'campaign':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      )
    case 'phone':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    case 'checkCircle':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    case 'users':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    case 'phoneForwarded':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    case 'cpu':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
  }
}

const getIconColors = (iconName) => {
  switch (iconName) {
    case 'campaign':
      return 'bg-blue-50 text-blue-600 border-blue-100'
    case 'totalCalls':
    case 'phone':
      return 'bg-indigo-50 text-indigo-600 border-indigo-100'
    case 'checkCircle':
      return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'users':
      return 'bg-violet-50 text-violet-600 border-violet-100'
    case 'phoneForwarded':
      return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'cpu':
      return 'bg-sky-50 text-sky-600 border-sky-100'
    default:
      return 'bg-slate-50 text-slate-600 border-slate-200'
  }
}

const StatCard = ({
  label,
  value,
  change,
  changeType = 'positive',
  changeLabel,
  description,
  icon,
}) => {
  const iconTheme = getIconColors(icon)

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 truncate">
            {value}
          </p>
        </div>
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconTheme}`}>
          {getIcon(icon)}
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs overflow-hidden min-w-0">
        {change && (
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold shrink-0 ${
              changeType === 'positive'
                ? 'bg-emerald-50 text-emerald-700'
                : changeType === 'negative'
                ? 'bg-rose-50 text-rose-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {changeType === 'positive' && (
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            )}
            {changeType === 'negative' && (
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {change}
          </span>
        )}
        <span
          className="text-slate-400 text-[10px] sm:text-[11px] font-normal truncate min-w-0"
          title={changeLabel || description}
        >
          {changeLabel || description}
        </span>
      </div>
    </div>
  )
}

export default StatCard
