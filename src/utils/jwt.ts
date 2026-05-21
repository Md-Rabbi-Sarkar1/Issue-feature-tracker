import config from "../config";
import type { LUser, RUser, SUser, TUser } from "../types";
import jwt, { type JwtPayload } from "jsonwebtoken"
export const signToken = (payload: SUser)=>{
const accessToken = jwt.sign(payload,config.accessSecret,{
    expiresIn:'2d'
})
return {accessToken}
}
export const verifyToken = (token: string)=>{
    const decode = jwt.verify(token,config.accessSecret)
    return decode as JwtPayload
}