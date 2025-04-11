"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GameForm from "@/app/(main)/schedule/_components/game-form";

function ScheduleContent() {
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

export default function SchedulePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <div className="max-w-3xl mx-auto px-8 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      }
    >
      <ScheduleContent />
    </Suspense>
  );
}
