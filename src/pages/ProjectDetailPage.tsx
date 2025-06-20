import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Button,
  Chip,
  Grid,
  Alert,
  Skeleton,
  Paper,
  Divider,
} from '@mui/material'
import { Edit, ArrowBack } from '@mui/icons-material'
import { RootState } from '../store/store'
import { setCurrentProject, clearCurrentProject } from '../store/slices/projectsSlice'
import { projectsApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { currentProject } = useSelector((state: RootState) => state.projects)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadProject = async () => {
      if (!id) {
        setError('プロジェクトIDが指定されていません')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError('')
        const project = await projectsApi.getProject(id)
        dispatch(setCurrentProject(project))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'プロジェクトの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    loadProject()

    // クリーンアップ
    return () => {
      dispatch(clearCurrentProject())
    }
  }, [id, dispatch])

  const handleBack = () => {
    navigate('/projects')
  }

  const handleEdit = () => {
    if (currentProject) {
      navigate(`/projects/${currentProject.id}/edit`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      case 'completed':
        return 'primary'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'アクティブ'
      case 'inactive':
        return '非アクティブ'
      case 'completed':
        return '完了'
      default:
        return status
    }
  }

  if (error) {
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

  if (isLoading) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          戻る
        </Button>
        <Paper sx={{ p: 3 }}>
          <Skeleton variant="text" height={48} width="60%" />
          <Skeleton variant="text" height={24} width={100} sx={{ mt: 2 }} />
          <Skeleton variant="text" height={20} width="100%" sx={{ mt: 2 }} />
          <Skeleton variant="text" height={20} width="80%" />
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    )
  }

  if (!currentProject) {
    return (
      <Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          戻る
        </Button>
        <Alert severity="info">
          プロジェクトが見つかりません
        </Alert>
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
        {user?.role === 'admin' && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            編集
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            {currentProject.name}
          </Typography>
          <Chip
            label={getStatusLabel(currentProject.status)}
            color={getStatusColor(currentProject.status) as any}
          />
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          説明
        </Typography>
        <Typography variant="body1" paragraph>
          {currentProject.description}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              プロジェクト情報
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                開始日
              </Typography>
              <Typography variant="body1">
                {new Date(currentProject.startDate).toLocaleDateString('ja-JP')}
              </Typography>
            </Box>
            {currentProject.endDate && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  終了日
                </Typography>
                <Typography variant="body1">
                  {new Date(currentProject.endDate).toLocaleDateString('ja-JP')}
                </Typography>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              システム情報
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                作成日時
              </Typography>
              <Typography variant="body1">
                {new Date(currentProject.createdAt).toLocaleString('ja-JP')}
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                更新日時
              </Typography>
              <Typography variant="body1">
                {new Date(currentProject.updatedAt).toLocaleString('ja-JP')}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default ProjectDetailPage
