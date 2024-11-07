"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";

export default function profile() {
    return (
        <>
            <div className="flex items-center justify-center">
                <div
                    className="relative h-[100vh] w-[70vw] flex"
                    style={{ backgroundColor: "#DAEBFE" }}
                >
                    <div className="flex flex-row mt-8 gap-8">
                        {/* Sidebar */}
                        <div className="w-1/4 ml-8 p-4 space-y-4">
                            <h1 className="text-3xl font-bold">User Profile</h1>
                            <h2 className="text-2xl font-semibold">
                                Profile Picture
                            </h2>
                            <img
                                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                                alt="profile picture"
                            />
                            <button
                                className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                style={{ backgroundColor: "#005587" }}
                            >
                                Upload Profile Picture
                            </button>
                            <h2 className="text-xl font-semibold">
                                Username: user123
                            </h2>
                        </div>

                        {/* Profile information */}
                        <div className="flex flex-col w-3/4 p-4 space-y-4">
                            {/* Add additional profile information or components here */}
                            <h2 className="text-xl font-semibold">Name</h2>
                            <p className="text-lg">yoyo</p>
                            <h2 className="text-xl font-semibold">Year</h2>
                            <p className="text-lg">sophomore</p>
                            <h2 className="text-xl font-semibold">Interests</h2>
                            <p className="text-lg">sci-fic movies</p>

                            <h2 className="text-xl font-semibold">Major</h2>
                            <p className="text-lg">Computer Science</p>
                            <h2 className="text-xl font-semibold">Email</h2>
                            <p className="text-lg">yoyo_xue@outlook.com</p>

                            <h2 className="text-xl font-semibold">Bio</h2>
                            <p className="text-lg">I am a software engineer.</p>

                            {/* Add spacing*/}
                            <h2 className="text-xl font-semibold"></h2>
                            <p className="text-lg"></p>

                            {/* Edit button */}
                            <button
                                className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8"
                                style={{ backgroundColor: "#005587" }}
                            >
                                Edit Profile
                            </button>

                            {/*Sign out button*/}
                            <button
                                className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"
                                style={{ backgroundColor: "#005587" }}
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
