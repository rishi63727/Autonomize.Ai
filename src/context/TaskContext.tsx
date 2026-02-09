import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { Task, TaskStatus, TaskPriority, TaskStats } from '@/types'

interface TaskContextType {
  tasks: Task[]
  selectedTask: Task | null
  stats: TaskStats | null
  isLoading: boolean
  error: string | null
  filters: {
    status: TaskStatus | null
    priority: TaskPriority | null
    search: string
  }
  fetchTasks: () => Promise<void>
  fetchTaskStats: () => Promise<void>
  selectTask: (task: Task) => void
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  setFilter: (filter: keyof typeof useTaskContext.prototype.filters, value: any) => void
  clearError: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    status: null as TaskStatus | null,
    priority: null as TaskPriority | null,
    search: '',
  })

  const token = localStorage.getItem('auth_token')

  const fetchTasks = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    setError(null)
    try {
      let url = '/api/tasks'
      const params = new URLSearchParams()
      
      if (filters.status) params.append('status', filters.status)
      if (filters.priority) params.append('priority', filters.priority)
      if (filters.search) params.append('search', filters.search)
      
      if (params.toString()) url += `?${params.toString()}`

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      const data = await response.json()
      setTasks(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [token, filters])

  const fetchTaskStats = useCallback(async () => {
    if (!token) return

    try {
      const response = await fetch('/api/tasks/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch stats')
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }, [token])

  const selectTask = useCallback((task: Task) => {
    setSelectedTask(task)
  }, [])

  const createTask = useCallback(async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!token) throw new Error('Not authenticated')

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      await fetchTasks()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [token, fetchTasks])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    if (!token) throw new Error('Not authenticated')

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      setSelectedTask(updatedTask)
      await fetchTasks()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [token, fetchTasks])

  const deleteTask = useCallback(async (id: string) => {
    if (!token) throw new Error('Not authenticated')

    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setSelectedTask(null)
      await fetchTasks()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [token, fetchTasks])

  const setFilter = useCallback((key: keyof typeof filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Fetch tasks when filters change
  useEffect(() => {
    if (token) {
      fetchTasks()
    }
  }, [filters, token, fetchTasks])

  // Fetch stats on mount
  useEffect(() => {
    if (token) {
      fetchTaskStats()
    }
  }, [token, fetchTaskStats])

  return (
    <TaskContext.Provider
      value={{
        tasks,
        selectedTask,
        stats,
        isLoading,
        error,
        filters,
        fetchTasks,
        fetchTaskStats,
        selectTask,
        createTask,
        updateTask,
        deleteTask,
        setFilter,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error('useTask must be used within TaskProvider')
  }
  return context
}
