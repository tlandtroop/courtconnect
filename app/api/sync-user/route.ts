import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import db from "@/lib/db";

export async function POST() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already exists in our database
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // User exists, just update their information if needed
      const updatedUser = await db.user.update({
        where: { clerkId: userId },
        data: {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          avatarUrl: user.imageUrl,
        },
      });

      return NextResponse.json({ success: true, user: updatedUser });
    }

    // Create a new user in our database
    const email = user.emailAddresses[0]?.emailAddress;

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required" },
        { status: 400 }
      );
    }

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
        rating: 2.5, // Default rating for new users
        gamesPlayed: 0,
        courtsVisited: 0,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("[SYNC_USER]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
