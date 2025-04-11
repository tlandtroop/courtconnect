import { db } from "@/lib/db";
import { withAuth } from "@/lib/auth";
import { successResponse, errorResponse } from "@/lib/api";

export const GET = withAuth(async (request) => {
  const searchParams = request.nextUrl.searchParams;
  const courtId = searchParams.get("id");
  const googlePlaceId = searchParams.get("googlePlaceId");

  if (googlePlaceId) {
    try {
      const court = await db.court.findFirst({
        where: {
          OR: [{ googlePlaceId }, { id: googlePlaceId }],
        },
      });

      if (!court) {
        return errorResponse("Court not found", 404);
      }

      return successResponse({ court });
    } catch (error) {
      console.error("[GET_COURT]", error);
      return errorResponse("Failed to get court", 500);
    }
  }

  if (courtId) {
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
                },
              },
              participants: {
                select: {
                  id: true,
                  clerkId: true,
                  name: true,
                  username: true,
                  avatarUrl: true,
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
      return errorResponse("Failed to get court", 500);
    }
  }

  // Get all courts
  try {
    const courts = await db.court.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return successResponse({ courts });
  } catch (error) {
    console.error("[GET_COURTS]", error);
    return errorResponse("Failed to get courts", 500);
  }
});

export const POST = withAuth(async (request) => {
  try {
    const body = await request.json();
    const {
      name,
      description,
      latitude,
      longitude,
      address,
      city,
      state,
      zipCode,
      courtType,
      amenities,
      images,
      googlePlaceId,
    } = body;

    if (!name || !latitude || !longitude) {
      return errorResponse("Missing required fields", 400);
    }

    // First check if a court with this Google Place ID already exists
    if (googlePlaceId) {
      const existingCourt = await db.court.findFirst({
        where: {
          googlePlaceId,
        },
      });

      if (existingCourt) {
        return successResponse({ court: existingCourt });
      }
    }

    const court = await db.court.create({
      data: {
        name,
        description: description || name,
        latitude,
        longitude,
        address: address || "",
        city: city || "",
        state: state || "",
        zipCode: zipCode || "",
        courtType: courtType || "Unknown",
        amenities: amenities || [],
        images: images || [],
        googlePlaceId: googlePlaceId || null,
      },
    });

    return successResponse({ court });
  } catch (error) {
    console.error("[CREATE_COURT]", error);
    return errorResponse("Failed to create court", 500);
  }
});
