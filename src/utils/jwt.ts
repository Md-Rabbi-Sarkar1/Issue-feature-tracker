import config from "../config";
import type { LUser, RUser, SUser, TUser } from "../types";
import jwt from "jsonwebtoken"
export const signToken = (payload: SUser)=>{
const accessToken = jwt.sign(payload,config.accessSecret,{
    expiresIn:'2d'
})
return {accessToken}
}