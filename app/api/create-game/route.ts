import { NextResponse } from 'next/server';
import prisma from '../../../lib/db'; // Make sure you have prisma instance properly imported

export async function POST(req: Request) {
  try {
    const { date, startTime, gameType, skillLevel, playersNeeded, notes, courtId, organizerId } = await req.json();

    // Create a new game in the database
    const game = await prisma.game.create({
      data: {
        date: new Date(date),
        startTime: new Date(`${date}T${startTime}`),
        gameType,
        skillLevel,
        playersNeeded,
        notes,
        courtId: parseInt(courtId),
        organizerId,
      },
    });

    // Return the newly created game as response
    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 });
  }
}
