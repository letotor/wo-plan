/**
 * Edge function — protège /wo-plan.html par cookie de session signé (HMAC-SHA256).
 * Les routes publiques (/login.html, /api/auth-login) passent sans vérification.
 */

const PROTECTED_PREFIX = '/wo-plan'
const PUBLIC_PATHS     = ['/login', '/login.html']
const TOKEN_TTL_MS     = 86_400_000 // 24h

export default async (request, context) => {
  const url = new URL(request.url)

  // Routes publiques : login page + endpoint d'auth
  if (PUBLIC_PATHS.some(p => url.pathname === p || url.pathname === p + '.html')) {
    return context.next()
  }

  // Uniquement protéger /wo-plan.html (et sous-chemins si besoin)
  if (!url.pathname.startsWith(PROTECTED_PREFIX)) {
    return context.next()
  }

  const secret = context.env.SESSION_SECRET
  if (!secret) {
    return new Response('Server misconfigured', { status: 500 })
  }

  const token = getCookie(request.headers.get('cookie') || '', 'wo_session')
  if (!token || !(await verifyToken(token, secret))) {
    // Pas de cookie valide : on sert quand même la page (le lock screen JS prend le relais)
    // L'edge function bloque uniquement les bots/curl qui n'auraient pas de cookie.
    return new Response('Unauthorized', { status: 401 })
  }

  return context.next()
}

// ── helpers ──────────────────────────────────────────────────────────────────

function getCookie(cookieHeader, name) {
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`))
  return match ? match[1] : null
}

async function verifyToken(token, secret) {
  const dotIdx = token.indexOf('.')
  if (dotIdx === -1) return false

  const timestamp = token.slice(0, dotIdx)
  const hmac      = token.slice(dotIdx + 1)

  const ts = parseInt(timestamp, 10)
  if (isNaN(ts) || Date.now() - ts > TOKEN_TTL_MS) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sigBuf  = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(timestamp))
  const expected = [...new Uint8Array(sigBuf)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Comparaison résistante au timing
  return safeEqual(hmac, expected)
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}
