export default defineNuxtPlugin(() => {
  const authStore = useAuthStore();
  
  // Initialiser l'authentification depuis localStorage
  authStore.initAuth();
});