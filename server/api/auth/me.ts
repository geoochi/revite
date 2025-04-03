import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async event => {
  try {
    const token = event.headers.get('authorization')?.split(' ')[1]
    if (!token) return createError({ statusCode: 400, statusMessage: 'No token provided' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string }
    const user = await prisma.user.findUnique({ where: { email: decoded.email } })
    if (!user) return createError({ statusCode: 400, statusMessage: 'User not found' })
    return { user: { id: user.id, email: user.email, name: user.name, image: user.image } }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) return createError({ statusCode: 400, statusMessage: 'Token expired' })
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
