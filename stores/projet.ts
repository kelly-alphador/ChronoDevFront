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

            // CORRECTION ICI : Retourner la structure correcte
            if (error.response?.data) {
                return {
                    success: false,
                    error: error.response.data.message || error.response.data.errors || "Erreur serveur",
                    data: error.response.data // Ajouter data pour accéder à la réponse complète
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
        async function addTache(tache: {
        nom: string;
        dureeEstimee: number;
        dateDebut: string;
        dateFin: string;
        projetId: number;
    }) {
        try {
            const response = await fetch("https://localhost:44370/api/V1/Tache", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(tache),
            });

            const data = await response.json();
            console.log("Réponse du serveur:", data);

            if (response.ok && data.success && data.statusCode === 200) {
                console.log("Tâche ajoutée avec succès :", data.message);
                return { 
                    success: true, 
                    statusCode: 200,
                    message: data.message,
                    data: data.data 
                };
            } else {
                console.error("Erreur lors de l'ajout :", data.message || data.error);
                return { 
                    success: false, 
                    statusCode: data.statusCode || 400,
                    error: data.message || data.error,
                    message: data.message || data.error
                };
            }
        } catch (err) {
            console.error("Erreur réseau ou serveur :", err);
            return { 
                success: false, 
                statusCode: 500,
                error: "Erreur réseau ou serveur",
                message: "Erreur réseau ou serveur" 
            };
        }
    }
    return { GetIdName, TacheGetProjectId, GetProjectById , DeleteById ,DeleteTacheById ,addProjet,addTache};
});
