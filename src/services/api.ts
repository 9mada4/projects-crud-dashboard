import axios from 'axios'
import { User, Project, CreateProjectRequest, UpdateProjectRequest, PaginatedResponse } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// リクエストインターセプター：認証トークンを追加
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// レスポンスインターセプター：認証エラーのハンドリング
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Mock データ（実際のAPIが利用できない場合の代替）
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'ウェブサイトリニューアル',
    description: '企業サイトのデザインと機能を全面的に見直し、ユーザビリティの向上と最新技術の導入を行います。レスポンシブデザインの実装とSEO対策も含みます。',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-03-31',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    createdBy: '1',
  },
  {
    id: '2',
    name: 'モバイルアプリ開発',
    description: 'iOS/Android対応のネイティブアプリケーション開発。React Nativeを使用してクロスプラットフォーム対応を実現します。',
    status: 'active',
    startDate: '2024-02-01',
    endDate: '2024-06-30',
    createdAt: '2024-01-25T14:20:00Z',
    updatedAt: '2024-02-01T09:15:00Z',
    createdBy: '1',
  },
  {
    id: '3',
    name: 'データベース最適化',
    description: '既存システムのデータベースパフォーマンスを向上させるためのクエリ最適化とインデックス設計を実施します。',
    status: 'completed',
    startDate: '2023-11-01',
    endDate: '2023-12-31',
    createdAt: '2023-10-25T10:00:00Z',
    updatedAt: '2023-12-31T18:00:00Z',
    createdBy: '1',
  },
  {
    id: '4',
    name: 'セキュリティ監査',
    description: 'システム全体のセキュリティ脆弱性を調査し、必要な対策を実施します。ペネトレーションテストも含みます。',
    status: 'inactive',
    startDate: '2024-03-01',
    endDate: '2024-04-15',
    createdAt: '2024-02-20T14:30:00Z',
    updatedAt: '2024-02-25T09:45:00Z',
    createdBy: '1',
  },
  {
    id: '5',
    name: 'API統合プロジェクト',
    description: '外部APIとの連携機能を開発し、システム間のデータ同期を自動化します。REST API とGraphQL APIに対応します。',
    status: 'active',
    startDate: '2024-02-15',
    endDate: '2024-05-31',
    createdAt: '2024-02-10T11:20:00Z',
    updatedAt: '2024-02-15T16:10:00Z',
    createdBy: '1',
  },
  {
    id: '6',
    name: 'ユーザー認証システム',
    description: 'OAuth 2.0とJWTを使用した安全なユーザー認証システムの構築。多要素認証（MFA）にも対応します。',
    status: 'active',
    startDate: '2024-01-20',
    endDate: '2024-04-20',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    createdBy: '1',
  },
  {
    id: '7',
    name: 'レポート機能開発',
    description: 'ビジネス分析用のレポート機能を開発します。グラフ表示、CSV/PDF出力、自動レポート配信機能を実装します。',
    status: 'completed',
    startDate: '2023-09-01',
    endDate: '2023-11-30',
    createdAt: '2023-08-25T13:15:00Z',
    updatedAt: '2023-11-30T17:30:00Z',
    createdBy: '1',
  },
  {
    id: '8',
    name: 'パフォーマンス改善',
    description: 'システム全体のパフォーマンスを向上させるための最適化プロジェクト。フロントエンドとバックエンドの両方を対象とします。',
    status: 'active',
    startDate: '2024-02-10',
    endDate: '2024-04-30',
    createdAt: '2024-02-05T09:00:00Z',
    updatedAt: '2024-02-10T12:20:00Z',
    createdBy: '1',
  },
  {
    id: '9',
    name: 'CI/CDパイプライン構築',
    description: 'GitHubActionsを使用したCI/CDパイプラインを構築し、自動テスト・デプロイメントを実現します。',
    status: 'active',
    startDate: '2024-01-05',
    endDate: '2024-03-15',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-05T15:30:00Z',
    createdBy: '1',
  },
  {
    id: '10',
    name: 'ドキュメント整備',
    description: 'プロジェクトの技術文書とユーザーマニュアルを整備し、保守性を向上させます。',
    status: 'inactive',
    startDate: '2024-03-10',
    endDate: '2024-05-10',
    createdAt: '2024-03-05T11:45:00Z',
    updatedAt: '2024-03-10T08:20:00Z',
    createdBy: '1',
  },
  {
    id: '11',
    name: 'クラウド移行',
    description: 'オンプレミスからクラウド環境への移行プロジェクト。AWS/Azureを使用して可用性と拡張性を向上させます。',
    status: 'active',
    startDate: '2024-02-20',
    endDate: '2024-07-31',
    createdAt: '2024-02-15T14:00:00Z',
    updatedAt: '2024-02-20T10:15:00Z',
    createdBy: '1',
  },
  {
    id: '12',
    name: 'バックアップシステム',
    description: '自動バックアップシステムの構築と災害復旧計画の策定。データ保護とビジネス継続性を確保します。',
    status: 'completed',
    startDate: '2023-10-01',
    endDate: '2023-12-15',
    createdAt: '2023-09-25T16:30:00Z',
    updatedAt: '2023-12-15T12:45:00Z',
    createdBy: '1',
  },
]

// 認証API
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // Mock実装
    await new Promise(resolve => setTimeout(resolve, 1000)) // API呼び出しをシミュレート
    
    if (email === 'admin@example.com' && password === 'password') {
      return {
        user: {
          id: '1',
          email: 'admin@example.com',
          name: '管理者',
          role: 'admin',
        },
        token: 'mock-jwt-token',
      }
    } else if (email === 'user@example.com' && password === 'password') {
      return {
        user: {
          id: '2',
          email: 'user@example.com',
          name: '一般ユーザー',
          role: 'user',
        },
        token: 'mock-jwt-token-user',
      }
    }
    
    throw new Error('認証に失敗しました')
  },
}

// プロジェクトAPI
export const projectsApi = {
  getProjects: async (page: number = 1, limit: number = 10): Promise<PaginatedResponse<Project>> => {
    // Mock実装
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const projects = mockProjects.slice(startIndex, endIndex)
    
    return {
      data: projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(mockProjects.length / limit),
        totalItems: mockProjects.length,
        itemsPerPage: limit,
      },
    }
  },

  getProject: async (id: string): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const project = mockProjects.find(p => p.id === id)
    if (!project) {
      throw new Error('プロジェクトが見つかりません')
    }
    return project
  },

  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newProject: Project = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: '1', // 現在のユーザーID
    }
    
    mockProjects.unshift(newProject)
    return newProject
  },

  updateProject: async (data: UpdateProjectRequest): Promise<Project> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const index = mockProjects.findIndex(p => p.id === data.id)
    if (index === -1) {
      throw new Error('プロジェクトが見つかりません')
    }
    
    const updatedProject = {
      ...mockProjects[index],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    
    mockProjects[index] = updatedProject
    return updatedProject
  },

  deleteProject: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockProjects.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('プロジェクトが見つかりません')
    }
    
    mockProjects.splice(index, 1)
  },
}
