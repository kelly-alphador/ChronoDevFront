import { defineStore } from "pinia";
import axios from 'axios';
import { type projectIdName, type projectResponse } from '~/types/project';

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

    return { GetIdName, TacheGetProjectId, GetProjectById , DeleteById };
});
