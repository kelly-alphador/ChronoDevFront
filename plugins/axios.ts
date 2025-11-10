import axios from "axios";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  
  // Créer une instance Axios
  const axiosInstance = axios.create({
    baseURL: config.public.apiBase as string,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Intercepteur de requête - Ajouter le token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = authStore.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Intercepteur de réponse - Gérer les erreurs 401
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token invalide ou expiré
        authStore.logout();
      }
      return Promise.reject(error);
    }
  );
  
  return {
    provide: {
      axios: axiosInstance
    }
  };
});