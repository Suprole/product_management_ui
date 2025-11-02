# localhost:3000 リダイレクト問題の修正

## 🔍 問題

デプロイしたVercelのドメインを開くと、localhost:3000にリダイレクトされる。

## ✅ 解決策

### ステップ1: Vercelに環境変数を追加

Vercelダッシュボードまたは CLI で以下の環境変数を追加します：

#### Vercelダッシュボードの場合

1. https://vercel.com/dashboard にアクセス
2. プロジェクトを選択
3. **Settings** → **Environment Variables**
4. 以下を追加：

| 変数名 | 値 | 環境 |
|--------|-----|------|
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Production, Preview, Development |

**重要**: `your-app.vercel.app` を実際のVercelドメインに置き換えてください。

#### Vercel CLIの場合

```bash
cd apps/web

# 環境変数を追加
vercel env add NEXT_PUBLIC_APP_URL
# 値を入力: https://your-app.vercel.app
# 環境を選択: Production, Preview, Development (すべて選択)

# 再デプロイ
vercel --prod
```

### ステップ2: 実際のドメインを確認

Vercelのデプロイ完了後、以下の場所でドメインを確認できます：

1. **Vercelダッシュボード**
   - プロジェクト → Deployments → Production
   - 「Visit」ボタンの横に表示されているURL

2. **デプロイログ**
   ```
   ✅ Production: https://your-app-abc123.vercel.app
   ```

### ステップ3: カスタムドメインを使用している場合

カスタムドメイン（例: `myapp.com`）を設定している場合：

```env
NEXT_PUBLIC_APP_URL=https://myapp.com
```

### ステップ4: 確認

1. ブラウザのキャッシュをクリア（Ctrl+Shift+R / Cmd+Shift+R）
2. Vercelのデプロイが完了するまで待つ（数分）
3. アプリにアクセス
4. ブラウザのデベロッパーツール（F12）→ Networkタブで確認：
   - `https://your-app.vercel.app/api/gas/dashboard` が呼ばれているか
   - ❌ `http://localhost:3000/api/gas/dashboard` は呼ばれていないか

## 🔍 デバッグ方法

### 環境変数が正しく設定されているか確認

Vercelのログで確認：

1. Vercel ダッシュボード → Deployments → 最新のデプロイ
2. 「Functions」タブ → ログを確認
3. 以下のログが表示されるはず：

```
✅ Using NEXT_PUBLIC_APP_URL: https://your-app.vercel.app
```

表示されない場合：

```
⚠️ NEXT_PUBLIC_APP_URL not set, falling back to headers
```

### ローカルでテスト

```bash
cd apps/web

# 環境変数を設定
export NEXT_PUBLIC_APP_URL=http://localhost:3000

# 開発サーバーを起動
pnpm dev
```

ターミナルのログで、正しいURLが使用されているか確認してください。

## 📝 技術的な説明

### 修正前

```typescript
// サーバーコンポーネントで
const host = h.get('x-forwarded-host') || h.get('host') || 'localhost:3000'
//                                                           ↑ フォールバック
```

ヘッダーが取得できない場合、`localhost:3000` にフォールバックしていた。

### 修正後

```typescript
// lib/api-url.ts
export async function getServerApiBaseUrl(): Promise<string> {
  // 1. 環境変数を優先（最も信頼できる）
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // 2. ヘッダーから取得
  const host = h.get('x-forwarded-host') || h.get('host')
  if (host) {
    const proto = h.get('x-forwarded-proto') || 'https'
    return `${proto}://${host}`
  }
  
  // 3. 最後のフォールバック（開発環境のみ）
  return 'http://localhost:3000'
}
```

優先順位：
1. **`NEXT_PUBLIC_APP_URL`** （環境変数）← 最優先
2. **ヘッダー** （`x-forwarded-host`など）
3. **localhost:3000** （開発環境用フォールバック）

## ✅ 完了チェックリスト

- [ ] `NEXT_PUBLIC_APP_URL` を Vercel に追加
- [ ] 値は実際のVercelドメイン（`https://`で始まる）
- [ ] Production, Preview, Development すべてに適用
- [ ] Vercelで再デプロイ完了
- [ ] ブラウザキャッシュをクリア
- [ ] アプリにアクセスして動作確認
- [ ] ブラウザのNetworkタブで正しいURLが使われているか確認

## 💡 追加情報

### 開発環境の設定

ローカル開発では、`.env.local` に以下を追加（オプション）：

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 複数環境の管理

- **Production**: `https://myapp.com`
- **Preview**: `https://myapp-git-staging.vercel.app`
- **Development**: `http://localhost:3000`

それぞれの環境に適切な値を設定してください。

---

この修正で、デプロイしたアプリが正しいドメインで動作するようになります！

