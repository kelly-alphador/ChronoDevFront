import { defineStore } from "pinia";
import axios from 'axios';
import { type projectIdName, type projectResponse , type Projet, type ApiResponse } from '~/types/project';

export const useProjectStore = defineStore('projet', () => {

    const config = useRuntimeConfig();

    async function TacheGetProjectId(projectId: number) {
        try {
            const response = await axios.get(`${config.public.apiBase}/api/V1/Tache/TacheByProjectId`, {
                params: { projectId }
            });
            return response.data;
        }
        catch (error: any) {
            console.log("error", error);
            return error;
        }
    }

    async function GetIdName(): Promise<projectResponse> {
        try {
            const response = await axios.get<projectResponse>(`${config.public.apiBase}/api/V1/Project`);
            const data = response.data;
            return data;
        }
        catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.errors?.[0] ?? "Erreur serveur"
            };
        }
    }
     async function addProjet(projet: Projet): Promise<ApiResponse> {
        try {
            const config = useRuntimeConfig()

            const userString = localStorage.getItem("user")
            if (!userString) {
            return { success: false, error: "Utilisateur non authentifié" }
            }

            const user = JSON.parse(userString) as { id: number }
            const managerId = user.id

            const payload = {
            nom: projet.nom,
            dateCreation: projet.dateCreation,
            dureeEstimee: projet.dureeEstimee,
            dateFin: projet.dateFin,
            ManagerId: managerId
            }

            const response = await axios.post<ApiResponse>(
            `${config.public.apiBase}/api/V1/project`,
            payload
            )

            return {
            success: true,
            data: response.data
            }

        } catch (error: any) {
            console.error("Erreur lors de l'ajout du projet :", error)

            if (error.response?.data) {
            return {
                success: false,
                error: error.response.data.errors || error.response.data.message
            }
            }

            return {
            success: false,
            error: error.message || "Erreur inconnue"
            }
        }
    }
    async function DeleteById(id:number) {
        try{
            const response=await axios.delete(`${config.public.apiBase}/api/V1/Project/${id}`)
            console.log("toy aka",response.data)
            return response.data
        }
        catch(error:any)
        {
            console.log("error", error);
            return {
                success: false,
                error: error.response?.data?.errors?.[0] ?? "Erreur serveur"
            };
        }
    }
    async function DeleteTacheById(id:number) {
        try{
            const response=await axios.delete(`${config.public.apiBase}/api/V1/Tache/${id}`)
            console.log("toy aka",response.data)
            return response.data
        }
        catch(error:any)
        {
            console.log("error", error);
            return {
                success: false,
                error: error.response?.data?.errors?.[0] ?? "Erreur serveur"
            };
        }
    }
    async function GetProjectById(id: number) {
        try {
            const response = await axios.get(`${config.public.apiBase}/api/V1/Project/ProjectById`, {
                params: { id }
            });
            return response.data;
        }
        catch (error: any) {
            console.log("error", error);
            return {
                success: false,
                error: error.response?.data?.errors?.[0] ?? "Erreur serveur"
            };
        }
    }

    return { GetIdName, TacheGetProjectId, GetProjectById , DeleteById ,DeleteTacheById ,addProjet};
});
