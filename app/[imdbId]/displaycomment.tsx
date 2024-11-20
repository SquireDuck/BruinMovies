import { useEffect, useState } from "react";
import { ObjectId } from "mongodb";

interface Comment {
  _id: string;
  movieName: string;
  comment: string;
  likes: number;
  likedBy: string[];
  createdAt: string;
}

/////

/// See the prop userId:
/// Hard coded for now; should be the actual user ID
/// In page.tsx, userId is passed as a prop to this function
/// Change the hardcode into the actual userID

/////

const DisplayComments = ({ movieName, userId }: { movieName: string, userId: string }) => {
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
        body: JSON.stringify({ commentId, userId }),
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment._id === commentId
              ? { ...comment, likes: comment.likes + 1 }
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
            <li key={index} className="p-4 bg-gray-800 rounded-lg">
              <p className="text-white">{comment.comment}</p>
              <div className="text-sm text-gray-500 mt-2">
                <span>Likes: {comment.likes}</span> |{" "}
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <button
                onClick={() => handleLike(comment._id)}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={comment.likedBy?.includes(userId)} // Disable button if already liked
              >
                Like
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
