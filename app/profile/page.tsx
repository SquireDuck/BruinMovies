"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Profile {
  username: string;
  email: string;
  biography: string;
  profilePicture: string;
  bannerPicture: string;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
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
  }, []);

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
    setPreview: (preview: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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
      formData.append("biography", profile.biography);

      const profilePictureInput = document.getElementById("profilePicture") as HTMLInputElement;
      const bannerPictureInput = document.getElementById("bannerPicture") as HTMLInputElement;

      if (profilePictureInput?.files?.[0]) {
        formData.append("profilePicture", profilePictureInput.files[0]);
      }

      if (bannerPictureInput?.files?.[0]) {
        formData.append("bannerPicture", bannerPictureInput.files[0]);
      }

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
        throw new Error(errorData.message || "Failed to update profile");
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

  if (!profile)
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
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded mx-10"
            >
              Sign Out
            </button>
            <button
              onClick={() => router.push("/movie-page")}
              className=" bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
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
        <div className="absolute left-6 -bottom-12">
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-24 h-24 object-cover rounded-full border-4 bg-slate-300 border-black shadow-lg"
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
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
                    setProfile({ ...profile, username: e.target.value })
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
                    setProfile({ ...profile, email: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Biography */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Biography
                </label>
                <textarea
                  value={profile.biography}
                  onChange={(e) =>
                    setProfile({ ...profile, biography: e.target.value })
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
                  onChange={(e) => handleImageChange(e, setProfileImagePreview)}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  accept="image/*"
                />
                {profileImagePreview && (
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
                  onChange={(e) => handleImageChange(e, setBannerImagePreview)}
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
                <h2 className="text-3xl font-bold">{profile.username}</h2>
                <p>{profile.email}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-200 mb-2">
                  Biography
                </h3>
                <p className="text-gray-300">{profile.biography}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
