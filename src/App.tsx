import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { TaskProvider } from '@/context/TaskContext'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardLayout from '@/components/DashboardLayout'
import DashboardPage from '@/pages/DashboardPage'
import TasksPage from '@/pages/TasksPage'
import TaskDetailPage from '@/pages/TaskDetailPage'
import AnalyticsPage from '@/pages/AnalyticsPage'
import TeamPage from '@/pages/TeamPage'
import SettingsPage from '@/pages/SettingsPage'
import LoadingPage from '@/pages/LoadingPage'
import '@/styles/global.css'
import '@/styles/button.css'
import '@/styles/card.css'

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

const AppContent: React.FC = () => {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <TaskProvider>
              <DashboardLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/tasks/:id" element={<TaskDetailPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </DashboardLayout>
            </TaskProvider>
          </ProtectedRoute>
        }
      />

      {/* Redirect to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
