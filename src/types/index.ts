export type TUser ={
    id: number,
    name: string,
    email: string,
    password: string,
    role?:string,
    created_at: Date,
    updated_at: Date
}
export type RUser = Omit<TUser, "id"|"created_at"|"updated_at">
export type SUser = Omit<TUser,"password">
export type LUser ={
    email:string,
    password:string
}