import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Se o usuário não estiver autenticado e tentar acessar uma rota protegida
  if (!session && req.nextUrl.pathname.startsWith('/(protected)')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se o usuário estiver autenticado e tentar acessar a página de login
  if (session && req.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/(protected)/:path*', '/login'],
} 