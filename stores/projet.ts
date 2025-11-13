import { defineStore } from "pinia";
import axios  from 'axios';
import {type projectIdName,type projectResponse} from'~/types/project'
export const useProjectStore=defineStore('projet',()=>{
    const config=useRuntimeConfig()
    async function TacheGetProjectId(projectId:number)
    {
        try{
            const response=await axios.get(`${config.public.apiBase}/api/V1/Tache/TacheByProjectId`,{
                params:{projectId}
            })
            return response.data
            console.log("response",response.data);
        }
        catch(error:any)
        {
            return error
            console.log("error",error)
        }
    }
    async function GetIdName():Promise<projectResponse> {
        try{
            const response=await axios.get<projectResponse>(`${config.public.apiBase}/api/V1/Project`);
            const data= response.data
            console.log(data)
            return data
        }
        catch(error:any)
        {
            return {
            success: false,
            error: error.response?.data?.errors?.[0] ?? "Erreur serveur"
            };
        }
    }
    return{GetIdName,TacheGetProjectId};
})