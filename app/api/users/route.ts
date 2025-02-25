import { NextResponse } from "next/server";

import db from "@/lib/db";

export async function GET() {
  const users = await db.user.findMany();

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const { email, name } = await request.json();
  const newUser = await db.user.create({
    data: { email, name },
  });
  return NextResponse.json(newUser, { status: 201 });
}
