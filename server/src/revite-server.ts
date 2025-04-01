import express from 'express'
import cors from 'cors'
import authRoutes from './auth'
import dotenv from 'dotenv'

dotenv.config()

// console.log('NODE_ENV:', process.env.NODE_ENV)
// console.log('CLIENT_URL:', process.env.CLIENT_URL)
// console.log('PROD_CLIENT_URL:', process.env.PROD_CLIENT_URL)

const app = express()

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.PROD_CLIENT_URL?.replace('/revite', '')
        : process.env.CLIENT_URL,
    credentials: true,
  })
)

app.use(express.json())

app.use('/api/auth', authRoutes)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
