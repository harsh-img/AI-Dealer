import React, { useEffect, useMemo, useState, useRef } from 'react'
import Pagination from './Pagination'
import Filter from './Filter'

export const buildCsv = (rows, columns) => {
  const header = columns.map((c) => c.label).join(',')
  const body = rows
    .map((row, index) =>
      columns
        .map((c) => {
          let cell
          if (typeof c.toCsv === 'function') {
            cell = c.toCsv(row, index)
          } else if (typeof c.render === 'function') {
            const rendered = c.render(row[c.key], row, index)
            cell = typeof rendered === 'string' || typeof rendered === 'number' ? rendered : (row[c.key] ?? '')
          } else {
            cell = row[c.key] ?? ''
          }
          const safe = String(cell).replace(/"/g, '""')
          return `"${safe}"`
        })
        .join(',')
    )
    .join('\n')
  return `${header}\n${body}`
}

export const downloadCsv = (csv, filename = 'export.csv') => {
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const downloadPdf = (rows, columns, filename = 'export.pdf', title) => {
  const table = document.createElement('table')
  table.style.borderCollapse = 'collapse'
  table.style.width = '100%'
  table.style.fontFamily = 'Arial, sans-serif'
  table.style.fontSize = '12px'

  const thead = document.createElement('thead')
  const headerRow = document.createElement('tr')
  headerRow.style.backgroundColor = '#f8fafc'
  headerRow.style.borderBottom = '2px solid #cbd5e1'

  columns.forEach((col) => {
    const th = document.createElement('th')
    th.textContent = col.label
    th.style.padding = '8px 12px'
    th.style.border = '1px solid #e2e8f0'
    th.style.textAlign = 'left'
    th.style.fontWeight = 'bold'
    th.style.color = '#334155'
    headerRow.appendChild(th)
  })
  thead.appendChild(headerRow)
  table.appendChild(thead)

  const tbody = document.createElement('tbody')
  rows.forEach((row, idx) => {
    const tr = document.createElement('tr')
    tr.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#f8fafc'

    columns.forEach((col) => {
      const td = document.createElement('td')
      let value
      if (typeof col.render === 'function') {
        const rendered = col.render(row[col.key], row, idx)
        value = typeof rendered === 'string' || typeof rendered === 'number' ? rendered : (row[col.key] ?? '')
      } else {
        value = row[col.key] ?? ''
      }
      td.textContent = String(value)
      td.style.padding = '8px 12px'
      td.style.border = '1px solid #e2e8f0'
      td.style.color = '#1e293b'
      tr.appendChild(td)
    })
    tbody.appendChild(tr)
  })
  table.appendChild(tbody)

  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { margin: 24px; font-family: Arial, sans-serif; }
          h2 { margin-bottom: 16px; color: #0f172a; }
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px 12px; border: 1px solid #e2e8f0; text-align: left; }
          th { background-color: #f8fafc; font-weight: bold; }
          tr:nth-child(even) { background-color: #f8fafc; }
          @media print { body { margin: 0; } @page { margin: 1cm; } }
        </style>
      </head>
      <body>
        <h2>${title || filename.replace('.pdf', '')}</h2>
        ${table.outerHTML}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

export const ReadMoreCell = ({ content }) => {
  if (typeof content !== 'string') return content
  return (
    <div
      className="line-clamp-2 text-ellipsis overflow-hidden break-words whitespace-pre-wrap"
      title={content}
    >
      {content}
    </div>
  )
}

const DataTable = ({
  title,
  data = [],
  columns = [],
  searchKeys,
  showFilters = true,
  showSearch = true,
  searchPlaceholder = 'Search by name, email, or phone',
  dropdownFilter,
  statusFilter,
  genderFilter,
  languageFilter,
  showDateFilter = false,
  showFiltersButton = true,
  defaultShowFilters = false,
  showExport = false,
  exportFileName = 'export.csv',
  showCsvExport = true,
  showPdfExport = true,
  showIndex = false,
  actions,
  emptyState = 'No records found.',
  toolbarSlot,
  pagination,
  onFiltersChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOption, setSelectedOption] = useState(dropdownFilter?.defaultValue ?? 'all')
  const [selectedStatus, setSelectedStatus] = useState(statusFilter?.defaultValue ?? 'all')
  const [selectedGender, setSelectedGender] = useState(genderFilter?.defaultValue ?? 'all')
  const [selectedLanguage, setSelectedLanguage] = useState(languageFilter?.defaultValue ?? 'all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [showExportDropdown, setShowExportDropdown] = useState(false)
  const [clientPage, setClientPage] = useState(1)
  const exportDropdownRef = useRef(null)

  // Close export dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false)
      }
    }
    if (showExportDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showExportDropdown])

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedOption(dropdownFilter?.defaultValue ?? 'all')
    setSelectedStatus(statusFilter?.defaultValue ?? 'all')
    setSelectedGender(genderFilter?.defaultValue ?? 'all')
    setSelectedLanguage(languageFilter?.defaultValue ?? 'all')
    setFromDate('')
    setToDate('')
  }

  const normalizedSearch = searchTerm.trim().toLowerCase()
  const searchableKeys =
    searchKeys && searchKeys.length > 0 ? searchKeys : columns.map((c) => c.key)

  const isServer = Boolean(pagination?.server)

  // Frontend filter logic
  const filteredRows = useMemo(() => {
    if (isServer) return data

    return data.filter((row) => {
      // Dropdown filter
      if (dropdownFilter?.key && selectedOption !== 'all') {
        if (String(row[dropdownFilter.key]) !== String(selectedOption)) return false
      }

      // Status filter
      if (statusFilter?.key && selectedStatus !== 'all' && selectedStatus !== '') {
        if (String(row[statusFilter.key]).toLowerCase() !== String(selectedStatus).toLowerCase()) {
          return false
        }
      }

      // Gender filter
      if (genderFilter?.key && selectedGender !== 'all' && selectedGender !== '') {
        if (String(row[genderFilter.key]).toLowerCase() !== String(selectedGender).toLowerCase()) {
          return false
        }
      }

      // Language filter
      if (languageFilter?.key && selectedLanguage !== 'all' && selectedLanguage !== '') {
        if (!String(row[languageFilter.key]).toLowerCase().includes(String(selectedLanguage).toLowerCase())) {
          return false
        }
      }

      // Search term
      if (normalizedSearch) {
        return searchableKeys.some((key) => {
          const val = row[key]
          if (val === null || val === undefined) return false
          return String(val).toLowerCase().includes(normalizedSearch)
        })
      }

      return true
    })
  }, [
    data,
    isServer,
    dropdownFilter,
    selectedOption,
    statusFilter,
    selectedStatus,
    genderFilter,
    selectedGender,
    languageFilter,
    selectedLanguage,
    normalizedSearch,
    searchableKeys,
  ])

  // Pagination calculations
  const pageSize = pagination?.pageSize ?? 10
  const totalItems = isServer ? (pagination?.total ?? 0) : filteredRows.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize || 1))
  const currentPage = isServer
    ? (pagination?.page ?? 1)
    : Math.min(Math.max(pagination?.page ?? clientPage, 1), totalPages)

  const rowsToRender = useMemo(() => {
    if (isServer || !pagination) return filteredRows
    return filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  }, [filteredRows, isServer, pagination, currentPage, pageSize])

  const handlePageChange = (page) => {
    if (isServer) {
      pagination?.onPageChange?.(page)
    } else {
      setClientPage(page)
      pagination?.onPageChange?.(page)
    }
  }

  // Handle CSV Export
  const handleExportCsv = () => {
    const activeCols = columns.filter((c) => !c.hidden)
    const csv = buildCsv(filteredRows, activeCols)
    downloadCsv(csv, exportFileName.endsWith('.csv') ? exportFileName : `${exportFileName}.csv`)
    setShowExportDropdown(false)
  }

  // Handle PDF Export
  const handleExportPdf = () => {
    const activeCols = columns.filter((c) => !c.hidden)
    const pdfFilename = exportFileName.replace(/\.csv$/i, '.pdf')
    downloadPdf(filteredRows, activeCols, pdfFilename, title)
    setShowExportDropdown(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* 1. Table Header (NakshatraLive style) */}
      <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {title && (
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {title}
            </h2>
          )}
          <div className="text-xs text-slate-500 mt-0.5">
            {isServer
              ? `${totalItems} records`
              : `${filteredRows.length} of ${data.length} records`}
          </div>
        </div>

        {/* Header Action Tools Slot & Export */}
        <div className="flex items-center gap-3 flex-wrap">
          {toolbarSlot}

          {showExport && (
            <div className="relative" ref={exportDropdownRef}>
              <button
                type="button"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition cursor-pointer"
                onClick={() => setShowExportDropdown(!showExportDropdown)}
              >
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export</span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    showExportDropdown ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showExportDropdown && (
                <div className="absolute right-0 top-[calc(100%+8px)] min-w-[160px] rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-20 animate-in fade-in duration-100">
                  {showCsvExport && (
                    <button
                      type="button"
                      className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      onClick={handleExportCsv}
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export CSV
                    </button>
                  )}
                  {showPdfExport && (
                    <button
                      type="button"
                      className="w-full text-left flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      onClick={handleExportPdf}
                    >
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Export PDF
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 2. NakshatraLive Expandable Filter Row */}
      {showFilters && (
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-white">
          <Filter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder={searchPlaceholder}
            statusFilter={statusFilter}
            selectedStatus={selectedStatus}
            onStatusChange={setSelectedStatus}
            dropdownFilter={dropdownFilter}
            selectedOption={selectedOption}
            onDropdownChange={setSelectedOption}
            genderFilter={genderFilter}
            selectedGender={selectedGender}
            onGenderChange={setSelectedGender}
            languageFilter={languageFilter}
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
            fromDate={fromDate}
            onFromDateChange={setFromDate}
            toDate={toDate}
            onToDateChange={setToDate}
            showDateFilter={showDateFilter}
            showFiltersButton={showFiltersButton}
            defaultShowFilters={defaultShowFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
      )}

      {/* 3. Table Wrapper (NakshatraLive style) */}
      <div className="overflow-x-auto min-h-[220px]">
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="bg-slate-50/85 border-b border-slate-200/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
              {showIndex && <th className="py-3.5 px-4 sm:px-5 w-16">S.No</th>}
              {columns
                .filter((col) => !col.hidden)
                .map((col, idx) => (
                  <th
                    key={col.key ?? idx}
                    style={{ width: col.width, ...col.style }}
                    className={`py-3.5 px-4 sm:px-5 ${col.headerClassName || ''}`}
                  >
                    {col.label}
                  </th>
                ))}
              {actions && <th className="py-3.5 px-4 sm:px-5 text-right w-24">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {rowsToRender.length === 0 ? (
              // Empty State (NakshatraLive style)
              <tr>
                <td
                  colSpan={columns.filter((c) => !c.hidden).length + (showIndex ? 1 : 0) + (actions ? 1 : 0)}
                  className="py-14 px-4 text-center"
                >
                  <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3.5 border border-indigo-100 shadow-2xs">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{emptyState}</p>
                    <p className="text-xs text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Table Rows
              rowsToRender.map((row, idx) => (
                <tr
                  key={row.id ?? idx}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {showIndex && (
                    <td className="py-4 px-4 sm:px-5 font-semibold text-slate-500">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                  )}

                  {columns
                    .filter((col) => !col.hidden)
                    .map((col, cIdx) => (
                      <td
                        key={col.key ?? cIdx}
                        className={`py-4 px-4 sm:px-5 text-slate-700 ${col.cellClassName || ''}`}
                      >
                        {typeof col.render === 'function' ? (
                          col.render(row[col.key], row, idx)
                        ) : (
                          <ReadMoreCell content={row[col.key]} />
                        )}
                      </td>
                    ))}

                  {actions && (
                    <td className="py-4 px-4 sm:px-5 text-right font-medium">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Table Footer & Pagination (NakshatraLive style) */}
      {pagination && totalItems > 0 && (
        <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold text-slate-800">
              {Math.min(currentPage * pageSize, totalItems)}
            </span>{' '}
            of <span className="font-semibold text-slate-800">{totalItems}</span> records
          </div>

          <Pagination
            page={currentPage}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  )
}

export default DataTable
