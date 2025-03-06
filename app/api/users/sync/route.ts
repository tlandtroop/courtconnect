import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

import db from "@/lib/db";

export async function GET() {
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
      // User exists, just return their info
      return NextResponse.json(existingUser);
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
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    console.error("[SYNC_USER]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
