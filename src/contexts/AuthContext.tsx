import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { auth, db } from '@/integrations/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextValue {
  user: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { address } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const {
      data: { subscription },
    } = auth.onAuthStateChange((_event, session) => {
      setSession(session as Session | null)
      setUser((session as Session | null)?.user ?? null)
      setIsLoading(false)
    })

    auth.getSession().then(({ session }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Sync wallet address to user profile when both are available
  useEffect(() => {
    if (address && user) {
      db.voters.upsert({ wallet_address: address, email: user.email }).catch(console.error)
    }
  }, [address, user])

  const signOut = async () => {
    await auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
