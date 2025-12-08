
import { defineStore } from "pinia";
import axios from "axios";


export interface Projet {
  id: number;
  nom: string;
}

export interface Tache {
  id: number;
  nom: string;
  projetId: number;

}

export const UseCalendarStore = defineStore('Calendar', () => {
  const config = useRuntimeConfig();
 //  méthode pour récupérer les projet
  async function GetProject(): Promise<Projet[]> {
    const response = await axios.get(`${config.public.apiBase}/api/V1/Project`);
    return response.data.data;
  }
  
  //  méthode pour récupérer les tâches par projet
  async function GetTachesByProjectId(projectId: number): Promise<Tache[]> {
    const response = await axios.get(
      `${config.public.apiBase}/api/V1/Tache/TacheByProjectId?projectId=${projectId}`
    );
    return response.data.data;
  }
 
      //Delete Saisie de temps
      async function deleteSaisieTemps(id: number) {
        try {
          const response = await fetch(`https://localhost:44370/api/v1/saisies-temps/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
          }
          
          const data = await response.json();
          return data; // Retourne { statusCode: 200, success: true, message: "...", data: null }
        } catch (error) {
          console.error('Erreur lors de la suppression de la saisie temps:', error);
          throw error;
        }
      }
  //Ajout de saisieTemps
     async function createSaisieTemps(payload: any) {
      try {
        const response = await axios.post(
          `${config.public.apiBase}/api/V1/saisies-temps`,
          payload
        );

        return response.data;
      } catch (error) {
        console.error("Erreur API :", error);
        throw error;
      }
    }
    //select saisiede temps par nom developpeur
    // Dans votre store Calendar
    async function GetSaisiesTemps(username: string) {
      const response = await axios.get(
        `${config.public.apiBase}/api/v1/saisies-temps/developpeur?username=${username}`
      );
      return response.data.data;
    }
  return { GetProject, GetTachesByProjectId,createSaisieTemps,GetSaisiesTemps,deleteSaisieTemps};
});