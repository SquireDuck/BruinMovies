import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };
    
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    if (req.method === "GET") {
      const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        username: user.username,
        email: user.email
      });
    } else if (req.method === "PUT") {
      const { username, email } = req.body;

      const updateFields: { [key: string]: string } = {};
      if (username) updateFields.username = username;
      if (email) updateFields.email = email;

      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No fields to update" });
      }

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: updateFields }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: "User not found or no changes made" });
      }

      res.status(200).json({ message: "Profile updated successfully" });
    } else {
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
}