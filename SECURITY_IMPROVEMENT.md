# セキュリティ改善とユーザー登録機能

## 現在のセキュリティ課題

### ❌ 問題点
1. **ハードコーディングされたユーザー情報** - GitHubに公開されている
2. **平文パスワード** - 暗号化されていない
3. **固定アカウントのみ** - 新規登録不可
4. **Mock実装** - 実際のデータベースなし

### ✅ 改善案

## 1. 環境変数の活用
```bash
# .env.example (GitHub用テンプレート)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Projects CRUD Dashboard

# .env.local (実際の設定 - Gitignore対象)
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Projects CRUD Dashboard
DEFAULT_ADMIN_EMAIL=admin@yourdomain.com
DEFAULT_ADMIN_PASSWORD=your-secure-password
```

## 2. 新規ユーザー登録API設計
```typescript
interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface RegisterResponse {
  user: User
  token: string
  message: string
}
```

## 3. バックエンド実装（Spring Boot例）
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
        @RequestBody RegisterRequest request
    ) {
        // パスワードハッシュ化
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        
        // ユーザー作成
        User user = userService.createUser(
            request.getName(),
            request.getEmail(),
            hashedPassword
        );
        
        // JWT生成
        String token = jwtService.generateToken(user);
        
        return ResponseEntity.ok(new RegisterResponse(user, token));
    }
}
```

## 4. フロントエンド改善案
- ユーザー登録ページの追加
- パスワード強度チェック
- メール認証機能
- 二段階認証（オプション）

## 5. セキュリティベストプラクティス
- パスワードハッシュ化（bcrypt）
- JWT有効期限設定
- HTTPS通信
- CORS設定
- 入力値検証・サニタイズ
- レート制限

## 6. データベース設計
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 7. 段階的実装計画
1. **Phase 1**: 環境変数化とテンプレート作成
2. **Phase 2**: 新規登録画面の実装
3. **Phase 3**: バックエンドAPI開発
4. **Phase 4**: セキュリティ強化（ハッシュ化、JWT改善）
5. **Phase 5**: メール認証・二段階認証
