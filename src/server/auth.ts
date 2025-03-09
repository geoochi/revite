// TODO: stop using universal-middleware and directly integrate server middlewares instead. (Bati generates boilerplates that use universal-middleware https://github.com/magne4000/universal-middleware to make Bati's internal logic easier. This is temporary and will be removed soon.)
import type { Get, UniversalHandler } from '@universal-middleware/core'

import { PrismaClient } from '@prisma/client'
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

// interface SigninRequest extends Request {
//   body: SigninInput
// }

// interface SignupRequest extends Request {
//   body: SignupInput
// }

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
export const signup: Get<[], UniversalHandler<Universal.Context & {}>> = () => async (request, _context, _runtime) => {
  const data = signupSchema.parse((await request.json()) as SignupInput)

  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  })

  if (existingUser) {
    return new Response(JSON.stringify({ error: 'Email already exists' }), {
      status: 400,
    })
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
    },
  })

  // Generate JWT
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })

  return new Response(JSON.stringify({ user, session, accessToken }), {
    status: 200,
  })
}

// Signin
export const signin: Get<[], UniversalHandler<Universal.Context & {}>> = () => async (request, _context, _runtime) => {
  const data = signinSchema.parse((await request.json()) as SigninInput)

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
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 400,
    })
  }

  if (!user || !user.accounts[0]) {
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 400,
    })
  }

  // Check password
  const isValid = await bcrypt.compare(data.password, user.accounts[0].password as string)

  if (!isValid) {
    return new Response(JSON.stringify({ error: 'Invalid password' }), {
      status: 400,
    })
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
    },
  })

  // Generate JWT
  const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' })

  // Remove password from response
  const { accounts, ...userWithoutAccounts } = user

  return new Response(
    JSON.stringify({
      user: userWithoutAccounts,
      session,
      accessToken,
    }),
    { status: 200 }
  )
}

// Signout
export const signout: Get<[], UniversalHandler<Universal.Context & {}>> =
  () => async (request: Request, _context, _runtime) => {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 400,
      })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string
      }
    } catch (error) {
      console.error('token expired')
      return new Response(JSON.stringify({ error: 'Token expired' }), {
        status: 400,
      })
    }

    try {
      await prisma.session.deleteMany({
        where: { userId: decoded?.userId },
      })
    } catch (error) {
      console.error(`delete sessions error, userid: ${decoded?.userId}`)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 401,
      })
    }

    return new Response(JSON.stringify({ message: 'Logged out successfully' }), {
      status: 200,
    })
  }

// Get current user
export const me: Get<[], UniversalHandler<Universal.Context & {}>> =
  () => async (request: Request, _context, _runtime) => {
    const token = request.headers.get('authorization')?.split(' ')[1]
    if (!token) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 400,
      })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: string
      }
    } catch (error) {
      console.error('token expired')
      return new Response(JSON.stringify({ error: 'Token expired' }), {
        status: 400,
      })
    }

    let user
    try {
      user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      })
    } catch (error) {
      console.error(`get user error, userid: ${decoded.userId}`)
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 401,
      })
    }

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 400,
      })
    }

    return new Response(JSON.stringify(user), {
      status: 200,
    })
  }
