import React, { useState } from 'react'

const Filter = ({
  searchTerm = '',
  onSearchChange,
  searchPlaceholder = 'Search by name, email, or phone',
  dropdownFilter,
  selectedOption = 'all',
  onDropdownChange,
  statusFilter,
  selectedStatus = 'all',
  onStatusChange,
  genderFilter,
  selectedGender = 'all',
  onGenderChange,
  languageFilter,
  selectedLanguage = 'all',
  onLanguageChange,
  fromDate = '',
  onFromDateChange,
  toDate = '',
  onToDateChange,
  showDateFilter = false,
  showFiltersButton = true,
  defaultShowFilters = false,
  onClearFilters,
}) => {
  const [showFilters, setShowFilters] = useState(defaultShowFilters)

  const hasActiveFilters =
    (selectedStatus && selectedStatus !== 'all') ||
    (selectedOption && selectedOption !== 'all') ||
    (selectedGender && selectedGender !== 'all') ||
    (selectedLanguage && selectedLanguage !== 'all') ||
    Boolean(fromDate) ||
    Boolean(toDate)

  return (
    <div className="mb-4 space-y-3">
      {/* 1. Search and Filters Button Row */}
      <div className="flex items-center gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-2xs"
            placeholder={searchPlaceholder}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Filters Toggle Button */}
        {showFiltersButton && (
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold flex items-center gap-2 transition cursor-pointer shadow-2xs ${
              showFilters || hasActiveFilters
                ? 'border-indigo-300 bg-indigo-50/70 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                showFilters ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* 2. Expandable Filters Section */}
      {showFilters && (
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 shadow-2xs animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            {/* Status Filter */}
            {statusFilter && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {statusFilter.label || 'STATUS'}
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => onStatusChange?.(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="all">All</option>
                  {statusFilter.options?.map((option) => {
                    const val = option.value ?? option
                    const lbl = option.label ?? option
                    return (
                      <option key={val} value={val}>
                        {lbl}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}

            {/* Custom Dropdown Filter */}
            {dropdownFilter && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {dropdownFilter.label || 'CATEGORY'}
                </label>
                <select
                  value={selectedOption}
                  onChange={(e) => onDropdownChange?.(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="all">All</option>
                  {dropdownFilter.options?.map((option) => {
                    const val = option.value ?? option
                    const lbl = option.label ?? option
                    return (
                      <option key={val} value={val}>
                        {lbl}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}

            {/* Gender Filter */}
            {genderFilter && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {genderFilter.label || 'GENDER'}
                </label>
                <select
                  value={selectedGender}
                  onChange={(e) => onGenderChange?.(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="all">All</option>
                  {genderFilter.options?.map((option) => {
                    const val = option.value ?? option
                    const lbl = option.label ?? option
                    return (
                      <option key={val} value={val}>
                        {lbl}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}

            {/* Language Filter */}
            {languageFilter && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {languageFilter.label || 'LANGUAGE'}
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => onLanguageChange?.(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                >
                  <option value="all">All</option>
                  {languageFilter.options?.map((option) => {
                    const val = option.value ?? option
                    const lbl = option.label ?? option
                    return (
                      <option key={val} value={val}>
                        {lbl}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}

            {/* Date From */}
            {showDateFilter && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Filter From
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => onFromDateChange?.(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                />
              </div>
            )}

            {/* Date To */}
            {showDateFilter && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Filter To
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => onToDateChange?.(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
                />
              </div>
            )}

            {/* Clear Filters Button */}
            {onClearFilters && (
              <div className="flex items-end justify-end col-span-full sm:col-span-1 sm:col-start-2 lg:col-start-3 ml-auto pt-1 sm:pt-0">
                <button
                  type="button"
                  onClick={onClearFilters}
                  className="px-4 py-2 rounded-xl border border-rose-300 text-rose-500 hover:bg-rose-50 hover:border-rose-400 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Filter
