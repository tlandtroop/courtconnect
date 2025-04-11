"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import GameForm from "@/app/(pages)/schedule/_components/game-form";

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const courtId = searchParams.get("courtId") || undefined;

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-8 py-6">
        <GameForm preselectedCourtId={courtId} />
      </div>
    </div>
  );
}
