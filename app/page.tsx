// pages/index.tsx

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Movie, WatchlistResponse, ApiError } from "@/types"; // Ensure correct path
import Image from "next/image";
import { FaStar, FaHeart, FaSpinner } from "react-icons/fa";

const Home: React.FC = () => {
  // State variables for watchlist data
  const [movies, setMovies] = useState<Movie[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch watchlist data when component mounts
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get<WatchlistResponse | ApiError>(
          `http://127.0.0.1:5000/api/watchlist` // Ensure this environment variable is set
        );
        console.log("API Response:", response.data); // Debugging line

        if ("error" in response.data) {
          // Handle API error response
          setError(response.data.error);
        } else {
          // Handle successful API response
          setMovies(response.data.movies);
          setCount(response.data.count);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching watchlist:", err.response ? err.response.data : err.message);
        setError(err.response?.data?.error || "Failed to load watchlist.");
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url('/hero-bg.jpg')` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen text-white">
        {/* Header */}
        <header className="bg-transparent py-6">
          <div className="container mx-auto px-6 flex justify-between items-center">
            <h1 className="text-4xl font-poppins font-bold">Bruin Movie</h1>
            {/* Navigation */}
            <nav>
              <ul className="flex space-x-6">
                <li className="hover:text-yellow-400 transition-colors duration-300">
                  <a href="#home">Home</a>
                </li>
                <li className="hover:text-yellow-400 transition-colors duration-300">
                  <a href="#watchlist">Watchlist</a>
                </li>
                <li className="hover:text-yellow-400 transition-colors duration-300">
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex-grow flex items-center justify-center" id="home">
          <div className="text-center px-4">
            <h2 className="text-5xl font-poppins font-bold mb-4">
              Welcome to Your Personalized IMDb Watchlist
            </h2>
            <p className="text-lg mb-8">
              Curate your favorite movies and keep track of what you want to watch next.
            </p>
            <a
              href="#watchlist"
              className="bg-yellow-500 text-gray-800 px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition-colors duration-300 inline-flex items-center"
            >
              <FaHeart className="mr-2" /> View Watchlist
            </a>
          </div>
        </section>

        {/* Main Content */}
        <main id="watchlist" className="container mx-auto px-6 py-12">
          {loading && (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin text-yellow-400 text-5xl" />
            </div>
          )}

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {!loading && !error && movies.length > 0 && (
            <div>
              <p className="text-center text-2xl font-poppins font-semibold text-gray-200 mb-8">
                Total Movies: {count}
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {movies.map((movie, index) => (
                  <li
                    key={index}
                    className="bg-gray-900 bg-opacity-80 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
                  >
                    {movie.poster ? (
                      <Image
                        src={movie.poster}
                        alt={`${movie.title} Poster`}
                        width={500}
                        height={750}
                        className="w-full h-80 object-cover"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-300">No Image Available</span>
                      </div>
                    )}
                    <div className="p-6 flex flex-col">
                      <h2 className="text-2xl font-poppins font-bold text-white mb-2">
                        {movie.title || "Untitled"}
                      </h2>
                      <p className="text-gray-400 mb-1">Year: {movie.year || "N/A"}</p>
                      <div className="flex items-center mb-4">
                        <FaStar className="text-yellow-400 mr-2" />
                        <span className="text-gray-300">
                          {movie.rating !== null ? movie.rating : "N/A"}
                        </span>
                      </div>
                      {/* Add to Favorites Button */}
                      <button className="mt-auto bg-yellow-500 text-gray-800 px-4 py-2 rounded-full hover:bg-yellow-400 transition-colors duration-300 flex items-center justify-center">
                        <FaHeart className="mr-2" /> Add to Favorites
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && !error && movies.length === 0 && (
            <p className="text-center text-gray-300">No movies found in your watchlist.</p>
          )}
        </main>

        {/* Footer */}
        <footer id="contact" className="bg-transparent py-6">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-300 mb-4">
              &copy; {new Date().getFullYear()} Bruin Movie - Nicholas Malilay, Daniel Zhou, Victor Castellanos, Andy Peng. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <a
                href="#"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                aria-label="GitHub"
              >
                {/* GitHub Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.263.82-.583 0-.287-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.754-1.333-1.754-1.09-.744.083-.729.083-.729 1.205.085 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.997.108-.775.418-1.305.76-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.135-.305-.54-1.53.105-3.19 0 0 1.005-.322 3.3 1.23a11.5 11.5 0 013.003-.404c1.02.005 2.045.138 3.003.404 2.28-1.552 3.285-1.23 3.285-1.23.645 1.66.24 2.885.12 3.19.77.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.62-5.475 5.92.43.37.81 1.1.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.21.7.825.58C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                aria-label="Twitter"
              >
                {/* Twitter Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557a9.93 9.93 0 01-2.828.775A4.932 4.932 0 0023.337 3.1a9.864 9.864 0 01-3.127 1.195A4.916 4.916 0 0016.616 3c-2.737 0-4.95 2.213-4.95 4.95 0 .388.044.764.128 1.124C7.728 8.876 4.1 6.89 1.671 3.846a4.935 4.935 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.242-.616v.062c0 2.385 1.693 4.374 3.946 4.827a4.935 4.935 0 01-2.235.084c.63 1.956 2.445 3.377 4.6 3.418A9.867 9.867 0 010 19.54a13.94 13.94 0 007.548 2.212c9.056 0 14-7.496 14-13.986 0-.213-.005-.425-.014-.636A10.025 10.025 0 0024 4.557z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-300"
                aria-label="LinkedIn"
              >
                {/* LinkedIn Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.762 0-5 2.238-5 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.762-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75 1.75.785 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.065-1.867-3.065-1.868 0-2.154 1.459-2.154 2.964v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.562 2.841-1.562 3.041 0 3.604 2.0 3.604 4.6v5.59z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;
