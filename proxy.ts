import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const publicRoutes = ['/login', '/whistleblower/report']

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic = publicRoutes.some(route => pathname.startsWith(route))

  if (!req.auth && !isPublic) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
}
