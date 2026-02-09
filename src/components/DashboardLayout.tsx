import React, { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import '@/styles/dashboard.css'

interface DashboardLayoutProps {
  children: ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname.startsWith(path)
  }

  const handleLogout = async () => {
    await logout()
  }

  const userInitials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U'

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">TaskFlow</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Main</div>
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') && !isActive('/dashboard/tasks') ? 'active' : ''}`}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              Dashboard
            </Link>
            <Link
              to="/dashboard/tasks"
              className={`nav-link ${isActive('/dashboard/tasks') ? 'active' : ''}`}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tasks
            </Link>
            <Link
              to="/dashboard/analytics"
              className={`nav-link ${isActive('/dashboard/analytics') ? 'active' : ''}`}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
              Analytics
            </Link>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Team</div>
            <Link
              to="/dashboard/team"
              className={`nav-link ${isActive('/dashboard/team') ? 'active' : ''}`}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              Team
            </Link>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Settings</div>
            <Link
              to="/dashboard/settings"
              className={`nav-link ${isActive('/dashboard/settings') ? 'active' : ''}`}
            >
              <svg className="nav-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94c0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33c-.22-.08-.47 0-.59.22L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48l2.03 1.58C4.84 11.36 4.8 11.69 4.8 12s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.62l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6s3.6 1.62 3.6 3.6s-1.62 3.6-3.6 3.6z" />
              </svg>
              Settings
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          {user && (
            <div className="user-card">
              <div className="user-avatar">{userInitials}</div>
              <div className="user-info">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-block"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="main-content">
        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
