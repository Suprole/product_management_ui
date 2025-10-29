import { NextResponse } from 'next/server'
import { DashboardResponse } from '@/lib/types'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const from = searchParams.get('from') || undefined
    const to = searchParams.get('to') || undefined
    const grain = (searchParams.get('grain') || undefined) as any

    const base = process.env.GAS_API_BASE
    const key = process.env.GAS_API_KEY
    if (!base || !key) {
      return NextResponse.json({ error: 'server misconfigured' }, { status: 500 })
    }

    const url = new URL(base)
    url.searchParams.set('key', key)
    url.searchParams.set('path', 'dashboard')
    if (from) url.searchParams.set('from', from)
    if (to) url.searchParams.set('to', to)
    if (grain) url.searchParams.set('grain', String(grain))

    const res = await fetch(url.toString(), { cache: 'no-store' })
    const data = (await res.json()) as DashboardResponse & { _status?: number }
    const status = data && (data as any)._status && Number((data as any)._status) >= 400 ? Number((data as any)._status) : res.status
    return NextResponse.json(data, { status })
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 })
  }
}


