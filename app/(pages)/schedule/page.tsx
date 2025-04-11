"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import GameForm from "@/app/(pages)/schedule/_components/game-form";
import CourtAvailability from "@/app/(pages)/schedule/_components/court-availability";

export default function SchedulePage() {
  const searchParams = useSearchParams();
  const courtId = searchParams.get("courtId") || undefined;

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <GameForm preselectedCourtId={courtId} />
          </div>
          <div className="col-span-4 space-y-6">
            <CourtAvailability />
          </div>
        </div>
      </div>
    </div>
  );
}
