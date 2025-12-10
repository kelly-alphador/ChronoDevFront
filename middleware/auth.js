export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();

  if (!authStore.isAuthenticated && to.path !== '/login') {
    return navigateTo('/login');
  }

  if (authStore.isAuthenticated && authStore.isTokenExpired) {
    authStore.logout();
    return navigateTo('/login');
  }

  // Redirection selon rôle pour pages protégées
  const role = authStore.user?.role;
  if (role === 'manager' && !['/', '/projet', '/users', '/notification'].includes(to.path)) {
    return navigateTo('/');
  }
  if (role === 'chefprojet' && !['/dashboard', '/calendrier', '/projet'].includes(to.path)) {
    return navigateTo('/dashboard');
  }
  if (role === 'developpeur' && !['/dashboard', '/calendrier'].includes(to.path)) {
    return navigateTo('/dashboard');
  }
});
