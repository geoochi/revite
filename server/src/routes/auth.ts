import { Router, Request, Response, RequestHandler } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { LoginInput, RegisterInput } from '../types'

interface LoginRequest extends Request {
  body: LoginInput
}

interface RegisterRequest extends Request {
  body: RegisterInput
}

const router = Router()
const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6),
})

// Register
router.post('/register', (async (req: RegisterRequest, res: Response) => {
  try {
    const data = registerSchema.parse(req.body)

    // Check if user exists
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
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Invalid input' })
  }
}) as RequestHandler)

// Login
router.post('/login', (async (req: LoginRequest, res: Response) => {
  try {
    const data = loginSchema.parse(req.body)

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: {
        accounts: {
          where: { providerId: 'credentials' },
        },
      },
    })

    if (!user || !user.accounts[0]) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isValid = await bcrypt.compare(
      data.password,
      user.accounts[0].password as string
    )

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid credentials' })
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
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Invalid input' })
  }
}) as RequestHandler)

// Logout
router.post('/logout', (async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
    }

    // Delete all sessions for user
    await prisma.session.deleteMany({
      where: { userId: decoded.userId },
    })

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}) as RequestHandler)

// Get current user
router.get('/me', (async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}) as RequestHandler)

export default router
