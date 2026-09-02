import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const PublicRoute = ({ children, redirectTo = '/dashboard' }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Loading...</p>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children ? children : <Outlet />
}

export default PublicRoute
