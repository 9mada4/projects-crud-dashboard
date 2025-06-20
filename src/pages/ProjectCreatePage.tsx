import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addProject } from '../store/slices/projectsSlice'
import { projectsApi } from '../services/api'
import { CreateProjectRequest } from '../types'

const projectSchema = z.object({
  name: z.string().min(1, 'プロジェクト名は必須です'),
  description: z.string().min(1, '説明は必須です'),
  status: z.enum(['active', 'inactive', 'completed']),
  startDate: z.string().min(1, '開始日は必須です'),
  endDate: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

const ProjectCreatePage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    },
  })

  const startDate = watch('startDate')

  const handleBack = () => {
    navigate('/projects')
  }

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setIsLoading(true)
      setError('')

      const projectData: CreateProjectRequest = {
        name: data.name,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
      }

      const newProject = await projectsApi.createProject(projectData)
      dispatch(addProject(newProject))
      
      navigate('/projects')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロジェクトの作成に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mr: 2 }}
        >
          戻る
        </Button>
        <Typography variant="h4" component="h1">
          新規プロジェクト作成
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="プロジェクト名"
            autoFocus
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="説明"
            multiline
            rows={4}
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">ステータス</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  label="ステータス"
                  {...field}
                >
                  <MenuItem value="active">アクティブ</MenuItem>
                  <MenuItem value="inactive">非アクティブ</MenuItem>
                  <MenuItem value="completed">完了</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            id="startDate"
            label="開始日"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            {...register('startDate')}
            error={!!errors.startDate}
            helperText={errors.startDate?.message}
          />

          <TextField
            margin="normal"
            fullWidth
            id="endDate"
            label="終了日"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: startDate,
            }}
            {...register('endDate')}
            error={!!errors.endDate}
            helperText={errors.endDate?.message}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : '作成'}
            </Button>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={isLoading}
            >
              キャンセル
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default ProjectCreatePage
