import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { User, AuthState } from '@/types'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Verify token with backend
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (response.ok) {
            const user = await response.json()
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            localStorage.removeItem('auth_token')
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            })
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setAuthState(prev => ({ ...prev, isLoading: false }))
      }
    }

    checkAuth()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid email or password')
      }

      const { user, token } = await response.json()
      localStorage.setItem('auth_token', token)

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed'
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      })
      throw error
    }
  }, [])

  const register = useCallback(async (email: string, password: string, name: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      const { user, token } = await response.json()
      localStorage.setItem('auth_token', token)

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed'
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: message,
      })
      throw error
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
    }
  }, [])

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
