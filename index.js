import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors({ origin: '*' }))
app.use(express.json())

app.post('/send', async (req, res) => {
  const { navn, email, motiv, beskjed, tilTatovør } = req.body

  const transporter = nodemailer.createTransport({
    service: 'gmail', // Kan byttes ut ved behov
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  try {
    await transporter.sendMail({
  from: `"Tattify" <${process.env.MAIL_USER}>`,
  to: tilTatovør || process.env.MAIL_RECEIVER,
  replyTo: email, // sluttbrukerens e-post
  subject: 'Ny henvendelse fra nettsiden',
  text: `
Navn: ${navn}
E-post: ${email}
Motiv: ${motiv}
Melding: ${beskjed}
  `
})
console.log('E-post sendt til:', tilTatovør || process.env.MAIL_RECEIVER)

    res.status(200).send({ success: true })
  } catch (e) {
    console.error('E-postfeil:', e)
    res.status(500).send({ success: false, error: 'Kunne ikke sende e-post' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server kjører på port ${PORT}`))
