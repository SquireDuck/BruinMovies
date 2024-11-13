import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded; // Returns userId and email
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
