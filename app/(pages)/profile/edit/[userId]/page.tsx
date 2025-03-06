"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AtSign, FileText, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "@/components/navbar";
import { toast } from "sonner";

export default function ProfileEditPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    location: "",
  });

  useEffect(() => {
    // Redirect if not logged in
    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }

    const fetchUserData = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/users/${user.id}`);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("API error when fetching:", errorData);
          throw new Error(errorData.error || "Failed to fetch user data");
        }

        const userData = await response.json();

        setFormData({
          username: userData.username || "",
          bio: userData.bio || "",
          location: userData.location || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load your profile data");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user) {
      fetchUserData();
    }
  }, [user, isLoaded, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!user) {
      setError("You must be logged in to update your profile");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error when updating:", errorData);
        throw new Error(errorData.error || "Failed to update profile");
      }

      toast("Profile Updated", {
        description: "Your profile has been successfully updated.",
      });

      // Redirect to profile page on success
      router.push(`/profile/${user.id}`);
      router.refresh();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");

      toast("Error Updating Profile", {
        description: "An error occurred while updating your profile.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-3xl mx-auto px-8 py-6">
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-lg text-gray-500 flex flex-col items-center gap-2">
              <Loader2 className="size-6 animate-spin" />
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-8 py-6">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-gray-400" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Enter username"
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be your unique username on CourtConnect. It cannot
                  be changed frequently.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  placeholder="e.g. Gainesville, FL"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-2 border rounded-lg"
                  placeholder="Tell us a bit about yourself..."
                />
                <p className="text-xs text-gray-500">
                  Share your experience, skill level, favorite sports, or
                  anything else you&apos;d like others to know.
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${
                    saving
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
