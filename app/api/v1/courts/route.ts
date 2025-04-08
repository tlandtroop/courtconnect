import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Court, User } from "@prisma/client";

type CourtWithRelations = Court & {
  games: Array<{
    id: string;
    date: Date;
    startTime: Date;
    gameType: string;
    skillLevel: string;
    playersNeeded: number;
    organizer: Pick<
      User,
      "id" | "clerkId" | "name" | "username" | "avatarUrl" | "rating"
    >;
    participants: Pick<
      User,
      "id" | "clerkId" | "name" | "username" | "avatarUrl" | "rating"
    >[];
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
  const courtId = searchParams.get("id");
  const userId = searchParams.get("userId");

  if (courtId) {
    return withAuth(async () => {
      try {
        const court = await db.court.findUnique({
          where: { id: courtId },
          include: {
            games: {
              where: {
                date: {
                  gte: new Date(),
                },
                status: "scheduled",
              },
              include: {
                organizer: {
                  select: {
                    id: true,
                    clerkId: true,
                    name: true,
                    username: true,
                    avatarUrl: true,
                    rating: true,
                  },
                },
                participants: {
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
              orderBy: {
                date: "asc",
              },
              take: 5,
            },
          },
        });

        if (!court) {
          return errorResponse("Court not found", 404);
        }

        return successResponse({ court });
      } catch (error) {
        console.error("[GET_COURT]", error);
        return errorResponse("Failed to get court");
      }
    });
  }

  if (userId) {
    return withAuth(async () => {
      try {
        const user = await db.user.findUnique({
          where: { clerkId: userId },
          include: {
            favorites: true,
          },
        });

        if (!user) {
          return errorResponse("User not found", 404);
        }

        return successResponse({ favorites: user.favorites });
      } catch (error) {
        console.error("[GET_FAVORITE_COURTS]", error);
        return errorResponse("Failed to get favorite courts");
      }
    });
  }

  // Get all courts
  return withAuth(async () => {
    try {
      const courts = await db.court.findMany({
        orderBy: {
          name: "asc",
        },
      });

      return successResponse({ courts });
    } catch (error) {
      console.error("[GET_COURTS]", error);
      return errorResponse("Failed to get courts");
    }
  });
}

export async function POST(request: NextRequest) {
  return withAuth(async (userId: string) => {
    try {
      const body = await request.json();
      const { courtId, action } = body;

      if (!courtId || !action) {
        return errorResponse("Missing required fields");
      }

      const user = await db.user.findUnique({
        where: { clerkId: userId },
      });

      if (!user) {
        return errorResponse("User not found", 404);
      }

      const court = await db.court.findUnique({
        where: { id: courtId },
      });

      if (!court) {
        return errorResponse("Court not found", 404);
      }

      if (action === "favorite") {
        await db.user.update({
          where: { id: user.id },
          data: {
            favorites: {
              connect: { id: court.id },
            },
          },
        });

        revalidatePath(`/profile/${userId}`);
        revalidatePath("/courts");

        return successResponse({});
      } else if (action === "unfavorite") {
        await db.user.update({
          where: { id: user.id },
          data: {
            favorites: {
              disconnect: { id: court.id },
            },
          },
        });

        revalidatePath(`/profile/${userId}`);
        revalidatePath("/courts");

        return successResponse({});
      }

      return errorResponse("Invalid action");
    } catch (error) {
      console.error("[UPDATE_COURT_FAVORITE]", error);
      return errorResponse("Failed to update court favorite status");
    }
  });
}
