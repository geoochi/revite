import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const signupSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6),
})

export default defineEventHandler(async event => {
  try {
    const data = signupSchema.parse(await readBody(event))
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (existingUser) {
      return createError({
        statusCode: 400,
        statusMessage: 'Email already exists',
      })
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    await prisma.user.create({ data: { email: data.email, name: data.name, hashedPassword, createdAt: new Date() } })
    return { message: 'User created' }
  } catch (error) {
    console.error(error)
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
