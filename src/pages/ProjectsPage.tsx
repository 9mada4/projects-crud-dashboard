import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Pagination,
  Alert,
  Skeleton,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { Edit, Delete, Visibility } from '@mui/icons-material'
import { RootState } from '../store/store'
import {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  deleteProject,
} from '../store/slices/projectsSlice'
import { projectsApi } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { Project } from '../types'

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useAuth()
  const { projects, pagination, isLoading, error } = useSelector((state: RootState) => state.projects)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)

  useEffect(() => {
    loadProjects(1)
  }, [])

  const loadProjects = async (page: number) => {
    try {
      dispatch(fetchProjectsStart())
      const response = await projectsApi.getProjects(page, 10)
      dispatch(fetchProjectsSuccess(response))
    } catch (err) {
      dispatch(fetchProjectsFailure(err instanceof Error ? err.message : 'データの取得に失敗しました'))
    }
  }

  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    loadProjects(page)
  }

  const handleView = (projectId: string) => {
    navigate(`/projects/${projectId}`)
  }

  const handleEdit = (projectId: string) => {
    navigate(`/projects/${projectId}/edit`)
  }

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return

    try {
      await projectsApi.deleteProject(projectToDelete.id)
      dispatch(deleteProject(projectToDelete.id))
      setDeleteDialogOpen(false)
      setProjectToDelete(null)
    } catch (err) {
      console.error('削除に失敗しました:', err)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setProjectToDelete(null)
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
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        プロジェクト一覧
      </Typography>

      {isLoading ? (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Box sx={{ mt: 1 }}>
                    <Skeleton variant="rounded" width={80} height={24} />
                  </Box>
                </CardContent>
                <CardActions>
                  <Skeleton variant="rounded" width={80} height={36} />
                  <Skeleton variant="rounded" width={80} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 3,
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {project.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                      }}
                    >
                      {project.description}
                    </Typography>
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={getStatusLabel(project.status)}
                        color={getStatusColor(project.status) as any}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      開始日: {new Date(project.startDate).toLocaleDateString('ja-JP')}
                    </Typography>
                    {project.endDate && (
                      <Typography variant="body2" color="text.secondary">
                        終了日: {new Date(project.endDate).toLocaleDateString('ja-JP')}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                    <Box>
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleView(project.id)}
                      >
                        詳細
                      </Button>
                    </Box>
                    {user?.role === 'admin' && (
                      <Box>
                        {isMobile ? (
                          <>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(project.id)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(project)}
                              color="error"
                            >
                              <Delete />
                            </IconButton>
                          </>
                        ) : (
                          <>
                            <Button
                              size="small"
                              startIcon={<Edit />}
                              onClick={() => handleEdit(project.id)}
                              sx={{ mr: 1 }}
                            >
                              編集
                            </Button>
                            <Button
                              size="small"
                              startIcon={<Delete />}
                              onClick={() => handleDeleteClick(project)}
                              color="error"
                            >
                              削除
                            </Button>
                          </>
                        )}
                      </Box>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* 削除確認ダイアログ */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          プロジェクトの削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            「{projectToDelete?.name}」を削除しますか？この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>キャンセル</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProjectsPage
