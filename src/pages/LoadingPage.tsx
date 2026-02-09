import React from 'react'
import '@/styles/loading.css'

const LoadingPage: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  )
}

export default LoadingPage
