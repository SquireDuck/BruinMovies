import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../lib/mongodb';
import { ObjectId } from "mongodb";

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
      const result = await commentsCollection.insertOne({ movieName, comment, likes: 0, likedBy: [], createdAt: new Date() });

      return res.status(201).json({ message: "Comment added", commentId: result.insertedId });
    } catch (error) {
      console.error("Error saving comment:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } 

  ///////////

  if (req.method === "GET") {
    const { movieName } = req.query;

    if (!movieName || typeof movieName !== "string") {
      return res.status(400).json({ error: "Movie name is required" });
    }

    try {
      // Connect to the database
      const db = await connectToDatabase();
      const commentsCollection = db.collection("Comments");

      // Query for comments with the given movieName, sorted by likes
      const comments = await commentsCollection
        .find({ movieName }) // Filter by movieName
        .sort({ likes: -1 }) // Sort by likes in descending order
        .toArray();

      return res.status(200).json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } 

  /////

  if (req.method === "PATCH") {
    const { commentId, userId } = req.body;
  
    if (!commentId || typeof commentId !== "string") {
      return res.status(400).json({ error: "Comment ID is required" });
    }

    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "User ID is required and must be a string." });
    }
  
    try {
      // Connect to the database
      const db = await connectToDatabase();
      const commentsCollection = db.collection("Comments");
      const objectId = new ObjectId(commentId);

      // Check if the user has already liked the comment
      const comment = await commentsCollection.findOne({ _id: objectId });

      if (!comment) {
        return res.status(404).json({ error: "Comment not found." });
      }

      if (comment.likedBy && comment.likedBy.includes(userId)) {
        return res.status(403).json({ error: "User has already liked this comment." });
      }

      // Increment the likes of the specified comment
      const result = await commentsCollection.updateOne(
        { _id: objectId }, // Match by ID
        { 
          $inc: { likes: 1 },     // Increment likes by 1
          $push: { likedBy: userId as never } // Add the userId to the likedBy array
        } 
      );
  
      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: "Comment not found" });
      }
  
      return res.status(200).json({ message: "Likes updated successfully" });
    } catch (error) {
      console.error("Error updating likes:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
