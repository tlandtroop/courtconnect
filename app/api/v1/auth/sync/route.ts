import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user exists in database
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      // Update existing user
      await prisma.user.update({
        where: { clerkId: userId },
        data: {
          lastActive: new Date(),
        },
      });
    } else {
      // Create new user with generated email if none provided
      await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@courtconnect.app`,
          name: "Anonymous",
          username: userId,
          lastActive: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true });
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
