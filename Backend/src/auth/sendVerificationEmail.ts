import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import { UserResource } from '../Resources';

const jwtSecret   = process.env.JWT_SECRET!;
const backendURL  = process.env.BACKEND_URL!;
const smtpHost    = process.env.EMAIL_SMTP_HOST!;
const smtpPort    = Number(process.env.EMAIL_SMTP_PORT);
const smtpUser    = process.env.EMAIL!;
const smtpPass    = process.env.EMAIL_PASS!;

export async function sendVerificationEmail(user: UserResource) {
  const token = jwt.sign(
    { userId: user.id, type: 'email-verification' },
    jwtSecret,
    { expiresIn: '1d' }
  );

  // Link zeigt jetzt direkt aufs Backend
  const url = `${process.env.CORS_ORIGIN}/verify-email?token=${encodeURIComponent(token)}`;

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  await transporter.sendMail({
    from: `"GameCompass" <${smtpUser}>`,
    to:   user.email,
    subject: 'Bitte bestätige deine E-Mail-Adresse',
    html: `
    <p>Hallo ${user.username},</p>
    <p>Klicke auf diesen Link, um deine E-Mail zu bestätigen:<br/>
       <a href="${url}">${url}</a></p>
  `,
});
}
