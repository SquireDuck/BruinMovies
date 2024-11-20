import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { comment, movieName } = req.body;

    if (!comment || typeof comment !== "string") {
      return res.status(400).json({ error: "Invalid comment" });
    }

    try {
      // Connect to the database
      const db = await connectToDatabase();
      const commentsCollection = db.collection("Comments");

      // Insert the comment into the "Comments" collection
      const result = await commentsCollection.insertOne({ movieName, comment, likes: 0, createdAt: new Date() });

      return res.status(201).json({ message: "Comment added", commentId: result.insertedId });
    } catch (error) {
      console.error("Error saving comment:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
