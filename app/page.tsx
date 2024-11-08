"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = () => {
    // Logic to make sure username and password are in the system, if so go to gallery
  }

  return (
    <>
      <div className="justify-center text-center background-color">
        <Image src="/logo.png" alt="Logo" width={500} height={500} className="mx-auto mt-10" />
        <h1 className="font-bold text-6xl pt-8 text-white">Sign In!</h1>
        <form className="pt-10 flex flex-col mx-28" onSubmit={(e) => { e.preventDefault(); }}>
          <input
            className="my-3 border-2 border-black rounded-lg p-2 w-1/3 self-center"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required />
          <div className="relative my-3 w-1/3 self-center">
            <input
              className="border-2 border-black rounded-lg p-2 w-full pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer w-5 h-5"
              title="Show password"
            />
          </div>
          <Link href="">
            <button className=" my-6 px-5 w-1/5 border-2 border-black rounded-lg p-2 bg-blue-500 text-white" type="submit" onClick={handleSignIn}>Sign Up</button>
          </Link>
        </form>
        <div className="flex flex-row justify-center text-center text-white">
          <p>Don&apos;t have an account?</p>
          <Link href="/signUp" >
            <button className="text-blue-500 pl-2 border-0 border-black rounded-lg text-decoration-line: underline">Sign Up</button>
          </Link>
        </div>
      </div>
      <div className="justify-center text-center pt-10">
        <button className="font-extrabold py-5 px-14 border-2 border-black rounded-lg p-2 bg-gray-400 text-black" onClick={handleSignIn}>Sign in with Google</button>
      </div>
    </>
  );
}
