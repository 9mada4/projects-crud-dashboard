# Projects CRUD Dashboard

React + TypeScript + MUI を用いて、プロジェクト管理を対象に Create / Read / Update / Delete（CRUD）操作が行えるシングルページ Web アプリケーションです。

## 📋 実装された機能

### ✅ 完了済み機能

- **認証システム**
  - ログイン機能（デモアカウント対応）
  - ユーザーロール管理（一般ユーザー・管理者）
  - 自動ログイン（トークン保存）

- **プロジェクト管理**
  - プロジェクト一覧表示（10件ページング）
  - プロジェクト詳細表示
  - プロジェクト新規作成（管理者のみ）
  - プロジェクト編集（管理者のみ）
  - プロジェクト削除（管理者のみ）
  - ステータス管理（アクティブ・非アクティブ・完了）

- **レスポンシブデザイン**
  - 360px〜1200px対応
  - モバイルファーストデザイン
  - MUIコンポーネントによる統一デザイン

- **バリデーション**
  - フォーム入力検証（Zod + React Hook Form）
  - 必須項目チェック
  - エラーメッセージ表示

- **状態管理**
  - Redux Toolkit による状態管理
  - モックAPIによるデータ操作

## 🚀 セットアップ・実行方法

### 前提条件
- Node.js 18.x 以上
- npm または yarn

### インストール・実行
```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# テスト実行
npm run test

# Lint実行
npm run lint
```

### デモアカウント
- **管理者**: admin@example.com / password
- **一般ユーザー**: user@example.com / password

## 🎯 要件定義

### 1. ユーザーストーリー
- 一般ユーザとして、ログイン後にプロジェクト一覧を閲覧したい。その際 10 件ずつページングできる。
- 管理者として、プロジェクトを新規作成・編集・削除できる。

### 2. 受け入れ基準
- ✅ 一覧画面は 360px〜1200px の幅でレイアウト崩れなく表示される。
- ✅ 新規作成フォームで name が空欄の場合、エラーメッセージが出る。

## 🛠 技術スタック

| 区分 | 技術 / ライブラリ | バージョン | 用途 |
|------|-------------------|------------|------|
| **フロントエンド** | React | 18.x | UI 描画 |
| | TypeScript | 5.x | 型安全 |
| | Vite | 5.x | 開発・ビルド |
| | MUI (Material UI) | 5.x | UI コンポーネント |
| | React Router | 6.x | ルーティング |
| | Axios | 1.x | REST 通信 |
| | React Hook Form + Zod | 7.x / 3.x | フォーム & バリデーション |
| | Redux Toolkit | 2.x | グローバル状態管理 |
| **テスト** | Vitest + React Testing Library | - | 単体・結合テスト |
| **Lint/Format** | ESLint, Prettier | - | コード品質 |

## 📱 画面一覧

| 画面ID | 画面名 | URL | 機能概要 |
|--------|--------|-----|----------|
| P01 | ログイン | /login | トークン認証 |
| P02 | プロジェクト一覧 | /projects | ページング・検索・並べ替え |
| P03 | プロジェクト詳細 | /projects/:id | 詳細閲覧 |
| P04 | プロジェクト新規作成 | /projects/new | 入力フォーム |
| P05 | プロジェクト編集 | /projects/:id/edit | 既存データ編集 |
| P06 | 404 | * | Not Found 画面 |

## 🏗 アーキテクチャ

```
Client (React SPA)
   │  HTTPS JSON (REST)
Mock API Service
   │  Local Storage
Browser Storage
```

## 📂 プロジェクト構成

```
src/
├─ components/          # 共通コンポーネント
│  ├─ Layout.tsx       # レイアウト
│  └─ ProtectedRoute.tsx # 認証ガード
├─ contexts/           # React Context
│  └─ AuthContext.tsx  # 認証コンテキスト
├─ pages/             # ページコンポーネント
│  ├─ LoginPage.tsx
│  ├─ ProjectsPage.tsx
│  ├─ ProjectDetailPage.tsx
│  ├─ ProjectCreatePage.tsx
│  ├─ ProjectEditPage.tsx
│  └─ NotFoundPage.tsx
├─ services/          # API サービス
│  └─ api.ts          # Mock API
├─ store/             # Redux Store
│  ├─ store.ts
│  └─ slices/
│     ├─ authSlice.ts
│     └─ projectsSlice.ts
├─ types/             # 型定義
│  └─ index.ts
└─ main.tsx           # エントリーポイント
```

## 🎨 デザインシステム

- **カラーパレット**: Material Design準拠
- **ブレークポイント**: 
  - xs: 0px
  - sm: 360px 
  - md: 768px
  - lg: 1024px
  - xl: 1200px
- **フォント**: Roboto (MUIデフォルト)

## 🔧 開発情報

- **開発サーバー**: http://localhost:3000
- **Mock API**: ローカルメモリ内でのデータ管理
- **認証**: JWT トークンシミュレーション
- **状態管理**: Redux Toolkit + RTK Query

## 📝 今後の拡張予定

- [ ] 実際のバックエンドAPI連携
- [ ] 検索・フィルタリング機能
- [ ] ソート機能
- [ ] エクスポート機能（CSV/PDF）
- [ ] ダークテーマ対応
- [ ] 国際化（i18n）対応
- [ ] ユニットテストの拡充
- [ ] E2Eテストの実装

## スコープ
	•	対象リソース: “Projects”（案件管理）
	•	ユーザロール: 一般ユーザ（閲覧・編集可）、管理者（全権限）
	•	バックエンド: Spring Boot (Java) で REST API を提供（Mock サーバー切替可）
	•	デプロイ: フロントは Netlify、API は Render へ無料枠デプロイ

## 技術スタック

区分	技術 / ライブラリ	バージョン	核心用途
フロント	React	18.x	UI 描画
	TypeScript	5.x	型安全
	Vite	5.x	開発ビルド
	MUI (Material UI)	5.x	UI コンポーネント
	React Router	6.x	ルーティング
	Axios	1.x	REST 通信
	React Hook Form + Zod	7.x / 3.x	フォーム & バリデーション
	Redux Toolkit + RTK Query	2.x	グローバル状態管理 & API キャッシュ
テスト	Vitest + React Testing Library	─	単体・結合テスト
Lint/Format	ESLint, Prettier	─	コード品質
CI	GitHub Actions	─	Lint/Test 自動実行
バックエンド	Spring Boot	3.x	REST API
DB	H2 (dev) / PostgreSQL (prod)	─	RDB

## アーキテクチャ概要

Client (React SPA)
   │  HTTPS JSON (REST)
API Gateway (Spring Boot)
   │  JDBC
PostgreSQL

## 画面一覧

画面ID	画面名	URL	機能概要
P01	ログイン	/login	トークン認証
P02	プロジェクト一覧	/projects	ページング・検索・並べ替え
P03	プロジェクト詳細	/projects/:id	詳細閲覧
P04	プロジェクト新規作成	/projects/new	入力フォーム
P05	プロジェクト編集	/projects/:id/edit	既存データ編集
P06	404	*	Not Found 画面

## コンポーネント構成

App
├─ AuthProvider (Context)
├─ Layout
│   ├─ Header
│   └─ Main
│       ├─ ProjectListPage
│       │   ├─ ProjectTable
│       │   └─ ProjectSearchBar
│       ├─ ProjectFormPage
│       │   └─ ProjectForm
│       └─ ProjectDetailPage
└─ Router

## API 仕様

メソッド	エンドポイント	説明	Req Body	Res (200)
POST	/api/auth/login	ログイン	{email,password}	{token,user}
GET	/api/projects	一覧取得（?page,?q）	なし	{items[],total}
GET	/api/projects/{id}	詳細取得	なし	Project
POST	/api/projects	新規作成	ProjectNew	Project
PUT	/api/projects/{id}	更新	ProjectUpdate	Project
DELETE	/api/projects/{id}	削除	なし	204 No Content

データモデル

interface Project {
  id: number;
  name: string;
  owner: string;
  status: "planning" | "active" | "completed";
  startDate: string; // ISO8601
  endDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

## 非機能要件
	•	レスポンシブ: 最小幅 360px まで対応
	•	アクセシビリティ: WCAG 2.1 AA を目標
	•	パフォーマンス: Lighthouse Performance ≥ 85
	•	セキュリティ: JWT 認証、CORS 制御

## バリデーション

フィールド	ルール	メッセージ
name	必須、最大50文字	“プロジェクト名を入力してください”
owner	必須、Email形式	“メールアドレスが正しくありません”
startDate	必須、日付	“開始日を入力してください”
endDate	startDate 以上	“終了日は開始日以降を指定”

## エラーハンドリング
	•	HTTP 4xx/5xx: Snackbar でユーザ通知、再試行ボタン
	•	クライアント: Zod でスキーマ検証しフォームにエラー表示

## テスト計画

レイヤ	ツール	カバレッジ目標
単体	Vitest	80% Lines
UIスナップショット	RTL + Storybook	主要画面
E2E	Playwright	CRUD主要シナリオ

## CI/CD

name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test -- --coverage
      - run: pnpm build

Netlify Deploy Hook + GitHub Actions で自動デプロイ。

## スケジュール例

週	タスク
1	環境構築・UIフレーム実装
2	CRUD API 実装・一覧画面
3	詳細／編集フォーム・バリデーション
4	テスト整備・デプロイ・ドキュメント整理

## 参考資料
	•	Official React Docs
	•	MUI Getting Started
	•	Spring Boot Guide

⸻

最終的な成果物は GitHub リポジトリ、デプロイ URLで提出する。
