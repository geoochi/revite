import { Router, Request, Response, RequestHandler } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { resendSendEmail } from './email'

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

interface SendEmailRequest extends Request {
  body: { email: string }
}

interface VerifyEmailRequest extends Request {
  body: { token: string }
}

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const signupSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email(),
  password: z.string().min(6),
})

const sendEmailSchema = z.object({
  email: z.string().email(),
})

const verifyEmailSchema = z.object({
  token: z.string(),
})

const baseUrl = process.env.NODE_ENV === 'production' ? process.env.PROD_CLIENT_URL : process.env.CLIENT_URL
const router = Router()
const prisma = new PrismaClient()

// Signup
router.post('/signup', (async (req: SignupRequest, res: Response) => {
  try {
    const data = signupSchema.parse(req.body)
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    await prisma.user.create({ data: { email: data.email, name: data.name, hashedPassword, createdAt: new Date() } })
    res.json({ message: 'User created' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}) as RequestHandler)

// Send email
router.post('/send-email', (async (req: SendEmailRequest, res: Response) => {
  try {
    const data = sendEmailSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }
    const verifyToken = jwt.sign(
      { email: user.email, random: Math.random().toString(36).substring(2, 18) },
      process.env.JWT_SECRET as string,
      { expiresIn: '600s' }
    )
    await prisma.user.update({ where: { id: user.id }, data: { verifyToken } })
    const resendResponse = await resendSendEmail({
      to: data.email,
      subject: 'Verify your email address',
      url: `${baseUrl}/#/verify?token=${verifyToken}`,
    })
    console.log(resendResponse)
    res.json({ message: 'Email sent' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}) as RequestHandler)

// Verify email
router.post('/verify-email', (async (req: VerifyEmailRequest, res: Response) => {
  try {
    const data = verifyEmailSchema.parse(req.body)
    const decoded = jwt.verify(data.token, process.env.JWT_SECRET as string) as { email: string }
    const user = await prisma.user.findUnique({ where: { email: decoded.email } })
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }
    if (user.verifyToken !== data.token) {
      return res.status(400).json({ error: 'Token expired' })
    }
    await prisma.user.update({ where: { id: user.id }, data: { emailVerified: true } })
    const accessToken = jwt.sign(
      { email: user.email, random: Math.random().toString(36).substring(2, 18) },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1d',
      }
    )
    res.json({
      user: { id: user.id, email: user.email, name: user.name, emailVerified: true, image: user.image },
      accessToken,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}) as RequestHandler)

// Signin
router.post('/signin', (async (req: SigninRequest, res: Response) => {
  try {
    const data = signinSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      return res.status(400).json({ error: 'Invalid user' })
    }
    const isValid = await bcrypt.compare(data.password, user.hashedPassword)
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid password' })
    }
    if (!user.emailVerified) {
      return res.status(400).json({ error: 'Email not verified' })
    }
    const accessToken = jwt.sign(
      { email: user.email, random: Math.random().toString(36).substring(2, 18) },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    )
    res.json({
      user: { id: user.id, email: user.email, name: user.name, image: user.image },
      accessToken,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}) as RequestHandler)

// Signout
router.post('/signout', (async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(400).json({ error: 'No token provided' })
    }
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}) as RequestHandler)

// Get current user
router.get('/me', (async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(400).json({ error: 'No token provided' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { email: string }
    const user = await prisma.user.findUnique({ where: { email: decoded.email } })
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }
    res.json({ user: { id: user.id, email: user.email, name: user.name, image: user.image } })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ error: 'Token expired' })
    }
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}) as RequestHandler)

export default router
