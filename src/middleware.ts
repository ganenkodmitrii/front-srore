import { NextRequest, NextResponse } from 'next/server'

import acceptLanguage from 'accept-language'

import { fallbackLng, languages } from '@/src/i18n'

import { COOKIE_LANGUAGE } from './app-constants'

acceptLanguage.languages(languages)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
}

export function middleware(request: NextRequest) {
  let lng
  if (request.cookies.has(COOKIE_LANGUAGE)) lng = acceptLanguage.get(request?.cookies?.get?.(COOKIE_LANGUAGE)?.value)
  if (!lng) lng = acceptLanguage.get(request.headers.get('Accept-Language'))
  if (!lng) lng = fallbackLng

  request.cookies.set(COOKIE_LANGUAGE, lng)

  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => request.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !request.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lng}${request.nextUrl.pathname}`, request.url))
  }

  if (request.headers.has('referer')) {
    const refererUrl = new URL(request?.headers?.get?.('referer') || '')
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(COOKIE_LANGUAGE, lngInReferer)
    return response
  }

  return NextResponse.next()
}
