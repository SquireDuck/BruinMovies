"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const FrontPage = () => {
  const router = useRouter();
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [fadeState, setFadeState] = useState("in");

  const messages = [
    "Experience Timeless Classics.",
    "Explore Blockbuster Hits.",
    "Discover Hidden Gems.",
    "Enjoy Movies with Friends.",
  ];

  useEffect(() => {
    const fadeOutTime = 500;
    const fadeInTime = 500;
    const stayTime = 2000;

    const fadeOut = () => {
      setFadeState("out");
      setTimeout(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setFadeState("in");
      }, fadeOutTime);
    };

    const interval = setInterval(() => {
      fadeOut();
    }, stayTime + fadeOutTime + fadeInTime);

    setCurrentText(messages[textIndex]);

    return () => clearInterval(interval);
  }, [textIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <img
            src="https://i.postimg.cc/GpkGdwHh/BRUIN-2.png"
            alt="Bruin Logo"
            className="w-28 h-28 object-contain cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => router.push("/")}
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/signin")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-full transition duration-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-500">
          Bruin Movies
        </h1>
        <p 
          className={`text-3xl font-medium text-gray-300 mb-12 h-12 transition-opacity duration-500 ${
            fadeState === "in" ? "opacity-100" : "opacity-0"
          }`}
        >
          {currentText}
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => router.push("/signin")}
            className="px-12 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-semibold rounded-full shadow-xl hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 backdrop-blur-md py-6 text-center">
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Bruin Movies. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default FrontPage;