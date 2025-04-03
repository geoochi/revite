import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const prisma = new PrismaClient()
const verifyEmailSchema = z.object({ token: z.string() })

export default defineEventHandler(async event => {
  try {
    const data = verifyEmailSchema.parse(await readBody(event))
    const decoded = jwt.verify(data.token, process.env.JWT_SECRET as string) as { email: string }
    const user = await prisma.user.findUnique({ where: { email: decoded.email } })
    if (!user) return createError({ statusCode: 400, statusMessage: 'User not found' })
    if (user.verifyToken !== data.token) return createError({ statusCode: 400, statusMessage: 'Token expired' })
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } })
    const accessToken = jwt.sign(
      { email: user.email, random: Math.random().toString(36).substring(2, 18) },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    )
    return {
      user: { id: user.id, email: user.email, name: user.name, emailVerified: true, image: user.image },
      accessToken,
    }
  } catch (error) {
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
