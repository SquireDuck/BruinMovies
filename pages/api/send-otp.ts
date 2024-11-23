
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }
  const email = req.body.email.trim();  

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  const newOTP = crypto.randomBytes(3).toString("hex");
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  // Configure your email transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Send OTP via email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Sign-Up OTP for BruinMovies",
    text: `Your OTP is: ${newOTP}. It will expire in 10 minutes.`,
    html: `<p>Your OTP is: <strong>${newOTP}</strong>. It will expire in 10 minutes.</p>`,
  });

  res.status(200).json({ otp: newOTP, otpExpiry });
}