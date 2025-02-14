import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';
import redisClient from '../../../lib/redis';

export async function GET() {
  const cachedData = await redisClient.get('users');
  if (cachedData) {
    return NextResponse.json(JSON.parse(cachedData));
  }

  const users = await prisma.user.findMany();
  await redisClient.set('users', JSON.stringify(users), { EX: 60 }); // Cache for 60 seconds
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { email, name } = await request.json();
  const newUser = await prisma.user.create({
    data: { email, name },
  });
  return NextResponse.json(newUser, { status: 201 });
}