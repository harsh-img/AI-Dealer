import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <h1 className="text-7xl font-extrabold text-rose-500 tracking-tight">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-900">Page Not Found</h2>
      <p className="mt-2 text-slate-500 max-w-sm">The page you are looking for doesn't exist or has been moved.</p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound
