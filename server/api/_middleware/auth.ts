import type { H3Event } from 'h3'
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event: H3Event) => {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }))
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const secret = useRuntimeConfig().jwtSecret
    const payload = await jwtVerify(token, new TextEncoder().encode(secret))

    event.context.user = payload

  } catch {
    return sendError(event, createError({ statusCode: 401, statusMessage: 'Invalid token' }))
  }
})
