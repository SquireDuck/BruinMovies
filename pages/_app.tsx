"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AppPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [otp, setOtp] = useState("");

  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to register.");
      }

      alert("User registered successfully!");
      setIsRegister(false);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to sign in.");
      }

      if (data.requiresOTP) {
        setRequiresOTP(true);
        setError(null);
        alert("Please check your email for the verification code.");
      } else {
        localStorage.setItem("authToken", data.token);
        alert(`Welcome back, ${data.username}!`);
        router.push("/movie-page");
      }
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
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP.");
      }

      localStorage.setItem("authToken", data.token);
      alert(`Welcome back, ${data.username}!`);
      router.push("/movie-page");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isRegister ? "Register" : "Sign In"}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {!requiresOTP ? (
          <form onSubmit={(e) => e.preventDefault()}>
            {isRegister && (
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 mb-4 border rounded"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={isRegister ? handleRegister : handleSignIn}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {isRegister ? "Register" : "Sign In"}
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Verification Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
            />
            <button
              onClick={handleOTPVerification}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Verify OTP
            </button>
          </form>
        )}
        <p className="mt-4 text-center">
          {isRegister ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-500 hover:underline ml-1"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AppPage;