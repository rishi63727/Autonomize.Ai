import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTask } from '@/context/TaskContext'
import { TaskStatus, TaskPriority } from '@/types'
import '@/styles/tasks.css'

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, updateTask, isLoading } = useTask()
  const [isSaving, setIsSaving] = useState(false)

  const task = tasks.find(t => t.id === id)

  const [formData, setFormData] = useState(task || {
    title: '',
    description: '',
    status: 'todo' as TaskStatus,
    priority: 'medium' as TaskPriority,
  })

  if (!task) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Task not found</p>
        <button onClick={() => navigate('/dashboard/tasks')} className="btn btn-primary">
          Back to Tasks
        </button>
      </div>
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateTask(task.id, formData)
      navigate('/dashboard/tasks')
    } catch (error) {
      console.error('Failed to save task:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="task-detail">
      <div className="task-main">
        <div className="task-header-section">
          <input
            type="text"
            value={formData.title || task.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="task-title-input"
            placeholder="Task title"
          />
          <textarea
            value={formData.description || task.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="task-description-input"
            placeholder="Task description"
          />
          <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-md)' }}>
            <button onClick={handleSave} className="btn btn-primary" disabled={isSaving || isLoading}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button onClick={() => navigate('/dashboard/tasks')} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div className="task-sidebar">
        <div className="task-info-card">
          <div className="info-label">Status</div>
          <select
            value={formData.status || task.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
            className="status-selector"
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="task-info-card">
          <div className="info-label">Priority</div>
          <select
            value={formData.priority || task.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
            className="priority-selector"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="task-info-card">
          <div className="info-label">Created</div>
          <div className="info-value">
            {new Date(task.createdAt).toLocaleDateString()}
          </div>
        </div>

        {task.dueDate && (
          <div className="task-info-card">
            <div className="info-label">Due Date</div>
            <div className="info-value">
              {new Date(task.dueDate).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskDetailPage
