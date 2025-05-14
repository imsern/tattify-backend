import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

app.post('/send', async (req, res) => {
  const { navn, email, motiv, beskjed } = req.body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  })

  try {
    await transporter.sendMail({
      from: `"Aliens Tattoo" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_RECEIVER,
      subject: 'Ny henvendelse fra nettsiden',
      text: `
        Navn: ${navn}
        E-post: ${email}
        Motiv: ${motiv}
        Beskjed: ${beskjed}
      `
    })

    res.status(200).send({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500).send({ success: false, error: 'Kunne ikke sende e-post' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`API kjører på port ${PORT}`))
