import { Resend } from 'resend'
import dotenv from 'dotenv'

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailOptions {
  to: string
  subject: string
  url: string
}

export async function resendSendEmail({ to, subject, url }: EmailOptions) {
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
