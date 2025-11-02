import { headers } from "next/headers"

/**
 * サーバーコンポーネントで使用する内部API呼び出し用のベースURLを取得
 * 
 * 優先順位:
 * 1. NEXT_PUBLIC_APP_URL環境変数（本番環境で推奨）
 * 2. x-forwarded-host / host ヘッダー
 * 3. localhost:3000（開発環境のフォールバック）
 */
export async function getServerApiBaseUrl(): Promise<string> {
  // 環境変数が設定されている場合はそれを使用（最優先）
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // ヘッダーからホストを取得
  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    
    if (host) {
      const proto = h.get('x-forwarded-proto') || (process.env.VERCEL ? 'https' : 'http')
      return `${proto}://${host}`
    }
  } catch (error) {
    console.warn('⚠️ Failed to get headers:', error)
  }
  
  // フォールバック（開発環境用）
  return 'http://localhost:3000'
}

