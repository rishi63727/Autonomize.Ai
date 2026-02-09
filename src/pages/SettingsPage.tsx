import React from 'react'
import { useAuth } from '@/context/AuthContext'
import '@/styles/dashboard-page.css'

const SettingsPage: React.FC = () => {
  const { user } = useAuth()

  return (
    <div>
      <div className="content-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your profile and preferences</p>
      </div>
      <div className="card" style={{ padding: 'var(--spacing-xl)' }}>
        <h2 style={{ marginTop: 0 }}>Account Information</h2>
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <p style={{ margin: 0, marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>Name</p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)' }}>{user?.name}</p>
        </div>
        <div>
          <p style={{ margin: 0, marginBottom: 'var(--spacing-sm)', color: 'var(--color-text-secondary)' }}>Email</p>
          <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-medium)' }}>{user?.email}</p>
        </div>
      </div>
    </div>
  )
}

export default SettingsPage
