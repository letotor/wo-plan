import crypto from 'node:crypto'

const TOKEN_TTL_MS = 86_400_000 // 24h

export async function handler(event) {
  const cookieHeader = event.headers.cookie || ''
  const token = getCookie(cookieHeader, 'wo_session')
  const secret = process.env.SESSION_SECRET

  if (!secret || !token || !verifyToken(token, secret)) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false })
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ok: true })
  }
}

function getCookie(cookieHeader, name) {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? match[1] : null
}

function verifyToken(token, secret) {
  const dotIdx = token.indexOf('.')
  if (dotIdx === -1) return false

  const timestamp = token.slice(0, dotIdx)
  const hmac      = token.slice(dotIdx + 1)

  const ts = parseInt(timestamp, 10)
  if (isNaN(ts) || Date.now() - ts > TOKEN_TTL_MS) return false

  const expected = crypto
    .createHmac('sha256', secret)
    .update(timestamp)
    .digest('hex')

  // Comparaison résistante au timing
  if (hmac.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= hmac.charCodeAt(i) ^ expected.charCodeAt(i)
  return diff === 0
}
