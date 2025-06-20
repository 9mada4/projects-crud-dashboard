import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Link as RouterLink, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { authApi } from '../services/api'
import { loginFailure, loginStart, loginSuccess } from '../store/slices/authSlice'
import { RootState } from '../store/store'

const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)
  const [error, setError] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  // すでにログイン済みの場合は、プロジェクト一覧にリダイレクト
  if (isAuthenticated) {
    return <Navigate to="/projects" replace />
  }

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('')
      dispatch(loginStart())

      const response = await authApi.login(data.email, data.password)
      dispatch(loginSuccess(response))

      navigate('/projects')
    } catch (err) {
      dispatch(loginFailure())
      setError(err instanceof Error ? err.message : 'ログインに失敗しました')
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            ログイン
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="パスワード"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'ログイン'}
            </Button>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link component={RouterLink} to="/register" variant="body2">
                アカウントをお持ちでない方はこちら
              </Link>
            </Box>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" align="center">
              デモ用アカウント:
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              管理者: admin@example.com / password
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              一般ユーザー: user@example.com / password
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default LoginPage
