import { defineStore } from 'pinia'
import axios from 'axios'

export interface ValidationDto {
  dateValidation?: string
  decision: 'VALIDEE' | 'REFUSEE'
  saisieDeTempsId: number
  commentaire?: string
  managerId: number
}

export interface ValidationResponse {
  success: boolean
  message: string
  data?: any
}

export const useValidationStore = defineStore('validation', () => {
  const config = useRuntimeConfig()

  // Méthode unique pour valider OU refuser une saisie
  async function validerOuRefuserSaisie(
    saisieId: number, 
    managerId: number, 
    decision: 'VALIDEE' | 'REFUSEE',
    commentaire?: string
  ): Promise<ValidationResponse> {
    const dto: ValidationDto = {
      dateValidation: new Date().toISOString(),
      decision: decision,
      saisieDeTempsId: saisieId,
      commentaire: commentaire || (decision === 'VALIDEE' ? 'Validé' : 'Refusé'),
      managerId: managerId
    }

    try {
      const response = await axios.post(
        `${config.public.apiBase}/api/V1/Validation`,
        dto
      )

      return {
        success: true,
        message: decision === 'VALIDEE' 
          ? 'Saisie validée avec succès' 
          : 'Saisie refusée',
        data: response.data
      }
    } catch (error: any) {
      console.error('Erreur lors de la validation/refus:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors de la validation'
      }
    }
  }

  // Méthodes helper pour faciliter l'utilisation
  async function validerSaisie(saisieId: number, managerId: number, commentaire?: string) {
    return await validerOuRefuserSaisie(saisieId, managerId, 'VALIDEE', commentaire)
  }

  async function refuserSaisie(saisieId: number, managerId: number, commentaire?: string) {
    return await validerOuRefuserSaisie(saisieId, managerId, 'REFUSEE', commentaire)
  }

  return {
    validerOuRefuserSaisie,
    validerSaisie,
    refuserSaisie
  }
})