import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRoutes from './routes/users'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/api/users', userRoutes)

export default app