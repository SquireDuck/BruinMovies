"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { FaStar, FaClock, FaTicketAlt, FaArrowLeft, FaCommentAlt } from 'react-icons/fa';

interface MovieDetails {
  title: string;
  rating: string;
  description: string;
  showtimes: string;
  image: string;
  genres: string[]; // Added genres
}

interface Profile {
  username: string;
  email: string;

  // Newly added fields
  year: string;
  major: string;
  genre_interests: string;

  biography: string;
  profilePicture: string;
  bannerPicture: string;
  watchList: string;
}


const MovieDetailsPage = () => {
  const params = useParams() as { imdbId: string };
  const { imdbId } = params;
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [watching, setWatching] = useState<boolean>(false);

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

  useEffect(() => {
    const fetchProfile2 = async () => {
        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("No authentication token found.");
            }

            const response = await fetch("/api/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            } else {
                throw new Error("Failed to fetch profile");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError("Failed to load profile. Please try again.");
        }
    };

    fetchProfile2();
}, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-black to-blue-900">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-blue-900">{error}</div>;
  }

  if (!movie) {
    return <div className="text-center text-gray-400 min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-blue-900">Movie not found.</div>;
  }

       
  const UpdateWatchStatus = async () => {
    if(!profile) return;
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
          throw new Error("No authentication token found.");
      }
      setWatching(true);

      const formData = new FormData();

      formData.append("username", "vik");
      formData.append("email", profile.email);

      // Newly added fields
      formData.append("year", profile.year);
      formData.append("major", profile.major);
      formData.append("genre_interests", profile.genre_interests);

      formData.append("biography", profile.biography);
      formData.append("watching", profile.watchList);


      const response = await fetch("/api/profile", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
      });


      if (response.ok) {
          const updatedProfile = await response.json();
          setProfile(updatedProfile);
      } else {
          const errorData = await response.json();
          throw new Error(
              errorData.message || "Failed to update profile",
          );
      }
  } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
  }
  };
                  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white">
      {/* Enhanced Header */}
      <header className="relative bg-black py-8">
        <div className="container mx-auto px-6">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to Movies
          </button>
        </div>
      </header>

      {/* Movie Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{backgroundImage: `url(${movie.image})`}}></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <img
              src={movie.image}
              alt={`${movie.title} Poster`}
              className="rounded-lg shadow-2xl mb-8 md:mb-0 md:mr-12 w-64 h-96 object-cover"
            />
            <div className="text-center md:text-left">
              <h1 className="text-5xl font-bold text-yellow-400 mb-4">{movie.title}</h1>
              <div className="flex items-center justify-center md:justify-start mb-4">
                <FaStar className="text-yellow-400 mr-2" />
                <span className="text-2xl">{movie.rating === "N/A" ? "Not Rated" : movie.rating}</span>
              </div>

              <button 
              className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-300 transition duration-300 flex items-center"
                
              onClick={() => {
                UpdateWatchStatus();
                }}
                >
                Add to watchList
              </button>
            </div>

            

        {/* WatchList Section*/}
        <div className="bg-gray-800 text-black font-bold py-3 px-8 rounded-lg hover:bg-yellow-300 transition duration-300 flex items-center">
          <h3 className="text-3xl font-bold mb-6 text-yellow-400">People who want to watch the movie</h3>  
          <p className="text-gray-300 text-md mb-4 leading-relaxed">{movie.description}</p>
        </div>


        </div>
        </div>
      </section>

      {/* Movie Details */}
      <main className="container mx-auto px-6 py-12">
        <div className="bg-gray-800 p-8 rounded-lg shadow-2xl hover:shadow-yellow-400/20 transition duration-300">
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">About the Movie</h2>
          
          {/* Genres Section */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre, index) => (
                  <span key={index} className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-300 text-lg mb-8 leading-relaxed">{movie.description}</p>
          <div className="flex items-center text-gray-400 text-lg">
            <FaClock className="mr-2 text-yellow-400" />
            <strong className="text-yellow-400 mr-2">Showtimes:</strong>
            <span>{movie.showtimes === "No showtimes available on IMDb." ? "Showtimes not available" : movie.showtimes}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold mb-8 text-yellow-400 flex items-center">
            <FaCommentAlt className="mr-4" />
            Student Reviews
          </h3>
          <div className="bg-gray-800 p-8 rounded-lg shadow-2xl">
            {['Great movie!', 'Loved the plot twist!', 'Highly recommend watching with friends.'].map((comment, index) => (
              <div key={index} className="mb-6 pb-6 border-b border-gray-700 last:border-b-0 last:mb-0 last:pb-0">
                <p className="text-gray-300 mb-2">{comment}</p>
                <p className="text-yellow-400 text-sm">Andy Peng</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-8 text-center">
        <div className="container mx-auto px-6">
          <img
            src="https://i.postimg.cc/GpkGdwHh/BRUIN-2.png"
            alt="Bruin Logo"
            className="mx-auto mb-4 w-20 h-20 object-contain"
          />
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} UCLA Bruin Watch. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

// Updated Spinner Component
const Spinner = () => (
  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400"></div>
);

export default MovieDetailsPage;