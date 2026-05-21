import { Router } from "express"
import { signUp } from "./auth.controller"

const router = Router()
router.post('/auth/signup',signUp)
export const authRoute= router