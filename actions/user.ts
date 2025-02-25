"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

export async function syncUserWithDatabase() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      throw new Error("Unauthorized");
    }

    // Check if user already exists in our database
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // User exists, update their information if needed
      const updatedUser = await db.user.update({
        where: { clerkId: userId },
        data: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          avatarUrl: user.imageUrl,
        },
      });

      return { success: true, user: updatedUser };
    }

    // Create a new user in our database
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (!primaryEmail) {
      throw new Error("Email address is required");
    }

    const email = primaryEmail.emailAddress;

    // Create username from email (temporary)
    const tempUsername = email.split("@")[0];

    // Create the user
    const newUser = await db.user.create({
      data: {
        clerkId: userId,
        email,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        username: tempUsername,
        avatarUrl: user.imageUrl,
      },
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("[SYNC_USER]", error);
    return { success: false, error: "Failed to sync user information" };
  }
}
