import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";

// Helper function for consistent error responses
const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ success: false, error: message }, { status });
};

// Helper function for successful responses
const successResponse = (data: Record<string, unknown>) => {
  return NextResponse.json({ success: true, ...data });
};

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return errorResponse("Unauthorized", 401);
    }

    // Check if user already exists in our database
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        updatedAt: true,
      },
    });

    // If user exists and was updated recently (e.g., within the last hour), skip sync
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (existingUser && existingUser.updatedAt > oneHourAgo) {
      return successResponse({ user: existingUser });
    }

    const primaryEmail = user.emailAddresses.find(
      (email) => email.id === user.primaryEmailAddressId
    );

    if (!primaryEmail) {
      return errorResponse("Email address is required");
    }

    const email = primaryEmail.emailAddress;
    const tempUsername = email.split("@")[0];
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    if (existingUser) {
      // Update existing user
      const updatedUser = await db.user.update({
        where: { clerkId: userId },
        data: {
          email,
          name,
          username: tempUsername,
          avatarUrl: user.imageUrl,
        },
      });

      revalidatePath(`/profile/${userId}`);
      revalidatePath("/dashboard");

      return successResponse({ user: updatedUser });
    } else {
      // Create new user
      const newUser = await db.user.create({
        data: {
          clerkId: userId,
          email,
          name,
          username: tempUsername,
          avatarUrl: user.imageUrl,
        },
      });

      revalidatePath(`/profile/${userId}`);
      revalidatePath("/dashboard");

      return successResponse({ user: newUser });
    }
  } catch (error) {
    console.error("[SYNC_USER]", error);
    return errorResponse("Failed to sync user");
  }
}
