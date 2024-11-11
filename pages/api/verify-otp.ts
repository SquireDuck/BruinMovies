import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(401).json({ message: "OTP has expired" });
    }

    // Clear OTP and expiry
    await usersCollection.updateOne(
      { _id: user._id },
      { $unset: { otp: "", otpExpiry: "" } }
    );

    res.status(200).json({ message: "Sign-in successful", username: user.username });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}