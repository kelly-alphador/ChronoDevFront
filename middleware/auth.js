export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  // Si pas connecté et qu'on n'est pas sur la page login
  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login');
  }
  
  // Si connecté et qu'on est sur la page login
  if (authStore.isAuthenticated && to.path === '/login') {
    return navigateTo('/');
  }
  
  // Vérifier si le token est expiré
  if (authStore.isAuthenticated && authStore.isTokenExpired) {
    authStore.logout();
    return navigateTo('/login');
  }
});