"use client";

import { useState } from "react";
import Link from "next/link";


export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSignIn = () => {
    console.log("Username: ", username);
    console.log("Email: ", email);
    console.log("Password ", password);

    setUsername("");
    setEmail("");
    setPassword("");
  }

  const handleSignUp = () => {
    console.log("Sign Up");
  }

  return (
    <>
    <div className="justify-center text-center">
      <h1 className="font-bold text-6xl pt-20">Sign In!</h1> 
      <form className="pt-10 flex flex-col mx-28">
        <input className="my-3 border-2 border-black rounded-lg p-2" type="text" placeholder="Username" value={username}/>
        <input className="my-3 border-2 border-black rounded-lg p-2" type="text" placeholder="Email" value={email}/>
        <input className="my-3 border-2 border-black rounded-lg p-2" type="password" placeholder="Password" value={password}/>
        <Link href="">
          <button className=" my-6 px-5 border-2 border-black rounded-lg p-2 bg-blue-500 text-white" onClick={handleSignIn}>Sign In</button>
        </Link>
      </form>
      <div className="flex flex-row justify-center text-center">
        <p>Don&apos;t have an account?</p>
        <Link href="" >
          <button className="text-blue-700 pl-3 border-0 border-black rounded-lg text-decoration-line: underline" onClick={handleSignUp}>Sign Up</button>
        </Link>
      </div>
    </div>
    <div className="justify-center text-center pt-20">
      <button className="font-extrabold py-5 px-14 border-2 border-black rounded-lg p-2 bg-gray-400 text-black" onClick={handleSignIn}>Sign in with Google</button>
    </div>
    </>
  );
}
