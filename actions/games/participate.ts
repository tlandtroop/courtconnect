"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import db from "@/lib/db";

export async function joinGame(gameId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Find the user in our database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Find the game
    const game = await db.game.findUnique({
      where: { id: gameId },
      include: {
        participants: true,
      },
    });

    if (!game) {
      return { success: false, error: "Game not found" };
    }

    // Check if the game is in the past
    if (new Date(game.date) < new Date()) {
      return {
        success: false,
        error: "Cannot join a game that has already taken place",
      };
    }

    // Check if the game is full
    if (game.participants.length >= game.playersNeeded) {
      return { success: false, error: "Game is already full" };
    }

    // Check if user is already a participant
    const isParticipant = game.participants.some(
      (participant) => participant.id === user.id
    );

    if (isParticipant) {
      return {
        success: false,
        error: "You are already a participant in this game",
      };
    }

    // Add user to participants
    const updatedGame = await db.game.update({
      where: { id: gameId },
      data: {
        participants: {
          connect: { id: user.id },
        },
      },
      include: {
        court: true,
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
    });

    // Revalidate paths
    revalidatePath(`/games/${gameId}`);
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/dashboard");

    return { success: true, game: updatedGame };
  } catch (error) {
    console.error("[JOIN_GAME]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to join game",
    };
  }
}

export async function leaveGame(gameId: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: "Unauthorized" };
    }

    // Find the user in our database
    const user = await db.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // Find the game
    const game = await db.game.findUnique({
      where: { id: gameId },
      include: {
        participants: true,
      },
    });

    if (!game) {
      return { success: false, error: "Game not found" };
    }

    // Check if the user is the organizer
    if (game.organizerId === user.id) {
      return {
        success: false,
        error: "Organizers cannot leave their own games",
      };
    }

    // Check if user is a participant
    const isParticipant = game.participants.some(
      (participant) => participant.id === user.id
    );

    if (!isParticipant) {
      return {
        success: false,
        error: "You are not a participant in this game",
      };
    }

    // Remove user from participants
    const updatedGame = await db.game.update({
      where: { id: gameId },
      data: {
        participants: {
          disconnect: { id: user.id },
        },
      },
      include: {
        court: true,
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
    });

    // Revalidate paths
    revalidatePath(`/games/${gameId}`);
    revalidatePath(`/profile/${userId}`);
    revalidatePath("/dashboard");

    return { success: true, game: updatedGame };
  } catch (error) {
    console.error("[LEAVE_GAME]", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to leave game",
    };
  }
}
