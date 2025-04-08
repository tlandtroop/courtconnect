import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { User } from "@prisma/client";

type UserWithRelations = User & {
  games: Array<{
    id: string;
    date: Date;
    gameType: string;
    skillLevel: string;
    court: {
      id: string;
      name: string;
    };
  }>;
  createdGames: Array<{
    id: string;
    date: Date;
    gameType: string;
    skillLevel: string;
    court: {
      id: string;
      name: string;
    };
  }>;
  favorites: Array<{
    id: string;
    name: string;
  }>;
  friends: Array<{
    id: string;
    clerkId: string;
    name: string;
    username: string;
    avatarUrl: string;
    rating: number;
  }>;
};

// Helper function for consistent error responses
const errorResponse = (message: string, status: number = 400) => {
  return NextResponse.json({ success: false, error: message }, { status });
};

// Helper function for successful responses
const successResponse = (data: Record<string, unknown>) => {
  return NextResponse.json({ success: true, ...data });
};

// Middleware for authentication
const withAuth = async (handler: (userId: string) => Promise<NextResponse>) => {
  const { userId } = await auth();
  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }
  return handler(userId);
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get("id");
  const type = searchParams.get("type");

  if (userId) {
    return withAuth(async () => {
      try {
        if (type === "dashboard") {
          const user = await db.user.findUnique({
            where: { clerkId: userId },
            select: {
              id: true,
              clerkId: true,
              name: true,
              username: true,
              bio: true,
              location: true,
              avatarUrl: true,
              rating: true,
              gamesPlayed: true,
              courtsVisited: true,
              _count: {
                select: {
                  friends: true,
                },
              },
            },
          });

          if (!user) {
            return errorResponse("User not found", 404);
          }

          return successResponse({ user });
        } else {
          const user = await db.user.findUnique({
            where: { clerkId: userId },
            include: {
              games: {
                include: {
                  court: true,
                },
                orderBy: {
                  date: "desc",
                },
                take: 5,
              },
              createdGames: {
                include: {
                  court: true,
                },
                where: {
                  date: {
                    gte: new Date(),
                  },
                },
                orderBy: {
                  date: "asc",
                },
              },
              favorites: true,
              friends: {
                select: {
                  id: true,
                  clerkId: true,
                  name: true,
                  username: true,
                  avatarUrl: true,
                  rating: true,
                },
              },
            },
          });

          if (!user) {
            return errorResponse("User not found", 404);
          }

          return successResponse({ user });
        }
      } catch (error) {
        console.error("[GET_USER]", error);
        return errorResponse("Failed to get user");
      }
    });
  }

  // Get current user
  return withAuth(async (userId: string) => {
    try {
      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return errorResponse("User not found", 404);
      }

      return successResponse({ user });
    } catch (error) {
      console.error("[GET_CURRENT_USER]", error);
      return errorResponse("Failed to get current user");
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (userId: string) => {
    try {
      const body = await request.json();
      const { action, friendId } = body;

      if (!action) {
        return errorResponse("Missing required fields");
      }

      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return errorResponse("User not found", 404);
      }

      if (action === "add-friend") {
        if (!friendId) {
          return errorResponse("Friend ID is required");
        }

        const friend = await db.user.findUnique({
          where: { id: friendId },
        });

        if (!friend) {
          return errorResponse("Friend not found", 404);
        }

        if (user.id === friend.id) {
          return errorResponse("Cannot add yourself as a friend");
        }

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

        await db.user.update({
          where: { id: user.id },
          data: {
            friends: {
              connect: { id: friend.id },
            },
          },
        });

        await db.user.update({
          where: { id: friend.id },
          data: {
            friends: {
              connect: { id: user.id },
            },
          },
        });

        revalidatePath(`/profile/${userId}`);
        revalidatePath(`/profile/${friend.clerkId}`);

        return successResponse({});
      }

      return errorResponse("Invalid action");
    } catch (error) {
      console.error("[UPDATE_USER]", error);
      return errorResponse("Failed to update user");
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withAuth(async (userId: string) => {
    try {
      const body = await request.json();
      const { username, bio, location } = body;

      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return errorResponse("User not found", 404);
      }

      if (username) {
        const existingUser = await db.user.findFirst({
          where: {
            username,
            NOT: {
              id: user.id,
            },
          },
        });

        if (existingUser) {
          return errorResponse("Username is already taken");
        }
      }

      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: {
          username,
          bio,
          location,
        },
      });

      revalidatePath(`/profile/${userId}`);
      revalidatePath("/dashboard");

      return successResponse({ user: updatedUser });
    } catch (error) {
      console.error("[UPDATE_PROFILE]", error);
      return errorResponse("Failed to update profile");
    }
  });
}
