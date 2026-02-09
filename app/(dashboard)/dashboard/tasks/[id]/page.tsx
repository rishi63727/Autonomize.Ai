'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { TaskForm } from '@/components/task-form'
import { Icons } from '@/components/icons'

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  dueDate: string
}

export default function EditTaskPage() {
  const params = useParams()
  const taskId = params.id as string
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`)
        if (response.ok) {
          const data = await response.json()
          setTask(data)
        }
      } catch (error) {
        console.error('Failed to fetch task:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Edit Task</h1>
        <p className="text-muted-foreground">Update your task details</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Icons.spinner className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : task ? (
        <TaskForm taskId={taskId} initialData={task} />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Task not found</p>
        </div>
      )}
    </div>
  )
}
