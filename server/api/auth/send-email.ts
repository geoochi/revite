import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const prisma = new PrismaClient()

const sendEmailSchema = z.object({
  email: z.string().email(),
})

interface EmailOptions {
  to: string
  subject: string
  url: string
}

async function resendSendEmail({ to, subject, url }: EmailOptions) {
  console.log(`to: ${to}\nsubject: ${subject}`)
  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.MY_EMAIL_NAME} <${process.env.MY_EMAIL_ADDRESS}>`,
      to: [to],
      subject: subject,
      html: `<div><p>Click the link below to verify your email:</p><button style=" background-color: #8cdd76; border-radius: 4px; border: 0; width: 100px; height: 40px; " ><a style=" text-decoration: none; color: white; font-size: 24px; line-height: 32px; " href="${url}" >Verify </a></button></div>`,
    })

    if (error) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err }, { status: 500 })
  }
}

export default defineEventHandler(async event => {
  try {
    const data = sendEmailSchema.parse(await readBody(event))
    const user = await prisma.user.findUnique({ where: { email: data.email } })
    if (!user) {
      return createError({
        statusCode: 400,
        statusMessage: 'User not found',
      })
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
      url: `${event.node.req.headers.origin}/verify?token=${verifyToken}`,
    })
    console.log(resendResponse)
    return { message: 'Email sent' }
  } catch (error) {
    console.error(error)
    return createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
