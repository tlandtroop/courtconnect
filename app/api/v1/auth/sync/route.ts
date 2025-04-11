import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data directly from Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("Clerk user data:", JSON.stringify(user, null, 2));

    const email = user.emailAddresses[0]?.emailAddress;
    const firstName = user.firstName;
    const lastName = user.lastName;
    const username = user.username;
    const imageUrl = user.imageUrl;

    console.log("Extracted data:", {
      email,
      firstName,
      lastName,
      username,
      imageUrl,
    });

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // Update existing user
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          email: email || existingUser.email,
          name:
            firstName && lastName
              ? `${firstName} ${lastName}`
              : firstName ||
                lastName ||
                username ||
                email?.split("@")[0] ||
                existingUser.name ||
                "Anonymous",
          username: username || email?.split("@")[0] || userId,
          avatarUrl: imageUrl || existingUser.avatarUrl,
          lastActive: new Date(),
        },
      });
    } else {
      // Create new user with generated email if none provided
      const userEmail = email || `${userId}@courtconnect.app`;
      await prisma.user.create({
        data: {
          clerkId: userId,
          email: userEmail,
          name:
            firstName && lastName
              ? `${firstName} ${lastName}`
              : firstName ||
                lastName ||
                username ||
                email?.split("@")[0] ||
                "Anonymous",
          username: username || email?.split("@")[0] || userId,
          avatarUrl: imageUrl,
          lastActive: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Detailed error syncing user:", error);
    return NextResponse.json(
      {
        error: "Failed to sync user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
