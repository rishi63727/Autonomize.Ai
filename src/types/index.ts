export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export type TaskStatus = 'todo' | 'in_progress' | 'in_review' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
  completedAt?: string
}

export interface Comment {
  id: string
  taskId: string
  userId: string
  userName: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface TaskFile {
  id: string
  taskId: string
  fileName: string
  fileSize: number
  fileType: string
  uploadedBy: string
  uploadedAt: string
  downloadUrl: string
}

export interface TaskStats {
  total: number
  completed: number
  inProgress: number
  highPriority: number
  overdue: number
}

export interface AnalyticsData {
  tasksOverTime: Array<{
    date: string
    completed: number
    created: number
  }>
  priorityDistribution: Array<{
    name: string
    value: number
  }>
  statusDistribution: Array<{
    name: string
    value: number
  }>
  completionRate: number
  averageCompletionTime: number
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  joinedAt: string
}

export interface AppState {
  auth: AuthState
  tasks: Task[]
  selectedTask: Task | null
  isLoading: boolean
  error: string | null
  filters: {
    status: TaskStatus | null
    priority: TaskPriority | null
    search: string
  }
}
