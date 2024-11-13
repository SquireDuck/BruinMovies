import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { email, password, otp } = req.body;

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find the user
    const user = await usersCollection.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // If OTP verification is needed, verify the OTP
    if (otp) {
      if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      // Clear OTP after successful verification
      await usersCollection.updateOne({ email }, { $unset: { otp: "", otpExpiry: "" } });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET!, {
      expiresIn: "1h", // Token expires in 1 hour
    });

    return res.status(200).json({ message: "Sign-in successful", token, username: user.username });
  } catch (error) {
    console.error("Sign-In Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
