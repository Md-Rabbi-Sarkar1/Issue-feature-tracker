import type { Request, Response } from "express"
import { createUser } from "./auth.service"
import { sendResponse } from "../../utils/sendResponse"

export const signUp = async(req:Request,res:Response)=>{
    const user = await createUser(req.body)
    if(!user){
        sendResponse(res,{message:"user not created"},400)
   return
    }
    sendResponse(res,{message: "User created",data:user},201)
} 

