import { Resend } from 'resend'

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
      from: `${process.env.EMAIL_MY_EMAIL_NAME} <${process.env.EMAIL_MY_EMAIL_ADDRESS}>`,
      to: [to],
      subject: subject,
      react: (
        <>
          <p>Click the link below to verify your email:</p>
          <button
            style={{
              backgroundColor: '#8cdd76',
              borderRadius: '4px',
              border: 'none',
              width: '100px',
              height: '40px',
            }}
          >
            <a
              style={{
                textDecoration: 'none',
                color: 'white',
                fontSize: '1.5rem',
              }}
              href={url}
            >
              Verify
            </a>
          </button>
        </>
      ),
    })

    if (error) {
      return Response.json({ error }, { status: 500 })
    }

    return Response.json(data)
  } catch (err) {
    return Response.json({ error: err }, { status: 500 })
  }
}
