export interface projectIdName{
    id:number,
    nom:string,
 
}
export interface projectResponse{
    success:boolean,
     data?:projectIdName[],
     error?:string
}