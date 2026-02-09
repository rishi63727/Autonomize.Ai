import React, { useState, ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTask } from '@/context/TaskContext'
import { TaskStatus, TaskPriority } from '@/types'
import '@/styles/tasks.css'

const TasksPage: React.FC = () => {
  const navigate = useNavigate()
  const { tasks, filters, setFilter, deleteTask, isLoading } = useTask()
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleStatusFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter('status', e.target.value ? (e.target.value as TaskStatus) : null)
  }

  const handlePriorityFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter('priority', e.target.value ? (e.target.value as TaskPriority) : null)
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter('search', e.target.value)
  }

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      return
    }

    try {
      await deleteTask(id)
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="tasks-title-group">
          <h1 className="page-title">Tasks</h1>
          <p className="page-subtitle">Manage and track all your tasks</p>
        </div>
        <Link to="/dashboard/tasks" className="create-button">
          <button className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Task
          </button>
        </Link>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label className="filter-label">Status:</label>
          <select
            value={filters.status || ''}
            onChange={handleStatusFilter}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Priority:</label>
          <select
            value={filters.priority || ''}
            onChange={handlePriorityFilter}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={handleSearch}
          className="search-box"
        />
      </div>

      <div className="tasks-content">
        {tasks.length === 0 ? (
          <div className="empty-tasks">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            <p>No tasks found. Create one to get started.</p>
            <button className="btn btn-primary">Create First Task</button>
          </div>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <Link
                      to={`/dashboard/tasks/${task.id}`}
                      className="task-title-cell"
                    >
                      {task.title}
                    </Link>
                  </td>
                  <td>
                    <span className={`task-status status-${task.status}`}>
                      {task.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>
                    <span className={`task-priority priority-${task.priority}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                  </td>
                  <td>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="task-actions">
                      <Link
                        to={`/dashboard/tasks/${task.id}`}
                        className="action-btn"
                        title="Edit"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className={`action-btn delete ${deleteConfirm === task.id ? 'confirm' : ''}`}
                        title={deleteConfirm === task.id ? 'Click again to confirm' : 'Delete'}
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default TasksPage
