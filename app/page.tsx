'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has auth token, if yes redirect to dashboard, otherwise to login
    const hasToken = document.cookie.includes('auth_token')
    if (hasToken) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }, [router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">TaskFlow</h1>
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </main>
  )
}
