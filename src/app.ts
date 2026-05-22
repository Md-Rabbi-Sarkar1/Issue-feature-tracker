import express, { type Application, type Request, type Response } from 'express'
import { authRoute } from './modules/auth/auth.route'
import cookieParser from "cookie-parser";
import { issueRoute } from './modules/issue/issue.route';
import { globalErrorHandler } from './middleware/globalErrorHandler';
import cors from 'cors'
const app: Application = express()
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = ['http://localhost:3000', 'https://itift-server.vercel.app/'];
app.use(cors({
  origin: allowedOrigins
}))
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World')
})
app.use('/api', authRoute)
app.use('/api', issueRoute)
app.use(globalErrorHandler)
export default app