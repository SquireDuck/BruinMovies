import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

import formidable from "formidable";

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
      
      const form = formidable({ multiples: true });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Form parsing error:", err);
          return res.status(500).json({ message: "Error parsing form data" });
        }
        
      const updateFields: { [key: string]: any } = {};

      const trimField = (field: string | string[]): string =>
        Array.isArray(field) ? field[0].trim() : field.trim();

      if(fields.watchingy) updateFields.watchingy = trimField(fields.watchingy);

      const result = await usersCollection.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: {updateFields} }
      );

      const updatedUser = await usersCollection.findOne({
        _id: new ObjectId(decoded.userId),
      });

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found after update" });
      }

        res.status(200).json({
             watchList: updatedUser.wathingy,
        });
      });
    } catch (error) {
        console.error("Fetch User Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}