import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { email, password, otp } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find the user
    const user = await usersCollection.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If OTP is provided, verify it
    if (otp) {
      if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Clear OTP after successful verification
      await usersCollection.updateOne({ email }, { $unset: { otp: "", otpExpiry: "" } });
    } else {
      // Generate and send OTP
      const newOTP = crypto.randomBytes(3).toString("hex");
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

      await usersCollection.updateOne({ email }, { $set: { otp: newOTP, otpExpiry } });

      // Send OTP via email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Sign-In OTP for BruinMovies",
        text: `Your OTP is: ${newOTP}. It will expire in 10 minutes.`,
        html: `<p>Your OTP is: <strong>${newOTP}</strong>. It will expire in 10 minutes.</p>`,
      });

      return res.status(200).json({ message: "OTP sent to email", requiresOTP: true });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    return res.status(200).json({
      message: "Sign-in successful",
      token,
      username: user.username
    });
  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}