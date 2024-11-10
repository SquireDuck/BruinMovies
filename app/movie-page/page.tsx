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
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const filteredMovies = () => {
    if (!searchQuery) return theaters;
    return theaters.map((theater) => ({
      ...theater,
      movies: theater.movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white">
      {/* Header Section */}
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

      {/* Search Bar */}
      <div className="container mx-auto px-6 py-4">
        <input
          type="text"
          placeholder="Search movies..."
          className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {filteredMovies().map((theater) =>
          theater.movies.length > 0 ? (
            <div key={theater.name} className="mb-12">
              <h2 className="text-3xl font-bold text-yellow-400 mb-4">
                {theater.name}
              </h2>
              <p className="text-gray-400 mb-6">{theater.address}</p>
              <div className="overflow-x-auto whitespace-nowrap space-x-4 flex px-2">
                {theater.movies.map((movie) => (
                  <div
                    key={movie.imdbId}
                    className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-md transform hover:scale-105 transition-transform w-64 flex-none p-4"
                  >
                    <Link href={`/${movie.imdbId}`}>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-4">
                          {movie.title}
                        </h3>
                        <p className="text-gray-300 flex items-center mb-4">
                          <span className="text-yellow-400 mr-2">⭐</span>
                          <span className="text-yellow-400">
                            {movie.rating === "N/A" ? "Not Rated" : movie.rating}
                          </span>
                        </p>
                        <p className="text-gray-400">
                          <strong>Showtimes:</strong>{" "}
                          {movie.showtimes === "No showtimes available on IMDb." ||
                          movie.showtimes === "N/A"
                            ? "No showtimes listed"
                            : movie.showtimes}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </main>

      {/* Footer */}
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
