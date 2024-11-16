"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SignInPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [newOTP, setNewOTP] = useState("");
  const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);

  const router = useRouter();

  const sendOtp = async (email: string) => {
    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send OTP.");
    }

    const data = await response.json();
    setNewOTP(data.otp);
    setOtpExpiry(new Date(data.otpExpiry));
  };

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {

      sendOtp(email);

      setRequiresOTP(true);
      setError(null);
      alert("Please check your email for the verification code.");

      setIsRegister(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleSignIn = async () => {
    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in.");
      }

      localStorage.setItem("authToken", data.token);
      alert(`Welcome back, ${data.username}!`);
      router.push("/movie-page");

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleOTPVerification = async () => {
    if (!otp) {
      setError("Verification code is required.");
      return;
    }

    try {
      if (newOTP !== otp) {
        throw new Error("Invalid OTP");
      }

      if (otpExpiry && new Date() > new Date(otpExpiry)) {
        throw new Error("OTP has expired");
      }

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to register.");
      }

      localStorage.setItem("authToken", data.token);
      setUsername(data.username); // Update username state
      alert(`Welcome ${data.username}!`);

      router.push("/movie-page");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-blue-900 text-white">
      <nav className="bg-gray-900 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="https://i.postimg.cc/GpkGdwHh/BRUIN-2.png"
            alt="Bruin Movies Logo"
            className="w-64 h-64 object-contain"
          />
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center px-4 md:px-0 py-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
            {isRegister ? "Register" : requiresOTP ? "Verify OTP" : "Sign In"}
          </h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={(e) => e.preventDefault()}>
            {isRegister && (
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}
            {!requiresOTP && (
              <>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="password" className="block text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </>
            )}
            {requiresOTP && (
              <div className="mb-4">
                <label htmlFor="otp" className="block text-gray-300 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Enter verification code"
                />
              </div>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
              onClick={() => {
                if (requiresOTP) {
                  handleOTPVerification();
                } else if (isRegister) {
                  handleRegister();
                } else {
                  handleSignIn();
                }
              }}
            >

              {isRegister ? "Register" : requiresOTP ? "Verify" : "Sign In"}
            </button>
            {requiresOTP && (
              <button
                type="submit"
                className="w-full px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition mt-4
                "
                onClick={() => {
                  setRequiresOTP(false);
                  setError(null);
                }}>
                Go Back
              </button>
            )}
          </form>
          {!requiresOTP && (
            <p className="text-center text-gray-300 mt-4">
              {isRegister ? "Already have an account?" : "Don't have an account yet?"}{" "}
              <span
                className="text-yellow-400 cursor-pointer"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                  setRequiresOTP(false);
                  setOtp("");
                }}
              >
                {isRegister ? "Sign In" : "Register"}
              </span>
            </p>
          )}
        </div>
      </div>
    </div >
  );
};

export default SignInPage;
