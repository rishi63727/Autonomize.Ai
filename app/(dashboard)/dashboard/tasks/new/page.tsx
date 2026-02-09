'use client'

import { TaskForm } from '@/components/task-form'

export default function NewTaskPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create New Task</h1>
        <p className="text-muted-foreground">Add a new task to your task list</p>
      </div>
      <TaskForm />
    </div>
  )
}
