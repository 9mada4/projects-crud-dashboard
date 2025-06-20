import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
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
  Skeleton,
} from '@mui/material'
import { ArrowBack, Save } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RootState } from '../store/store'
import { setCurrentProject, clearCurrentProject, updateProject } from '../store/slices/projectsSlice'
import { projectsApi } from '../services/api'
import { UpdateProjectRequest } from '../types'

const projectSchema = z.object({
  name: z.string().min(1, 'プロジェクト名は必須です'),
  description: z.string().min(1, '説明は必須です'),
  status: z.enum(['active', 'inactive', 'completed']),
  startDate: z.string().min(1, '開始日は必須です'),
  endDate: z.string().optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

const ProjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentProject } = useSelector((state: RootState) => state.projects)
  const [isLoading, setIsLoading] = useState(false)
  const [isProjectLoading, setIsProjectLoading] = useState(true)
  const [error, setError] = useState<string>('')

  const {
    control,
    handleSubmit,
    register,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  })

  const startDate = watch('startDate')

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('プロジェクトIDが指定されていません')
        setIsProjectLoading(false)
        return
      }

      try {
        setIsProjectLoading(true)
        setError('')
        const project = await projectsApi.getProject(id)
        dispatch(setCurrentProject(project))
        
        // フォームに既存データを設定
        reset({
          name: project.name,
          description: project.description,
          status: project.status,
          startDate: project.startDate,
          endDate: project.endDate || '',
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました')
      } finally {
        setIsProjectLoading(false)
      }
    }

    loadProject()

    // クリーンアップ
    return () => {
      dispatch(clearCurrentProject())
    }
  }, [id, dispatch, reset])

  const handleBack = () => {
    navigate('/projects')
  }

  const onSubmit = async (data: ProjectFormData) => {
    if (!currentProject) return

    try {
      setIsLoading(true)
      setError('')

      const projectData: UpdateProjectRequest = {
        id: currentProject.id,
        name: data.name,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate || undefined,
      }

      const updatedProject = await projectsApi.updateProject(projectData)
      dispatch(updateProject(updatedProject))
      
      navigate(`/projects/${currentProject.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'プロジェクトの更新に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (error && !currentProject) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          戻る
        </Button>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    )
  }

  if (isProjectLoading) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          戻る
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          プロジェクト編集
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" height={56} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={56} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={56} sx={{ mb: 2 }} />
          <Skeleton variant="text" height={56} sx={{ mb: 2 }} />
        </Paper>
      </Box>
    )
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
          プロジェクト編集
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
              {isLoading ? <CircularProgress size={20} /> : '更新'}
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

export default ProjectEditPage
