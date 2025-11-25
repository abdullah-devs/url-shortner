import { defineEventHandler, getCookie, deleteCookie, sendRedirect, setHeader } from 'h3'
import { decodeJwt } from 'jose'

export default defineEventHandler(async (event) => {
  const path = event.path
  const token = getCookie(event, 'token')

  if (path.startsWith("/api")) {
    return
  }

  const protectedRoutes = path.startsWith('/dashboard')

  if (protectedRoutes || path === '/') {
    const signInUrl = '/login'

    if (!token) {
      return sendRedirect(event, signInUrl)
    }

    const payload = decodeJwt(token) as {
      id: number
      exp: number
    }

    if (path === '/') {
      return sendRedirect(event, '/dashboard')
    }

    const nowSec = Math.floor(Date.now() / 1000)
    if (nowSec >= payload.exp) {
      deleteCookie(event, 'token')
      return sendRedirect(event, signInUrl)
    }

    setHeader(event, 'X-User-Id', payload.id.toString())

    return
  }

  return
})
