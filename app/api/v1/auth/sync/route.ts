import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user data from Clerk
    const { sessionClaims } = await auth();
    if (!sessionClaims) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const email = sessionClaims.email as string;
    const firstName = sessionClaims.firstName as string;
    const lastName = sessionClaims.lastName as string;
    const username = sessionClaims.username as string;
    const imageUrl = sessionClaims.imageUrl as string;

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // Update existing user
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          email,
          name:
            firstName && lastName
              ? `${firstName} ${lastName}`
              : firstName || username || "Anonymous",
          username: username || email?.split("@")[0] || "anonymous",
          avatarUrl: imageUrl,
          lastActive: new Date(),
        },
      });
    } else {
      // Create new user
      await prisma.user.create({
        data: {
          clerkId: userId,
          email,
          name:
            firstName && lastName
              ? `${firstName} ${lastName}`
              : firstName || username || "Anonymous",
          username: username || email?.split("@")[0] || "anonymous",
          avatarUrl: imageUrl,
          lastActive: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Failed to sync user" }, { status: 500 });
  }
}
