import React from 'react'
import '@/styles/dashboard-page.css'

const TeamPage: React.FC = () => {
  return (
    <div>
      <div className="content-header">
        <h1 className="page-title">Team</h1>
        <p className="page-subtitle">Manage your team members and collaborations</p>
      </div>
      <div className="card" style={{ padding: 'var(--spacing-3xl)', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Team management coming soon...</p>
      </div>
    </div>
  )
}

export default TeamPage
