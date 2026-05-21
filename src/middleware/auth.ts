import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { verifyToken } from "../utils/jwt";
import { getUserById } from "../modules/auth/auth.service";
import type { Role } from "../types";

export const  auth = async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization
    if(!token){
        return sendResponse(res,{message:"token not found"},401)
       
    }
     const payload = verifyToken(token)
     if(!payload){
        return sendResponse(res,{message:"Invalid Token"},401)
     }
     const user = await getUserById(payload.id)
     if(!user){
        return sendResponse (res, {message:"User not found"},404)
     }
     req.user = user
     console.log(req.user)
    next()
}

export const authorizeRole = (...roles: Role[])=>{
   return (req:Request,res: Response, next:NextFunction)=>{
      if(!req.user){
         return sendResponse(res,{message:"unothorize"},401)
      }
      if(!roles.includes(req.user.role)){
         return sendResponse(res,{message:"Have no permission"},403)
      }
      return next()
   }
}