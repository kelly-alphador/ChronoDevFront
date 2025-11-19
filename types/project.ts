export interface projectIdName{
    id:number,
    nom:string,
 
}
export interface projectResponse{
    success:boolean,
     data?:projectIdName[],
     error?:string
}
export interface Projet {
  id?: number;        
  nom: string;
  dateCreation: Date;  
  dureeEstimee: number;
  dateFin: Date;       
  managerId: number;
}
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | string[];
}