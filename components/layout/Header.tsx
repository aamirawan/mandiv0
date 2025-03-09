'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { UserMenu } from '../auth/UserMenu'
import { supabase } from '@/lib/supabase'

export function Header() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <div className="flex items-center justify-end h-16 px-4 border-b bg-white">
      {!loading && (
        <>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.email}
              </span>
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/signin"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
} 