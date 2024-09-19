import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,  // Replace with your SMTP server host
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER, // Replace with your email address
    pass: process.env.SMTP_PASS // Replace with your email password
  }
});

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
  const verificationUrl = `http://localhost:3000/api/sellers/verify-email?token=${verificationToken}`;
  await transporter.sendMail({
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
  });
};

export const resetPasswordEmail = async (email: string, resetToken: string) => {
  const resetPasswordUrl = `http://localhost:3000/api/sellers/password-reset/confirm?token=${resetToken}`;
  await transporter.sendMail({
    to: email,
    subject: 'Email Verification',
    text: `Reset your password by clicking on the following link: ${resetPasswordUrl}`,
  });

}