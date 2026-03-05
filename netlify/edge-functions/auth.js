export default async (request, context) => {
  const auth = request.headers.get('authorization')

  // Allow public assets and Netlify internals through without auth
  const url = new URL(request.url)
  const publicPaths = ['/_nuxt/', '/__nuxt/', '/favicon.ico']
  if (publicPaths.some(p => url.pathname.startsWith(p))) {
    return context.next()
  }

  if (auth !== 'Bearer demo-secret') {
    return new Response('Unauthorized', { status: 401 })
  }

  return context.next()
}
