export default defineRouteMiddleware((to) => {
    // Routes publiques qui ne nécessitent pas d'authentification
    const publicRoutes = ['/login', '/']

    // Si la route est publique, laisser passer
    if (publicRoutes.includes(to.path)) {
        return
    }

    // Vérifier si l'utilisateur a un cookie de session valide
    const cookies = useCookie('wo_session')

    // Si pas de cookie et route protégée, rediriger vers login
    if (!cookies.value) {
        return navigateTo('/login')
    }
})
