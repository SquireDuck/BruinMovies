import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { email, password, username } = req.body;

  try {
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await usersCollection.insertOne({
      email,
      password: hashedPassword,
      username,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: result.insertedId, email }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });
    
    return res.status(201).json({ message: "User created successfully", token, username });
  } catch (error) {
    console.error("Sign-Up Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}