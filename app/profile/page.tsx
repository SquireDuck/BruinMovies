"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* Helper functions for the image cropper */
import { useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { FaCheck, FaTimes } from "react-icons/fa";
import { getCroppedImg } from "./cropImageHelper.js";

interface Profile {
    // Username and email
    username: string;
    email: string;

    // User profile fields
    year: string;
    major: string;
    genre_interests: string;

    biography: string;
    profilePicture: string;
    bannerPicture: string;
}

const ProfilePage = () => {
    /* State variables */
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profileImagePreview, setProfileImagePreview] = useState<
        string | null
    >(null);
    const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/");
        }
    }, [router]);

    /* State variables for image cropper */
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState<boolean>(false);

    /* Fetch user profile on page load */
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/");
        }

        const fetchProfile = async () => {
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

        fetchProfile();
    }, [router]);

    /* Event handlers */
    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setProfileImagePreview(null);
        setBannerImagePreview(null);
        setError(null);
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setPreview: (preview: string | null) => void,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    /* Specifically handles profile picture change -- including cropper */
    const handleProfilePictureChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        setPreview: (preview: string | null) => void,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result as string;
                setSelectedFile(imageUrl); // Set the selected file state
                setShowCropper(true); // Show the cropper
            };
            reader.readAsDataURL(file);
        }
    };

    /* Cropper helper functions */
    const onCropComplete = async (croppedArea: any, croppedAreaPixels: any) => {
        try {
            const croppedImage = await getCroppedImg(
                selectedFile!,
                croppedAreaPixels,
            );
            setProfileImagePreview(croppedImage); // Save the cropped image
        } catch (error) {
            console.error("Error cropping image:", error);
        }
    };

    /* Cancels cropping */
    const handleCropCancel = () => {
        setShowCropper(false); /* Close cropper */
        setSelectedFile(null); /* Reset selected file */
    };

    /* Saves cropping changes */
    const handleCropSave = () => {
        setShowCropper(false); /* Close cropper */
    };

    const handleSave = async () => {
        if (!profile) return;

        try {
            const token = localStorage.getItem("authToken");
            if (!token) {
                throw new Error("No authentication token found.");
            }

            const formData = new FormData();

            formData.append("username", profile.username);
            formData.append("email", profile.email);
            formData.append("year", profile.year);
            formData.append("major", profile.major);
            formData.append("genre_interests", profile.genre_interests);
            formData.append("biography", profile.biography);

            const profilePictureInput = document.getElementById(
                "profilePicture",
            ) as HTMLInputElement;
            const bannerPictureInput = document.getElementById(
                "bannerPicture",
            ) as HTMLInputElement;

            if (profilePictureInput?.files?.[0]) {
                formData.append("profilePicture", profilePictureInput.files[0]);
            }

            if (bannerPictureInput?.files?.[0]) {
                formData.append("bannerPicture", bannerPictureInput.files[0]);
            }

            /* Send PUT request to update profile */
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (response.ok) {
                const updatedProfile = await response.json();
                setProfile(updatedProfile);
                setIsEditing(false);
                setProfileImagePreview(null);
                setBannerImagePreview(null);
                setError(null);
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

    const handleSignOut = () => {
        localStorage.removeItem("authToken");
        router.push("/");
    };

    const handleGenreInterestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
        if (profile) {
            setProfile({
                ...profile,
                genre_interests: selectedOptions.join(", "),
            });
        }
    };

    if (!profile)
        /* Loading state */
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white font-sans">
            {/* Header */}
            <nav className="bg-black shadow sticky top-0 z-10 flex flex-row">
                <div className="px-6 py-4 flex justify-between items-center w-full">
                    <img
                        src="https://i.postimg.cc/GpkGdwHh/BRUIN-2.png"
                        alt="Bruin Logo"
                        className="w-28 h-28 object-contain cursor-pointer"
                        onClick={() => router.push("/movie-page")}
                    />
                    <div>
                        <button
                            onClick={handleSignOut}
                            className="bg-red-500 hover:bg-red-600 text-black font-bold py-2 px-4 rounded mx-10"
                        >
                            Sign Out
                        </button>
                        <button
                            onClick={() => router.push("/movie-page")}
                            className=" bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-5 rounded"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </nav>

            {/* Profile Header */}
            <div className="relative">
                {profile.bannerPicture ? (
                    <img
                        src={profile.bannerPicture}
                        alt="Banner"
                        className="w-full h-60 object-cover"
                    />
                ) : (
                    <div className="w-full h-60 bg-gray-700 flex items-center justify-center">
                        <span className="text-gray-300">No Banner Picture</span>
                    </div>
                )}
                <div className="absolute left-6 -bottom-12 w-24 h-24">
                    <img
                        src={profile.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-fit rounded-full border-4 bg-slate-300 border-black shadow-lg"
                    />
                </div>
                {!isEditing && (
                    <button
                        onClick={handleEdit}
                        className="absolute right-6 bottom-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
                    >
                        Edit
                    </button>
                )}
            </div>

            {/* Profile Content */}
            <div className="mt-16 px-4 md:px-0">
                <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
                    {error && (
                        <p className="text-red-500 text-center mb-4">{error}</p>
                    )}

                    {isEditing ? (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSave();
                            }}
                            className="space-y-6"
                        >
                            {/* Username */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            username: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            {/* Email */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Year */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">
                                    Year
                                </label>
                                <select
                                    value={profile.year}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            year: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>
                                        Select your year
                                    </option>
                                    <option value="Freshman">Freshman</option>
                                    <option value="Sophomore">Sophomore</option>
                                    <option value="Junior">Junior</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Graduate">Graduate</option>
                                </select>
                            </div>

                            {/* Major */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">
                                    Major
                                </label>
                                <input
                                    type="text"
                                    value={profile.major}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            major: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Genre Interests */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">
                                    Genre Interests
                                </label>
                                <select
                                    value={profile.genre_interests.split(", ")}
                                    multiple
                                    onChange={handleGenreInterestsChange}
                                    className="w-full px-4 h-40 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="" disabled>
                                        Select your genre interests
                                    </option>
                                    <option value="Action">Action</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Animation">Animation</option>
                                    <option value="Comedy">Comedy</option>
                                    <option value="Crime">Crime</option>
                                    <option value="Drama">Drama</option>
                                    <option value="Fantasy">Fantasy</option>
                                    <option value="Historical">
                                        Historical
                                    </option>
                                    <option value="Horror">Horror</option>
                                    <option value="Musical">Musical</option>
                                    <option value="Mystery">Mystery</option>
                                    <option value="Romance">Romance</option>
                                    <option value="Science Fiction">
                                        Science Fiction
                                    </option>
                                    <option value="Thriller">Thriller</option>
                                </select>
                                <p className="text-gray-400 text-sm mt-2">
                                    Hold down Ctrl (Windows) or Command (Mac) to
                                    select multiple options.
                                </p>
                            </div>

                            {/* Biography */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">
                                    Biography
                                </label>
                                <textarea
                                    value={profile.biography}
                                    onChange={(e) =>
                                        setProfile({
                                            ...profile,
                                            biography: e.target.value,
                                        })
                                    }
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={4}
                                />
                            </div>

                            {/* Profile Picture */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">
                                    Profile Picture
                                </label>
                                <input
                                    type="file"
                                    id="profilePicture"
                                    onChange={(e) =>
                                        handleProfilePictureChange(
                                            e,
                                            setProfileImagePreview,
                                        )
                                    }
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    accept="image/*"
                                />
                                {/* Cropper */}
                                {showCropper && (
                                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
                                        <div className="relative w-80 h-80 bg-white p-4 rounded shadow-lg z-60">
                                            <Cropper
                                                image={selectedFile || undefined}
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

                                {/* Display preview once cropped */}
                                {!showCropper && profileImagePreview && (
                                    <img
                                        src={profileImagePreview}
                                        alt="Profile Preview"
                                        className="mt-4 w-32 h-32 object-cover rounded-lg border border-gray-600 shadow-md"
                                    />
                                )}
                            </div>

                            {/* Banner Picture */}
                            <div>
                                <label className="block text-gray-300 mb-2 font-medium">
                                    Banner Picture
                                </label>
                                <input
                                    type="file"
                                    id="bannerPicture"
                                    onChange={(e) =>
                                        handleImageChange(
                                            e,
                                            setBannerImagePreview,
                                        )
                                    }
                                    className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    accept="image/*"
                                />
                                {bannerImagePreview && (
                                    <img
                                        src={bannerImagePreview}
                                        alt="Banner Preview"
                                        className="mt-4 w-full h-40 object-cover rounded-lg border border-gray-600 shadow-md"
                                    />
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-gray-200 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="text-gray-300">
                                <h2 className="text-3xl font-bold">
                                    {profile.username}
                                </h2>
                                <p>{profile.email}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-gray-200 mb-2">
                                    Year
                                </h3>
                                <p className="text-gray-300">{profile.year}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-gray-200 mb-2">
                                    Major
                                </h3>
                                <p className="text-gray-300">{profile.major}</p>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-gray-200 mb-2">
                                    Genre Interests
                                </h3>
                                <p className="text-gray-300">
                                    {profile.genre_interests}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-gray-200 mb-2">
                                    Biography
                                </h3>
                                <p className="text-gray-300">
                                    {profile.biography}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
