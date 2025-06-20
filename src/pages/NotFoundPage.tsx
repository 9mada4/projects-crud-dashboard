import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
} from '@mui/material'
import { Home, ArrowBack } from '@mui/icons-material'

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  const handleGoHome = () => {
    navigate('/projects')
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            ページが見つかりません
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            お探しのページは削除されたか、URLが間違っている可能性があります。
          </Typography>
          
          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={handleGoHome}
            >
              ホームに戻る
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleGoBack}
            >
              前のページに戻る
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}

export default NotFoundPage
