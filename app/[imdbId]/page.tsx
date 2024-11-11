"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface MovieDetails {
  title: string;
  rating: string;
  description: string;
  showtimes: string;
  image: string;
}

const MovieDetailsPage: React.FC = () => {
  const params = useParams() as { imdbId: string };
  const { imdbId } = params;

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imdbId || typeof imdbId !== "string") return;

    const fetchMovieDetails = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api";
        const response = await axios.get(`${API_URL}/movie/${imdbId}`);
        setMovie(response.data);
      } catch (err: any) {
        console.error("Error fetching movie details:", err);
        if (axios.isAxiosError(err) && err.response) {
          setError(err.response.data.error || "Failed to load movie details.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!movie) {
    return <div className="text-center text-gray-400">Movie not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white">
      {/* Header */}
      <header className="relative bg-black py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">{movie.title}</h1>
          <p className="text-gray-300 text-lg">
            An immersive experience brought to you with a Bruin touch.
          </p>
        </div>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-yellow-400 via-blue-500 to-black pointer-events-none"></div>
      </header>

      {/* Movie Details */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Movie Poster */}
          {movie.image && (
            <div className="flex justify-center">
              <img
                src={movie.image}
                alt={`${movie.title} Poster`}
                className="rounded-lg shadow-lg w-2/3 lg:w-full"
              />
            </div>
          )}

          {/* Movie Information */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
              <p className="text-yellow-500 text-xl mb-4">
                Rating: {movie.rating === "N/A" ? "Not Rated" : movie.rating}
              </p>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                <strong>Description:</strong> {movie.description}
              </p>
              <p className="text-gray-400 text-lg">
                <strong>Showtimes:</strong>{" "}
                {movie.showtimes === "No showtimes available on IMDb."
                  ? "Showtimes not available"
                  : movie.showtimes}
              </p>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-4">Comments:</h3>
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-y-auto h-48">
                <p className="text-gray-400 mb-4">Andy Peng: Great movie!</p>
                <p className="text-gray-400 mb-4">Andy Peng: Loved the plot twist!</p>
                <p className="text-gray-400 mb-4">
                  Andy Peng: Highly recommend watching with friends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-6 text-center">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} UCLA Bruin Watch. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

// Spinner Component (for loading state)
const Spinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <svg
      className="animate-spin h-8 w-8 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      ></path>
    </svg>
  </div>
);

export default MovieDetailsPage;