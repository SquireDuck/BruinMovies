import { useState } from "react";

const CommentForm = ({movieName, user}:{movieName: string, user: string}) => {
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      if(!token) {alert("Please login to comment"); return;}

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user, comment, movieName }),
      });
      
      // console.log("Token:", token);
      // console.log("Response Status:", response.status);
      // console.log("Response Body:", await response.json()); 

      if (response.ok) {
        alert("Comment submitted successfully! Refresh to see");
        setComment(""); // Clear the input field
      } else {
        alert("Failed to submit the comment.");
      }
    } catch (error) {
      console.error("Error submitting the comment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
    <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here"
        required
        rows={3}
        style={{ color: "black", width: "100%", padding: "5px" }}
        className="border border-yellow-500 rounded-lg"
    />
    <button type="submit" className="text-yellow-400">Submit Comment</button>
    </form>
  );
};

export default CommentForm;
