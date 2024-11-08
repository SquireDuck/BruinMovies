"use client";

import React from "react";

import { useState } from "react";
import Link from "next/link";

import { useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FaCheck, FaTimes } from "react-icons/fa";
import { getCroppedImg } from "./cropImageHelper.js"; /* Helper function for cropping image */

export default function profile() {
    /* State variables for profile here */
    const [username, setUsername] = useState("bruins123");
    const [profilePicture, setProfilePicture] = useState(
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    ); /* Default profile picture */
    const [isEditing, setIsEditing] = useState(false); /* state for edit mode */
    const [isNewPicture, setIsNewPicture] =
        useState(false); /* tracks if new picture is uploaded */

    /* Hidden file input reference */
    const fileInputRef = React.useRef(null);

    /* State variables for image cropper */
    const [selectedFile, setSelectedFile] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);

    /* State variables for profile information */
    const [name, setName] = useState("uclabruins");
    const [year, setYear] = useState("Freshman");
    const [interests, setInterests] = useState("Sci-fic, Fantasy");
    const [major, setMajor] = useState("Computer Science");
    const [email, setEmail] = useState("xxx@g.ucla.edu");
    const [bio, setBio] = useState("This is a bio");
    const [isEditMode, setIsEditMode] = useState(false);

    const handleProfileInfoChange = (field, value) => {
        // Update each field based on its name
        switch (field) {
            case "name":
                setName(value);
                break;
            case "year":
                setYear(value);
                break;
            case "interests":
                setInterests(value);
                break;
            case "major":
                setMajor(value);
                break;
            case "email":
                setEmail(value);
                break;
            case "bio":
                setBio(value);
                break;
            default:
                break;
        }
    };

    /* Toggle edit mode */
    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };

    /* Function to handle profile picture change */
    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(URL.createObjectURL(file));
            setShowCropper(true);
        }
    };

    /* Cropping, uploading, and saving functions */
    const handleUploadButtonClick = () => {
        if (!showCropper) {
            fileInputRef.current.click();
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleCropSave = async () => {
        try {
            const croppedImage = await getCroppedImg(
                selectedFile,
                croppedAreaPixels,
            );
            setProfilePicture(
                croppedImage,
            ); /* Set cropped image as profile picture */
            setIsNewPicture(false);
            setShowCropper(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setSelectedFile(null);
    };

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
                            <img src={profilePicture} alt="profile picture" />

                            {/* Hidden file input */}
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                onChange={handleProfilePictureChange}
                                className="hidden"
                                ref={fileInputRef}
                            />

                            {/* Upload/Save button */}
                            <button
                                onClick={handleUploadButtonClick}
                                className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                style={{ backgroundColor: "#005587" }}
                            >
                                {isNewPicture
                                    ? "Save Changes"
                                    : "Upload Profile Picture"}
                            </button>

                            {/* Cropper */}
                            {showCropper && (
                                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                                    <div className="relative w-80 h-80 bg-white p-4 rounded shadow-lg z-60">
                                        <Cropper
                                            image={selectedFile}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={1} // 1:1 aspect ratio
                                            onCropChange={setCrop}
                                            onZoomChange={setZoom}
                                            onCropComplete={onCropComplete}
                                        />
                                        <div className="absolute top-4 right-4 flex space-x-4">
                                            {" "}
                                            {/* Place buttons absolutely within cropper container to ensure that they sit above it */}
                                            <button
                                                onClick={handleCropCancel}
                                                className="text-red-500 z-70"
                                            >
                                                <FaTimes size={20} />
                                            </button>
                                            <button
                                                onClick={handleCropSave}
                                                className="text-green-500 z-70"
                                            >
                                                <FaCheck size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <h2 className="text-xl font-semibold">
                                Username: user123
                            </h2>
                        </div>

                        {/* Profile information */}
                        <div className="flex flex-col w-3/4 p-4 space-y-4">
                            {/* Add additional profile information or components here */}
                            <h2 className="text-lg font-semibold">Name</h2>
                            {isEditMode /* Edit mode */ ? (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        handleProfileInfoChange(
                                            "name",
                                            e.target.value,
                                        )
                                    }
                                    className="text-lg border border-gray-300 rounded p-2"
                                />
                            ) : (
                                /* Default/view mode */
                                <p className="text-lg">{name}</p>
                            )}

                            <h2 className="text-lg font-semibold">Year</h2>
                            {isEditMode /* Edit mode */ ? (
                                <input
                                    type="text"
                                    value={year}
                                    onChange={(e) =>
                                        handleProfileInfoChange(
                                            "year",
                                            e.target.value,
                                        )
                                    }
                                    className="text-lg border border-gray-300 rounded p-2"
                                />
                            ) : (
                                /* Default/view mode */
                                <p className="text-lg">{year}</p>
                            )}

                            <h2 className="text-lg font-semibold">Interests</h2>
                            {isEditMode /* Edit mode */ ? (
                                <input
                                    type="text"
                                    value={interests}
                                    onChange={(e) =>
                                        handleProfileInfoChange(
                                            "interests",
                                            e.target.value,
                                        )
                                    }
                                    className="text-lg border border-gray-300 rounded p-2"
                                />
                            ) : (
                                /* Default/view mode */
                                <p className="text-lg">{interests}</p>
                            )}

                            <h2 className="text-lg font-semibold">Major</h2>
                            {isEditMode /* Edit mode */ ? (
                                <input
                                    type="text"
                                    value={major}
                                    onChange={(e) =>
                                        handleProfileInfoChange(
                                            "major",
                                            e.target.value,
                                        )
                                    }
                                    className="text-lg border border-gray-300 rounded p-2"
                                />
                            ) : (
                                /* Default/view mode */
                                <p className="text-lg">{major}</p>
                            )}

                            <h2 className="text-lg font-semibold">Email</h2>
                            {isEditMode /* Edit mode */ ? (
                                <input
                                    type="text"
                                    value={email}
                                    onChange={(e) =>
                                        handleProfileInfoChange(
                                            "email",
                                            e.target.value,
                                        )
                                    }
                                    className="text-lg border border-gray-300 rounded p-2"
                                />
                            ) : (
                                /* Default/view mode */
                                <p className="text-lg">{email}</p>
                            )}

                            <h2 className="text-lg font-semibold">Bio</h2>
                            {isEditMode /* Edit mode */ ? (
                                <textarea
                                    value={bio}
                                    onChange={(e) =>
                                        handleProfileInfoChange(
                                            "bio",
                                            e.target.value,
                                        )
                                    }
                                    className="text-lg border border-gray-300 rounded p-2"
                                />
                            ) : (
                                /* Default/view mode */
                                <p className="text-lg">{bio}</p>
                            )}

                            {/* Add spacing*/}
                            <h2 className="text-xl font-semibold"></h2>
                            <p className="text-lg"></p>

                            {/* Edit / Save button */}
                            <button
                                className="hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8"
                                onClick={toggleEditMode}
                                style={{ backgroundColor: "#005587" }}
                            >
                                {isEditMode ? "Save Profile" : "Edit Profile"}
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
