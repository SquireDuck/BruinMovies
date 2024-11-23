import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const saveFile = async (file: formidable.File): Promise<string> => {
    const newFilename = `${Date.now()}-${file.originalFilename}`;
    const newPath = path.join(uploadDir, newFilename);
    await fs.promises.rename(file.filepath, newPath);
    return `/uploads/${newFilename}`;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
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

        if (req.method === "GET") {
            const user = await usersCollection.findOne({
                _id: new ObjectId(decoded.userId),
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({
                // Username and email
                username: user.username,
                email: user.email,

                // Profile fields
                biography: user.biography || "",
                year: user.year || "",
                major: user.major || "",
                genre_interests: user.genre_interests || "",

                profilePicture: user.profilePicture || "",
                bannerPicture: user.bannerPicture || "",
            });
        } else if (req.method === "PUT") {
            const form = formidable({ multiples: true });

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.error("Form parsing error:", err);
                    return res
                        .status(500)
                        .json({ message: "Error parsing form data" });
                }

                const updateFields: { [key: string]: any } = {};

                // Helper function to trim string fields
                const trimField = (field: string | string[]): string =>
                    Array.isArray(field) ? field[0].trim() : field.trim();

                // Username and email
                if (fields.username)
                    updateFields.username = trimField(fields.username);
                if (fields.email) updateFields.email = trimField(fields.email);

                // Profile fields
                if (fields.biography)
                    updateFields.biography = trimField(fields.biography);
                if (fields.year) updateFields.year = trimField(fields.year);
                if (fields.major) updateFields.major = trimField(fields.major);
                if (fields.genre_interests)
                    updateFields.genre_interests = trimField(
                        fields.genre_interests,
                    );

                // Process profile picture
                if (files.profilePicture) {
                    const profilePicture = Array.isArray(files.profilePicture)
                        ? files.profilePicture[0]
                        : files.profilePicture;
                    updateFields.profilePicture = await saveFile(
                        profilePicture,
                    );
                }

                // Process banner picture
                if (files.bannerPicture) {
                    const bannerPicture = Array.isArray(files.bannerPicture)
                        ? files.bannerPicture[0]
                        : files.bannerPicture;
                    updateFields.bannerPicture = await saveFile(bannerPicture);
                }

                // Ensure at least one field is being updated
                if (Object.keys(updateFields).length === 0) {
                    return res
                        .status(400)
                        .json({ message: "No fields to update" });
                }

                const result = await usersCollection.updateOne(
                    { _id: new ObjectId(decoded.userId) },
                    { $set: updateFields },
                );

                if (result.matchedCount === 0) {
                    return res.status(404).json({ message: "User not found" });
                }

                const updatedUser = await usersCollection.findOne({
                    _id: new ObjectId(decoded.userId),
                });

                if (!updatedUser) {
                    return res
                        .status(404)
                        .json({ message: "User not found after update" });
                }

                res.status(200).json({
                    username: updatedUser.username,
                    email: updatedUser.email,

                    // Profile fields
                    year: updatedUser.year || "",
                    major: updatedUser.major || "",
                    genre_interests: updatedUser.genre_interests || "",
                    biography: updatedUser.biography || "",
                    profilePicture: updatedUser.profilePicture || "",
                    bannerPicture: updatedUser.bannerPicture || "",
                });
            });
        } else {
            res.setHeader("Allow", ["GET", "PUT"]);
            res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error("Profile API Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
