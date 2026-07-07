import nodemailer from 'nodemailer'

type ContactBody = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event)

  const name = body.name?.trim()
  const email = body.email?.trim()
  const subject = body.subject?.trim()
  const message = body.message?.trim()

  if (!name || !email || !subject || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: '必須項目が不足しています。',
    })
  }

  const safeSubject = subject.replace(/[\r\n]/g, ' ')
  const config = useRuntimeConfig()

  const transporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: Number(config.smtpPort),
    secure: Number(config.smtpPort) === 465,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
  })

  await transporter.sendMail({
    from: `"Truth Light" <admin@truth-light.jp>`,
    to: 'ai_yumekawa@pm.me',
    replyTo: email,
    subject: `お問い合わせ: ${safeSubject}`,
    text: [
      `名前: ${name}`,
      `メール: ${email}`,
      `件名: ${subject}`,
      '',
      '本文:',
      message,
    ].join('\n'),
  })

  return {
    ok: true,
  }
})