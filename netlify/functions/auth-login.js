import crypto from 'node:crypto'

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let password
  try {
    ;({ password } = JSON.parse(event.body || '{}'))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const expectedPassword = process.env.SITE_PASSWORD
  const sessionSecret    = process.env.SESSION_SECRET

  if (!expectedPassword || !sessionSecret) {
    console.error('Missing env vars SITE_PASSWORD or SESSION_SECRET')
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured' }) }
  }

  if (!password || password !== expectedPassword) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Mot de passe incorrect' })
    }
  }

  // Token : timestamp.HMAC-SHA256(timestamp, SESSION_SECRET)
  const timestamp = Date.now().toString()
  const hmac = crypto
    .createHmac('sha256', sessionSecret)
    .update(timestamp)
    .digest('hex')
  const token = `${timestamp}.${hmac}`

  const isHttps = (event.headers['x-forwarded-proto'] || 'http') === 'https'
  const secureFlag = isHttps ? '; Secure' : ''

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': `wo_session=${token}; HttpOnly${secureFlag}; SameSite=Strict; Path=/; Max-Age=86400`
    },
    body: JSON.stringify({ ok: true })
  }
}
