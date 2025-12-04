
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

  return { GetProject, GetTachesByProjectId };
});