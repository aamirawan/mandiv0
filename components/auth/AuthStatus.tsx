'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export function AuthStatus() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setUser(session?.user || null)
      } catch (error) {
        console.error('Error checking auth status:', error)
      } finally {
        setLoading(false)
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await supabase.auth.signOut()
      router.push('/signin')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center p-4 text-sm text-gray-500">Loading...</div>
  }

  if (user) {
    return (
      <div className="px-3 py-2">
        <div className="mb-2 flex items-center px-2">
          <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="ml-2 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="flex w-full items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {isSigningOut ? (
            "Signing out..."
          ) : (
            <>
              <svg 
                className="w-4 h-4 mr-2 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-3 py-2">
      <Link 
        href="/signin"
        className="flex w-full items-center justify-center rounded-md bg-white border border-green-500 px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 transition-colors"
      >
        Sign in
      </Link>
      <Link 
        href="/signup"
        className="flex w-full items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
      >
        Sign up
      </Link>
    </div>
  )
} 