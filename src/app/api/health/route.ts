// ═══════════════════════════════════════════════════════
// NYA Santé - Health Check API (for fly.io)
// ═══════════════════════════════════════════════════════

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    return NextResponse.json({
      status: 'ok',
      app: 'NYA Santé',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}