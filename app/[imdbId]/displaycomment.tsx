import { useEffect, useState } from "react";
import { ObjectId } from "mongodb";

interface Comment {
  _id: string;
  user: string;
  movieName: string;
  comment: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
}


const DisplayComments = ({ movieName, user, email }: { movieName: string, user: string, email: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?movieName=${encodeURIComponent(movieName)}`);

        if (response.ok) {
          const data = await response.json();
          setComments(data);
        } else {
          const errorData = await response.json();
          setError(errorData.error || "Failed to fetch comments.");
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [movieName]);

  const handleLike = async (commentId: string) => {

    try {
      const response = await fetch("/api/comments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId, email }),
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: comment.likedBy.includes(email)
                    ? comment.likes - 1 // Decrement likes if already liked
                    : comment.likes + 1, // Increment likes if not already liked
                  likedBy: comment.likedBy.includes(email)
                    ? comment.likedBy.filter((id) => id !== email) // Remove user from likedBy
                    : [...comment.likedBy, email], // Add user to likedBy
                }
              : comment
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Error updating likes:", errorData.error);
        alert(`Failed to update likes: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
      alert("An unexpected error occurred.");
    }
  };

  if (loading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="comments-section">
      <h2 className="text-xl font-bold mb-4">Comments for {movieName}</h2>
      {comments.length > 0 ? (
        <ul className="space-y-4">
          {comments.map((comment, index) => (
            <li key={index} className="p-4 bg-gray-800 rounded-lg shadow-2xl hover:shadow-yellow-400/20 transition duration-300">
              <p className="text-yellow-600">{comment.user}</p>
              <p className="text-white mt-2">{comment.comment}</p>
              <div className="text-sm text-gray-500 mt-2">
                <span>Likes: {comment.likes}</span> |{" "}
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleLike(comment._id)}
                className='mt-2 px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600'
              >
                {comment.likedBy.includes(email) ? "Liked" : "Like"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div>No comments available for this movie.</div>
      )}
    </div>
  );
};

export default DisplayComments;
