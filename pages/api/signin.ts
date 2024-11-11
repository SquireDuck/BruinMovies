import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import nodemailer from "nodemailer";
import crypto from "crypto";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Signin handler called");
  console.log('Email User:', process.env.EMAIL_USER);
  console.log('Email Pass set:', !!process.env.EMAIL_PASS);
  console.log('Email Pass length:', process.env.EMAIL_PASS?.length);
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Save OTP to user document
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { otp, otpExpiry } }
    );

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true // Enable debug logs
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Sign-in Verification Code',
      text: `Your verification code is: ${otp}. This code will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: "Credentials verified. Please check your email for the verification code.", 
      requiresOTP: true 
    });
  } catch (error) {
    console.error("Sign-In Error:", error as Error);
    console.error("Error details:", JSON.stringify(error as Error, null, 2));
    res.status(500).json({ message: "Internal server error", error: (error as Error).message });
  }
}