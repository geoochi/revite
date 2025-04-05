import express from 'express'
import authRoutes from './auth'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
