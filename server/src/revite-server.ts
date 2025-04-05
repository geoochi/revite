import express from 'express'
import authRoutes from './auth'
import { join } from 'path'

const app = express()

app.use(express.json())

app.use('/api/auth', authRoutes)

// 404
app.use((req, res) => {
  res.sendFile(join(__dirname, '../templates/404.html'))
})

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`)
})
