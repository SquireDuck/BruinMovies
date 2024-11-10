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

const Home: React.FC = () => {
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
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  // Helper function to format rating
  const formatRating = (rating: string): string => {
    return rating === "N/A" ? "Not Rated" : rating;
  };

  // Helper function to format showtimes
  const formatShowtimes = (showtimes: string): string => {
    return showtimes === "No showtimes available on IMDb." || showtimes === "N/A"
      ? "Showtimes not available"
      : showtimes;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 py-6">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold">Movie Theaters</h1>
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">
        {theaters.map((theater) => (
          <div key={theater.name} className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{theater.name}</h2>
            <p className="text-gray-400 mb-4">{theater.address}</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {theater.movies.map((movie) => (
                <li
                  key={movie.imdbId}
                  className="bg-gray-800 rounded-lg overflow-hidden shadow-md transform hover:scale-105 transition-transform"
                >
                  <Link href={`/${movie.imdbId}`}>
                    <div className="p-4 cursor-pointer">
                      <h3 className="text-xl font-bold text-white mb-2">{movie.title}</h3>
                      <p className="text-gray-400 mb-1">Rating: {formatRating(movie.rating)}</p>
                      <p className="text-gray-400">Showtimes: {formatShowtimes(movie.showtimes)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </main>
      <footer className="bg-gray-800 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Movie App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
