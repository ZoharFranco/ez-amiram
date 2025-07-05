'use client'

import { UsersRepository } from '@/backend/dal/repositories/users-repository'
import { auth } from '@/backend/services/external/firebase/firebase'
import { FirebaseError } from 'firebase/app'
import { signOut as firebaseSignOut, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, User } from 'firebase/auth'
import React, { createContext, useContext, useEffect, useState } from 'react'



type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const usersRepository = new UsersRepository()

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider).then((user) => {
        usersRepository.save(user)
      })
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/unauthorized-domain') {
          console.error('This domain is not authorized for Google Sign-In in your Firebase project. Please add it to the authorized domains list in the Firebase Console.')
        } else {
          console.error('Error signing in with Google', error.message)
        }
      } else {
        console.error('Unexpected error during sign in', error)
      }
      throw error // Re-throw the error so it can be handled by the component
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error('Error signing out', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

