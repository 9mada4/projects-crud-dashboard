import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import projectsSlice from './slices/projectsSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    projects: projectsSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
