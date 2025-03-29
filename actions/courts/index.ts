"use server";

import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function getCourts() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    const courts = await db.court.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return { success: true, courts };
  } catch (error) {
    console.error("[GET_COURTS]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch courts",
    };
  }
}
