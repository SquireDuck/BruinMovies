"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSignUp = async () => {
        if (!username || !email || !password) {
            alert("All fields are required.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@(ucla\.edu|g\.ucla\.edu)$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid UCLA email address.");
            return;
        }

        try {
            const response = await fetch('../api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create user');
            }

            alert('User created successfully!');
            router.push('/movies');
        } catch (error) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('An unknown error occurred.');
            }
        }
    }

    return (
        <>
            <div className="justify-center text-center items-center background-color">
                <Image src="/logo.png" alt="Logo" width={500} height={500} className="mx-auto mt-10" />
                <h1 className="font-bold text-6xl pt-8 text-white">Sign Up!</h1>
                <form className="pt-10 flex flex-col mx-28" onSubmit={(e) => { e.preventDefault(); }}>
                    <input
                        className="my-3 border-2 border-black rounded-lg p-2 w-1/3 self-center"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required />
                    <input
                        className="my-3 border-2 border-black rounded-lg p-2 w-1/3 self-center"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <div className="justify-center items-center">
                        <button
                            className="my-6 px-5 w-1/5 border-2 border-black rounded-lg p-2 bg-blue-500 text-white"
                            type="button"
                            onClick={handleSignUp}
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
                <div className="flex flex-row justify-center text-center text-white">
                    <p>Have an account?</p>
                    <Link href="/" >
                        <button className="text-blue-500 pl-2 border-0 border-black rounded-lg underline">Sign In</button>
                    </Link>
                </div>
            </div>
            <div className="justify-center text-center pt-10">
                <button
                    className="font-extrabold py-5 px-14 border-2 border-black rounded-lg p-2 bg-gray-400 text-black"
                    type="button"
                >
                    Sign up with Google
                </button>
            </div>
        </>
    );
}
