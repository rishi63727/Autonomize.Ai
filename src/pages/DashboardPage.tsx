import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTask } from '@/context/TaskContext'
import '@/styles/dashboard-page.css'

const DashboardPage: React.FC = () => {
  const { stats, tasks, fetchTaskStats, fetchTasks } = useTask()

  useEffect(() => {
    fetchTaskStats()
    fetchTasks()
  }, [])

  const recentTasks = tasks.slice(0, 5)

  return (
    <div className="dashboard-page">
      <div className="content-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's your task overview.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 107, 53, 0.1)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-primary)' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Completed</p>
            <p className="stat-value">{stats?.completed || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(59, 125, 216, 0.1)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-secondary)' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">In Progress</p>
            <p className="stat-value">{stats?.inProgress || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-error)' }}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">High Priority</p>
            <p className="stat-value">{stats?.highPriority || 0}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-warning)' }}>
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
          </div>
          <div className="stat-info">
            <p className="stat-label">Overdue</p>
            <p className="stat-value">{stats?.overdue || 0}</p>
          </div>
        </div>
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Recent Tasks</h2>
          <Link to="/dashboard/tasks" className="view-all-link">View All</Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Create one to get started.</p>
            <Link to="/dashboard/tasks" className="btn btn-primary">
              Create Task
            </Link>
          </div>
        ) : (
          <div className="task-list">
            {recentTasks.map(task => (
              <Link
                key={task.id}
                to={`/dashboard/tasks/${task.id}`}
                className="task-item"
              >
                <div className="task-header">
                  <h3 className="task-title">{task.title}</h3>
                  <span className={`task-priority priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <span className={`task-status status-${task.status}`}>
                    {task.status.replace(/_/g, ' ')}
                  </span>
                  <span className="task-date">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
