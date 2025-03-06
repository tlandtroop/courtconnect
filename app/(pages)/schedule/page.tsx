import React from "react";
import Navbar from "@/components/navbar";
import GameForm from "@/components/game-form";
import CourtAvailability from "@/components/court-availability";
import WeatherForecast from "@/components/weather-forecast";

export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar - Consistent across pages */}
      <Navbar />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Create Game Form */}
          <div className="col-span-8">
            <GameForm />
          </div>
          {/* Right Sidebar - Available Times */}
          <div className="col-span-4 space-y-6">
            <CourtAvailability />
            <WeatherForecast />
          </div>
        </div>
      </div>
    </div>
  );
}
