import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { refreshToken } from './request/Autenticacion';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value
  const token_refresh = req.cookies.get('refresh_token')?.value

  if (!token_refresh) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!token) {

    const nuevoToken = await refreshToken(false)

    if (!nuevoToken.success) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const response = NextResponse.next()
    response.cookies.set({
      name: 'access_token',
      value: nuevoToken.message,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      sameSite: 'strict',
      maxAge: 60,
      path: '/',
    });

    return response
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/','/order'],
};