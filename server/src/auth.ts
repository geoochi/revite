import { Router, Request, Response, RequestHandler } from 'express'
import { PrismaClient, User } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

interface SigninInput {
  email: string
  password: string
}

interface SignupInput extends SigninInput {
  name?: string
}

interface SigninRequest extends Request {
  body: SigninInput
}

interface SignupRequest extends Request {
  body: SignupInput
}

const router = Router()
const prisma = new PrismaClient()

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signupSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6),
})

// Signup
router.post('/signup', (async (req: SignupRequest, res: Response) => {
  const data = signupSchema.parse(req.body)

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    return res.status(400).json({ error: 'Email already exists' })
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      accounts: {
        create: {
          id: Math.random().toString(36).slice(2, 9),
          accountId: Math.random().toString(36).slice(2, 9),
          providerId: 'credentials',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    },
  })

  // Create session
  const session = await prisma.session.create({
    data: {
      id: Math.random().toString(36).slice(2, 9),
      token: Math.random().toString(36).slice(2, 9),
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    },
  })

  // Generate JWT
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  )

  res.json({ user, session, accessToken })
}) as RequestHandler)

// Signin
router.post('/signin', (async (req: SigninRequest, res: Response) => {
  const data = signinSchema.parse(req.body)

  let user
  try {
    user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        accounts: {
          where: { providerId: 'credentials' },
        },
      },
    })
  } catch (error) {
    console.error(`signin error: ${data.email}`)
    return res.status(400).json({ error: 'Internal server error' })
  }

  if (!user || !user.accounts[0]) {
    return res.status(400).json({ error: 'User not found' })
  }

  // Check password
  const isValid = await bcrypt.compare(
    data.password,
    user.accounts[0].password as string
  )

  if (!isValid) {
    return res.status(400).json({ error: 'Invalid password' })
  }

  // Create session
  const session = await prisma.session.create({
    data: {
      id: Math.random().toString(36).slice(2, 9),
      token: Math.random().toString(36).slice(2, 9),
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      createdAt: new Date(),
      updatedAt: new Date(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    },
  })

  // Generate JWT
  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  )

  // Remove password from response
  const { accounts, ...userWithoutAccounts } = user

  res.json({
    user: userWithoutAccounts,
    session,
    accessToken,
  })
}) as RequestHandler)

// Signout
router.post('/signout', (async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
    }
  } catch (error) {
    console.error('token expired')
    res.status(401).json({ error: 'Token expired' })
  }

  try {
    await prisma.session.deleteMany({
      where: { userId: decoded?.userId },
    })
  } catch (error) {
    console.error(`delete sessions error, userid: ${decoded?.userId}`)
    res.status(401).json({ error: 'Internal server error' })
  }

  res.json({ message: 'Logged out successfully' })
}) as RequestHandler)

// Get current user
router.get('/me', (async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ error: 'No token provided' })
  }

  let decoded
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
    }
  } catch (error) {
    console.error('token expired')
    return res.status(401).json({ error: 'Token expired' })
  }

  let user
  try {
    user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })
  } catch (error) {
    console.error(`get user error, userid: ${decoded.userId}`)
    return res.status(404).json({ error: 'Internal server error' })
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json(user)
}) as RequestHandler)

export default router
