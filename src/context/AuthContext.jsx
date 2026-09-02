import React, { useState } from 'react'
import { AuthContext } from './auth-context'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token') || null
    } catch {
      return null
    }
  })

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    if (authToken) {
      localStorage.setItem('token', authToken)
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    loading: false,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
