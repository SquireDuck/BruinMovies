"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Movie {
  title: string;
  rating: string;
  showtimes: string;
  imdbId: string;
}

interface Theater {
  name: string;
  address: string;
  movies: Movie[];
}

const MoviePage: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/theaters");
        setTheaters(response.data.theaters);
      } catch (err: any) {
        console.error("Error fetching theaters:", err);
        setError(err.response?.data?.message || "Failed to load theater data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black text-red-500">
        {error}
      </div>
    );
  }

  const formatShowtimes = (showtimes: string): string => {
    return showtimes === "No showtimes available on IMDb." || showtimes === "N/A"
      ? "No showtimes listed"
      : showtimes;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white">
      <header className="relative bg-black py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-yellow-400 mb-4">
            Discover Movies Near UCLA 🎥
          </h1>
          <p className="text-gray-300 text-lg">
            Explore theaters and movies with a Bruin touch!
          </p>
        </div>
        <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-yellow-400 via-blue-500 to-black pointer-events-none"></div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {theaters.map((theater) => (
          <div key={theater.name} className="mb-12">
            <h2 className="text-3xl font-bold text-yellow-400 mb-4">
              {theater.name}
            </h2>
            <p className="text-gray-400 mb-6">{theater.address}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {theater.movies.map((movie) => (
                <li
                  key={movie.imdbId}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform"
                >
                  <Link href={`/${movie.imdbId}`}>
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {movie.title}
                      </h3>
                      <div className="text-gray-300 mb-4">
                        <p>
                          <strong>Rating:</strong>{" "}
                          <span className="text-yellow-400">
                            {movie.rating === "N/A" ? "Not Rated" : movie.rating}
                          </span>
                        </p>
                        <p>
                          <strong>Showtimes:</strong> {formatShowtimes(movie.showtimes)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>

      <footer className="bg-black py-6 text-center">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} UCLA Movie Explorer. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default MoviePage;
