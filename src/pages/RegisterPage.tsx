import { Email, Lock, Person, PersonAdd, Visibility, VisibilityOff } from '@mui/icons-material'
import {
    Alert,
    Box,
    Button,
    Container,
    IconButton,
    InputAdornment,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'

interface RegisterFormData {
    name: string
    email: string
    password: string
    confirmPassword: string
}

interface FormErrors {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string
}

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [errors, setErrors] = useState<FormErrors>({})
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        // 名前のバリデーション
        if (!formData.name.trim()) {
            newErrors.name = '名前を入力してください'
        } else if (formData.name.length < 2) {
            newErrors.name = '名前は2文字以上で入力してください'
        }

        // メールのバリデーション
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email) {
            newErrors.email = 'メールアドレスを入力してください'
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = '有効なメールアドレスを入力してください'
        }

        // パスワードのバリデーション
        if (!formData.password) {
            newErrors.password = 'パスワードを入力してください'
        } else if (formData.password.length < 8) {
            newErrors.password = 'パスワードは8文字以上で入力してください'
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'パスワードは大文字・小文字・数字を含む必要があります'
        }

        // パスワード確認のバリデーション
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'パスワードの確認を入力してください'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'パスワードが一致しません'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof RegisterFormData) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: event.target.value,
        }))
        // エラーをクリア
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined,
            }))
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        setErrors({})

        try {
            // TODO: 実際のAPI呼び出しに置き換える
            await new Promise(resolve => setTimeout(resolve, 1500)) // Mock API遅延

            // 現在はMock実装のため、実際の登録処理は未実装
            setErrors({
                general: '新規ユーザー登録機能は現在開発中です。デモアカウントでログインしてください。'
            })

            // 実際の実装では以下のようになります：
            // const response = await authApi.register(formData)
            // localStorage.setItem('token', response.token)
            // navigate('/projects')

        } catch (error) {
            setErrors({
                general: 'ユーザー登録に失敗しました。しばらく経ってから再試行してください。'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    py: 4,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography component="h1" variant="h4" gutterBottom>
                        新規ユーザー登録
                    </Typography>

                    {errors.general && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {errors.general}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="名前"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Person />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="メールアドレス"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            error={!!errors.email}
                            helperText={errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="パスワード"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleInputChange('password')}
                            error={!!errors.password}
                            helperText={errors.password || 'パスワードは8文字以上、大文字・小文字・数字を含む必要があります'}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="パスワード確認"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle confirm password visibility"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isLoading}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {isLoading ? '登録中...' : '新規登録'}
                        </Button>

                        <Box textAlign="center">
                            <Link component={RouterLink} to="/login" variant="body2">
                                すでにアカウントをお持ちですか？ログイン
                            </Link>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1, width: '100%' }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            <strong>デモアカウント（開発中のため）:</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • 管理者: admin@example.com / password
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • 一般ユーザー: user@example.com / password
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}
