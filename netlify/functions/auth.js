export async function handler(event) {
  const auth = event.headers.authorization

  if (auth !== 'Bearer demo-secret') {
    return {
      statusCode: 401,
      body: 'Unauthorized'
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Protected API access', timestamp: new Date().toISOString() })
  }
}
