import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Missing or invalid token" });
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
        };
    
        const db = await connectToDatabase();
        const usersCollection = db.collection("users");

      const user = await usersCollection.findOne({
        _id: new ObjectId(decoded.userId),
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: {"watched" : "true"} }
      );
      

        res.status(200).json({
             biography: "Comment added"
        });
    } catch (error) {
        console.error("Fetch User Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}