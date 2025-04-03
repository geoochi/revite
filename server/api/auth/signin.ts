import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export default defineEventHandler(async event => {
  try {
    const data = signinSchema.parse(await readBody(event))
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) return createError({ statusCode: 400, statusMessage: 'Invalid user' })
    const isValid = await bcrypt.compare(data.password, user.hashedPassword)
    if (!isValid) return createError({ statusCode: 400, statusMessage: 'Invalid password' })
    if (!user.emailVerified) return createError({ statusCode: 400, statusMessage: 'Email not verified' })
    const accessToken = jwt.sign(
      { email: user.email, random: Math.random().toString(36).substring(2, 18) },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    )
    return {
      user: { id: user.id, email: user.email, name: user.name, image: user.image },
      accessToken,
    }
  } catch (error) {
    console.error(error)
    return createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
