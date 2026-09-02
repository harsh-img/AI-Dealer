import React from 'react'

const Pagination = ({ page = 1, pageSize = 10, total = 0, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize || 1))
  const currentPage = Math.min(Math.max(page, 1), totalPages)

  const goTo = (target) => {
    if (target < 1 || target > totalPages) return
    onPageChange?.(target)
  }

  const buildPages = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages = [1]
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    if (start > 2) pages.push('...')
    for (let i = start; i <= end; i += 1) pages.push(i)
    if (end < totalPages - 1) pages.push('...')
    pages.push(totalPages)
    return pages
  }

  const pages = buildPages()

  return (
    <div className="flex items-center justify-center py-2">
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Previous Button */}
        <button
          type="button"
          className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-50 transition cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page Buttons */}
        {pages.map((item, idx) =>
          item === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-xs text-slate-400 font-semibold select-none">
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={`w-9 h-9 rounded-full text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                item === currentPage
                  ? 'bg-indigo-600 text-white border border-indigo-600 shadow-sm shadow-indigo-600/30'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-slate-50 shadow-2xs'
              }`}
              onClick={() => goTo(item)}
            >
              {item}
            </button>
          )
        )}

        {/* Next Button */}
        <button
          type="button"
          className="w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-slate-50 transition cursor-pointer flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Pagination
