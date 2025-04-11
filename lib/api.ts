import { NextResponse } from "next/server";

type ApiResponseData = {
  success: boolean;
  error?: string;
  [key: string]: unknown;
};

export function successResponse(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(
    {
      success: true,
      ...data,
    } as ApiResponseData,
    { status }
  );
}

export function errorResponse(message: string, status = 500) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    } as ApiResponseData,
    { status }
  );
}
