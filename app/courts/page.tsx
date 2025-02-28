"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Filters from "@/components/filters";
import GoogleMaps from "@/components/google-maps";
import CourtLists from "@/components/court-lists";

export default function CourtsPage() {
  const [apiKey, setApiKey] = useState(process.env.GOOGLE_MAPS_API);
  const [searchValue, setSearchValue] = useState("sports+courts+in+Gainesville");
  const handleValueChange = (newValue: any) => {
    const words: string[] = newValue.split(/\s+/);
    const val: string = words.join("+");
    setSearchValue(val);
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="col-span-3 space-y-6">
            <Filters value={searchValue} onValueChange={handleValueChange} />
          </div>
          <div className="col-span-9 space-y-6">
            <GoogleMaps searchValue={searchValue} apiKey={apiKey} />
            <CourtLists />
          </div>
        </div>
      </div>
    </div>
  );
}
