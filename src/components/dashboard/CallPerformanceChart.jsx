import React, { useState } from 'react'

const CallPerformanceChart = ({ data = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  // Find max total calls to scale chart bars nicely
  const maxCalls = data.length > 0 ? Math.max(...data.map((d) => d.totalCalls || 0), 1) : 2500
  // Round up to nice round limit (e.g., 2500)
  const chartMax = Math.ceil((maxCalls * 1.15) / 500) * 500

  // Calculate weekly summary totals
  const totalCallsSum = data.reduce((acc, d) => acc + (d.totalCalls || 0), 0)
  const transferredCallsSum = data.reduce((acc, d) => acc + (d.transferredCalls || 0), 0)

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs">
      {/* Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Call Performance
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
              Last 7 Days
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daily calling throughput, answer rates, and live agent escalations
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500"></span>
            <span>Total Calls</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500"></span>
            <span>Answered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500"></span>
            <span>Transferred</span>
          </div>
        </div>
      </div>

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 my-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
        <div className="text-center">
          <span className="block text-[11px] text-slate-500 font-medium">7-Day Calls</span>
          <span className="text-sm sm:text-base font-bold text-slate-900">
            {totalCallsSum.toLocaleString()}
          </span>
        </div>
        <div className="text-center border-l border-slate-200">
          <span className="block text-[11px] text-slate-500 font-medium">Live Escalations</span>
          <span className="text-sm sm:text-base font-bold text-amber-600">
            {transferredCallsSum.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Interactive Bar Chart Visualization */}
      <div className="relative pt-6 pb-2">
        {/* Y-Axis Grid Lines & Values */}
        <div className="absolute inset-x-0 top-6 bottom-10 flex flex-col justify-between pointer-events-none text-[10px] text-slate-400">
          {[1, 0.75, 0.5, 0.25, 0].map((ratio, idx) => (
            <div key={idx} className="flex items-center gap-1.5 sm:gap-2 w-full">
              <span className="w-7 sm:w-8 text-right font-mono text-[9px] sm:text-[10px]">
                {Math.round(chartMax * ratio).toLocaleString()}
              </span>
              <div className="flex-1 border-b border-dashed border-slate-200"></div>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="relative z-10 pl-8 sm:pl-10 pr-1 sm:pr-2 h-52 sm:h-56 flex items-end justify-between gap-1 sm:gap-4">
          {data.map((item, idx) => {
            const totalHeight = Math.min(Math.round((item.totalCalls / chartMax) * 100), 100)
            const answeredHeight = Math.min(Math.round((item.answeredCalls / chartMax) * 100), 100)
            const transferredHeight = Math.min(Math.round((item.transferredCalls / chartMax) * 100), 100)
            const isHovered = hoveredIndex === idx

            return (
              <div
                key={item.day || idx}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative min-w-0"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(isHovered ? null : idx)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-30 bg-slate-900 text-white rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs shadow-xl border border-slate-700 whitespace-nowrap animate-in fade-in zoom-in-95 duration-150 pointer-events-none">
                    <p className="font-semibold text-slate-200 mb-0.5">
                      {item.day} ({item.date})
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="text-indigo-300">Calls: {item.totalCalls.toLocaleString()}</span>
                      <span>•</span>
                      <span className="text-emerald-300">Ans: {item.answeredCalls.toLocaleString()}</span>
                      <span>•</span>
                      <span className="text-amber-300">Trf: {item.transferredCalls.toLocaleString()}</span>
                    </div>
                    {/* Tooltip caret */}
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-700"></div>
                  </div>
                )}

                {/* Grouped Bars Container */}
                <div className="w-full max-w-[44px] flex items-end justify-center gap-0.5 sm:gap-1.5 h-full pb-1">
                  {/* Total Calls Bar */}
                  <div
                    style={{ height: `${totalHeight}%` }}
                    className={`w-1/3 min-w-[4px] sm:min-w-[6px] rounded-t-sm sm:rounded-t-md transition-all duration-300 ${
                      isHovered ? 'bg-indigo-600 shadow-md shadow-indigo-500/30' : 'bg-indigo-400/80 hover:bg-indigo-500'
                    }`}
                  />
                  {/* Answered Calls Bar */}
                  <div
                    style={{ height: `${answeredHeight}%` }}
                    className={`w-1/3 min-w-[4px] sm:min-w-[6px] rounded-t-sm sm:rounded-t-md transition-all duration-300 ${
                      isHovered ? 'bg-emerald-600 shadow-md shadow-emerald-500/30' : 'bg-emerald-400/80 hover:bg-emerald-500'
                    }`}
                  />
                  {/* Transferred Calls Bar */}
                  <div
                    style={{ height: `${transferredHeight}%` }}
                    className={`w-1/3 min-w-[4px] sm:min-w-[6px] rounded-t-sm sm:rounded-t-md transition-all duration-300 ${
                      isHovered ? 'bg-amber-600 shadow-md shadow-amber-500/30' : 'bg-amber-400/80 hover:bg-amber-500'
                    }`}
                  />
                </div>

                {/* Day label */}
                <div className="mt-2 text-center">
                  <span
                    className={`text-[10px] sm:text-[11px] font-semibold transition ${
                      isHovered ? 'text-indigo-600' : 'text-slate-500'
                    }`}
                  >
                    {item.day}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CallPerformanceChart
