import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const res = NextResponse.json({ message: 'Logged out successfully' })
  
  // Clear auth cookie
  res.cookies.delete('auth_token')
  
  return res
}
