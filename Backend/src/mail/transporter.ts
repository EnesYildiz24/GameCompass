// src/mail/transporter.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST!,
  port: Number(process.env.EMAIL_SMTP_PORT!),
  secure: Number(process.env.EMAIL_SMTP_PORT) === 465,   // true bei 465
  auth: {
    user: process.env.EMAIL!,        // Gmail-Adresse
    pass: process.env.EMAIL_PASS!,   // 16-stelliges App-Passwort
  },
});
