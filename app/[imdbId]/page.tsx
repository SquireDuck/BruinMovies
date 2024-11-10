"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface MovieDetails {
  title: string;
  rating: string;
  description: string;
  showtimes: string;
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
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-400">
        Movie not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Section */}
      <header className="bg-gray-800 py-6">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-yellow-400">{movie.title}</h1>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Movie Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">Details</h2>
            <p className="text-gray-400 mb-4">
              <span className="font-bold text-white">Rating:</span>{" "}
              <span className="text-yellow-500">{movie.rating !== "N/A" ? movie.rating : "Not Rated"}</span>
            </p>
            <p className="text-gray-400 mb-4">
              <span className="font-bold text-white">Description:</span>{" "}
              {movie.description || "No description available."}
            </p>
            <p className="text-gray-400">
              <span className="font-bold text-white">Showtimes:</span>{" "}
              {movie.showtimes !== "No showtimes available on IMDb." && movie.showtimes !== "N/A"
                ? movie.showtimes
                : "Showtimes not available"}
            </p>
          </div>

          {/* Decorative Placeholder (e.g., Poster or Related Content) */}
          <div className="bg-gray-800 rounded-lg shadow-lg flex items-center justify-center p-8">
            <p className="text-gray-500">Poster or related content can go here.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Movie App. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Spinner Component (add this within the same file or import it)
const Spinner: React.FC = () => (
  <div className="flex justify-center items-center">
    <svg
      className="animate-spin h-8 w-8 text-yellow-400"
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
