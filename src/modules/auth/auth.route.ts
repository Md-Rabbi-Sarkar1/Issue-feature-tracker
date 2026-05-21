import { Router } from "express"
import { logIn, signUp } from "./auth.controller"

const router = Router()
router.post('/auth/signup',signUp)
router.post('/auth/login',logIn)
export const authRoute= router