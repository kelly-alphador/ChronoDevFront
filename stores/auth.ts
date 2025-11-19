import { defineStore } from 'pinia'
import axios from 'axios'
import { type User, type LoginResponse, type AuthResult, type RegisterResponse } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // STATE
  const token = ref<string | null>(null)
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  // GETTERS (computed)
  const fullName = computed(() =>
    user.value ? `${user.value.prenom} ${user.value.nom}` : ''
  )

  const isTokenExpired = computed(() => {
    if (!token.value) return true

    try {
      const payloadBase64 = token.value?.split('.')[1];
      if (!payloadBase64) return true;
      const payload = JSON.parse(atob(payloadBase64))
      const expirationDate = new Date(payload.exp * 1000)
      return expirationDate < new Date()
    } catch {
      return true
    }
  })

  // ACTIONS
  function initAuth() {
    if (import.meta.client) {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      }
    }
  }
  async function Register(
  nom: string,
  prenom: string,
  email: string,
  role: string,
  password: string,
  passwordConfirm: string
): Promise<AuthResult> {

  const config = useRuntimeConfig();

  try {
    const response = await axios.post<RegisterResponse>(
      `${config.public.apiBase}/api/Auth/register`,
      { nom, prenom, email, role, password, passwordConfirm }
    );

    const data = response.data;

    // Si l'inscription est réussie
    if (data.success && data.token) {
      token.value = data.token;
      user.value = {
        id:data.id,
        email: data.email,
        nom: data.nom,
        prenom: data.prenom,
        role: data.role
      };
      isAuthenticated.value = true;

      //  Sauvegarde dans localStorage (côté client uniquement)
      if (import.meta.client) {
        localStorage.setItem('token', token.value);
        localStorage.setItem('user', JSON.stringify(user.value));
      }

      return { success: true, data };
    }
    else{
        return { success: false, error: 'Identifiants incorrects' };
        console.log("Misy erreur kwh fagany")
    }
    

  } catch (error: any) {
    console.error("Erreur d'inscription :", error);

    return {
      success: false,
      error: error.response?.data?.errors?.[0] ?? "Erreur serveur"
    };
    console.log("error");
  }
}
//Methode pour le login
  async function login(email: string, password: string): Promise<AuthResult> {
    const config = useRuntimeConfig()

    try {
      const response = await axios.post<LoginResponse>(
        `${config.public.apiBase}/api/auth/login`,
        { email, password }
      )

      const data = response.data
      console.log(data);
      if (data.success && data.token) {
        token.value = data.token
        user.value = {
          id:data.id,
          email: data.email,
          nom: data.nom,
          prenom: data.prenom,
          role: data.role,
          
        }
        isAuthenticated.value = true

        if (import.meta.client) {
          console.log("miditra @ stockage token")
          localStorage.setItem('token', data.token)
          localStorage.setItem('user', JSON.stringify(user.value))
        }

        return { success: true, data }
      }
      console.log("identifiant in correcte")
      return { success: false, error: 'Identifiants incorrects' }
    } catch (error: any) {
      console.error('Erreur de connexion:', error)
      return {
        success: false,
        error: error.response.data.errors[0]
      }
    }
  }

  function logout() {
    console.log("je suis appeler")
    token.value = null
    user.value = null
    isAuthenticated.value = false

    if (import.meta.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }

    navigateTo('/login')
  }

  function checkAuth(): boolean {
    if (isTokenExpired.value) {
      logout()
      return false
    }
    return isAuthenticated.value
  }

  return {
    // State
    token,
    user,
    isAuthenticated,
    // Getters
    fullName,
    isTokenExpired,
    // Actions
    initAuth,
    Register,
    login,
    logout,
    checkAuth
  }
})
