import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import userRoutes from './routes/users'
import storyRoutes from './routes/stories'
import contributorRoutes from './routes/contributors'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use('/api/users', userRoutes)
app.use('/api/stories', storyRoutes)
app.use('/api/contributors', contributorRoutes)

export default app