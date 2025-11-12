export interface User {
  email: string
  nom: string
  prenom: string
  role: string
}

export interface LoginResponse {
  success: boolean
  token: string
  email: string
  nom: string
  prenom: string
  role: string
  expiresAt: string
  errors: string[]
}
export interface RegisterResponse{
  success: boolean
  token: string
  email: string
  nom: string
  prenom: string
  role: string
  expiresAt: string
  errors: string[]
}

export interface AuthResult {
  success: boolean
  data?: LoginResponse
  error?: string
}
