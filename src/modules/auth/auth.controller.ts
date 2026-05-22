import type { Request, Response } from "express"
import { createUser, validateUser } from "./auth.service"
import { sendResponse } from "../../utils/sendResponse"
import { signToken } from "../../utils/jwt"

export const signUp = async (req: Request, res: Response) => {
    const user = await createUser(req.body)
    if (!user) {
        sendResponse(res, { message: "User not created" }, 400)
        return
    }
    sendResponse(res, { message: "User registered successfully", data: user }, 201)
}

export const logIn = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const user = await validateUser(email, password)
    if (!user) {
        sendResponse(res, { message: "Invalid email or pass" }, 401)
        return
    }
    const { accessToken } = signToken(user)
    res.cookie("accessToken", accessToken, {
        sameSite: "lax",
        httpOnly: true,
        secure: false
    })
    const result = {
        token: accessToken,
        user: user
    }
    return sendResponse(res, { message: 'User login successfully', data: result }, 201)
}

