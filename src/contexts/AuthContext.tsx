import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/store'
import { setUser, logout } from '../store/slices/authSlice'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch()
  const { user, isAuthenticated, isLoading, token } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (token && !user) {
      // トークンがあるがユーザー情報がない場合、ユーザー情報を取得
      // 実際の実装では、トークンの検証とユーザー情報の取得を行う
      const mockUser: User = {
        id: '1',
        email: 'user@example.com',
        name: 'テストユーザー',
        role: 'admin', // デモ用に管理者権限を付与
      }
      dispatch(setUser(mockUser))
    }
  }, [token, user, dispatch])

  const handleLogout = () => {
    dispatch(logout())
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    logout: handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
