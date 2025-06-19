export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'completed'
  startDate: string
  endDate?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface CreateProjectRequest {
  name: string
  description: string
  status: 'active' | 'inactive' | 'completed'
  startDate: string
  endDate?: string
}

export interface UpdateProjectRequest extends CreateProjectRequest {
  id: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface ApiError {
  message: string
  code: string
}
