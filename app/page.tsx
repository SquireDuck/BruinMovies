"use client";

import { useState } from "react";


export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSignIn = () => {
    console.log("Username: ", username);
    console.log("Email: ", email);
    console.log("Password ", password);


  }

  const handleSignUp = () => {
    console.log("Sign Up");
  }

  return (
    <div className="justify-center text-center">
      <h1 className="font-bold text-6xl pt-20">Sign In!</h1> 
      <form className="pt-10 flex flex-col mx-28">
        <input className="my-3 border-2 border-black rounded-lg p-2" type="text" placeholder="Username" value={username}/>
        <input className="my-3 border-2 border-black rounded-lg p-2" type="text" placeholder="Email" value={email}/>
        <input className="my-3 border-2 border-black rounded-lg p-2" type="password" placeholder="Password" value={password}/>
        <button className=" my-6 border-2 border-black rounded-lg p-2 bg-blue-500 text-white" onClick={handleSignIn}>Sign In</button>
      </form>
      <div className="flex flex-row justify-center text-center">
        <p>Don&apos;t have an account?</p>
        <button className="pl-3 border-0 border-black rounded-lg text-blue text-decoration-line: underline" onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  );
}
