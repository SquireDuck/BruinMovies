"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Profile {
  username: string;
  email: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Profile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/signin");
      return;
    }

    fetchProfile(token);
  }, [router]);

  const fetchProfile = async (token: string) => {
    try {
      const response = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditedProfile(data);
      } else {
        throw new Error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProfile),
      });

      if (response.ok) {
        setProfile(editedProfile);
        setIsEditing(false);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    router.push("/signin");
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <div className="text-2xl font-semibold animate-pulse">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
        <p className="text-red-500 text-lg font-semibold mb-4">{error}</p>
        <button
          onClick={() => router.push("/signin")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all"
        >
          Back to Sign In
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-700 text-white flex items-center justify-center">
      <div className="w-full max-w-lg bg-gray-900 p-8 rounded-2xl shadow-xl transform transition duration-500 hover:scale-105">
        <div className="flex flex-col items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile Icon"
            className="w-32 h-32 rounded-full shadow-lg mb-6"
          />
          <h1 className="text-3xl font-bold mb-4 text-yellow-400">
            {isEditing ? "Edit Profile" : "Profile"}
          </h1>
        </div>

        {profile && editedProfile && (
          <div>
            {isEditing ? (
              <div>
                <div className="mb-4">
                  <label className="block text-lg font-semibold mb-2">
                    Username:
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editedProfile.username}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-lg font-semibold mb-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editedProfile.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-lg transition-all"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold mb-4">
                  <span className="text-yellow-400">Username:</span>{" "}
                  {profile.username}
                </p>
                <p className="text-lg font-semibold mb-6">
                  <span className="text-yellow-400">Email:</span> {profile.email}
                </p>
                <button
                  onClick={handleEdit}
                  className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg mb-4 transition-all"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleSignOut}
          className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-lg transition-all"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
