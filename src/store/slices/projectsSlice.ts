import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Project, PaginatedResponse } from '../../types'

interface ProjectsState {
  projects: Project[]
  currentProject: Project | null
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  isLoading: boolean
  error: string | null
}

const initialState: ProjectsState = {
  projects: [],
  currentProject: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  isLoading: false,
  error: null,
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    fetchProjectsStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    fetchProjectsSuccess: (state, action: PayloadAction<PaginatedResponse<Project>>) => {
      state.projects = action.payload.data
      state.pagination = action.payload.pagination
      state.isLoading = false
    },
    fetchProjectsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    setCurrentProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects.unshift(action.payload)
      state.pagination.totalItems += 1
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = action.payload
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter(p => p.id !== action.payload)
      state.pagination.totalItems -= 1
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null
      }
    },
  },
})

export const {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  setCurrentProject,
  clearCurrentProject,
  addProject,
  updateProject,
  deleteProject,
} = projectsSlice.actions

export default projectsSlice.reducer
