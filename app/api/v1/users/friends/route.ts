import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Helper function for consistent error responses
const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ success: false, error: message }, { status });
};

// Helper function for successful responses
const successResponse = (data: Record<string, unknown>) => {
  return NextResponse.json({ success: true, ...data });
};

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    // Get the friend ID from the query params
    const friendId = request.nextUrl.searchParams.get("id");
    if (!friendId) {
      return errorResponse("Friend ID is required");
    }

    // Get the current user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Get the friend using clerkId
    const friend = await db.user.findUnique({
      where: { clerkId: friendId },
    });

    if (!friend) {
      return errorResponse("Friend not found", 404);
    }

    // Check if they're already friends
    const alreadyFriends = await db.user.findFirst({
      where: {
        id: user.id,
        friends: {
          some: {
            id: friend.id,
          },
        },
      },
    });

    if (alreadyFriends) {
      return errorResponse("Already friends with this user");
    }

    // Add friend connection
    await db.user.update({
      where: { id: user.id },
      data: {
        friends: {
          connect: { id: friend.id },
        },
      },
    });

    // Add reciprocal connection
    await db.user.update({
      where: { id: friend.id },
      data: {
        friends: {
          connect: { id: user.id },
        },
      },
    });

    return successResponse({ message: "Friend added successfully" });
  } catch (error) {
    console.error("Error adding friend:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to add friend",
      500
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    // Get the friend ID from the query params
    const friendId = request.nextUrl.searchParams.get("id");
    if (!friendId) {
      return errorResponse("Friend ID is required");
    }

    // Get the current user
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return errorResponse("User not found", 404);
    }

    // Get the friend using clerkId
    const friend = await db.user.findUnique({
      where: { clerkId: friendId },
    });

    if (!friend) {
      return errorResponse("Friend not found", 404);
    }

    // Remove friend connection
    await db.user.update({
      where: { id: user.id },
      data: {
        friends: {
          disconnect: { id: friend.id },
        },
      },
    });

    // Remove reciprocal connection
    await db.user.update({
      where: { id: friend.id },
      data: {
        friends: {
          disconnect: { id: user.id },
        },
      },
    });

    return successResponse({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Failed to remove friend",
      500
    );
  }
}
