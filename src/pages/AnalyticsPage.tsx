import React from 'react'
import '@/styles/dashboard-page.css'

const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <div className="content-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Track your productivity and task completion metrics</p>
      </div>
      <div className="card" style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Analytics dashboard coming soon...</p>
      </div>
    </div>
  )
}

export default AnalyticsPage
