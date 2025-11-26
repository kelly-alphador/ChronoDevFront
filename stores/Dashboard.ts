import { defineStore } from "pinia";
import axios from "axios";
import { type HeuresSemaineDTO } from "~/types/Dashboard";

export const UseDashboardStore = defineStore('Dashboard', () => {
    const config = useRuntimeConfig();

    async function GetDataHeurSemaine(
        dateDebut: Date | string,
        dateFin: Date | string
    ): Promise<HeuresSemaineDTO[]> {

        try {
            const response = await axios.get(
                `${config.public.apiBase}/api/v1/saisies-temps/heures-semaine`,
                {
                    params: {
                        debut: dateDebut,
                        fin: dateFin
                    }
                }
            );

            return response.data as HeuresSemaineDTO[];
        }
        catch (error: any) {
            console.log("error", error);
            return [];
        }
    }
    async function GetDataHeurMois(
        annee: string,
        mois: string
    ): Promise<HeuresSemaineDTO[]> {

        try {
            const response = await axios.get(
                `${config.public.apiBase}/api/v1/saisies-temps/heures-par-mois`,
                {
                    params: {
                        annee: annee,
                        mois: mois
                    }
                }
            );

            return response.data as HeuresSemaineDTO[];
        }
        catch (error: any) {
            console.log("error", error);
            return [];
        }
    }

    return { GetDataHeurSemaine , GetDataHeurMois};
});
