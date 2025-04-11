import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get primary email
    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (!primaryEmail) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

    const email = primaryEmail.emailAddress;
    const name =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Anonymous";
    const username = user.username || email.split("@")[0];

    // Check if user exists in database
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // Update existing user
      const updatedUser = await db.user.update({
        where: { clerkId: userId },
        data: {
          email,
          name,
          username,
          avatarUrl: user.imageUrl,
          lastActive: new Date(),
        },
      });

      return NextResponse.json({ success: true, user: updatedUser });
    } else {
      // Create new user
      const newUser = await db.user.create({
        data: {
          clerkId: userId,
          email,
          name,
          username,
          avatarUrl: user.imageUrl,
          lastActive: new Date(),
        },
      });

      return NextResponse.json({ success: true, user: newUser });
    }
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      {
        error: "Failed to sync user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
