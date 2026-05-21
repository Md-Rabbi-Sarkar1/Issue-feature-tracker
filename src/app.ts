import express, { type Application, type Request, type Response } from 'express'
import { authRoute } from './modules/auth/auth.route'
import cookieParser from "cookie-parser";

const app:Application = express()
app.use(express.json())
app.use(cookieParser())
app.get('/', (req:Request, res:Response) => {
  res.send('Hello World')
})
app.use('/api',authRoute)

export default app