"use client";

import { useState, useEffect } from "react";
import { AtSign, MapPin, FileText, AlertCircle, Loader2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ProfileEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdated: () => void;
  userId: string;
}

export default function ProfileEditDialog({
  isOpen,
  onClose,
  onProfileUpdated,
  userId,
}: ProfileEditDialogProps) {
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    location: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/users/${userId}`);

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

    if (isOpen && userId) {
      fetchUserData();
    }
  }, [isOpen, userId]);

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
      const response = await fetch(`/api/users/${userId}`, {
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

      // Notify parent that profile was updated
      onProfileUpdated();

      // Close the dialog
      onClose();
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information below
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <AtSign className="w-4 h-4 text-gray-400" />
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter username"
                  required
                />
                <p className="text-xs text-gray-500">
                  This will be your unique username on CourtConnect.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  Location
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Gainesville, FL"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us a bit about yourself..."
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  Share your experience, skill level, or favorite sports.
                </p>
              </div>
            </div>

            <DialogFooter className="sm:justify-between">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
