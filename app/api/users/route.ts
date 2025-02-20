import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET() {
  const users = await prisma.user.findMany();

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { email, name } = await request.json();
  const newUser = await prisma.user.create({
    data: { email, name },
  });
  return NextResponse.json(newUser, { status: 201 });
}
