"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Filters from "@/components/filters";
import GoogleMaps from "@/components/google-maps";
import CourtLists from "@/components/court-lists";

export default function CourtsPage() {
  const [searchValue, setSearchValue] = useState("sports+courts+in+Gainesville");
  const handleValueChange = (newValue: any) => {
    const words: string[] = newValue.split(/\s+/);
    const val: string = words.join("+");
    setSearchValue(val);
  };
  const [checkedPickle, setCheckedPickle] = useState(false);
  const handlePickleChange = (newPickle: any) => {
    setCheckedPickle(newPickle);
    if (!checkedPickle) {
      const val = searchValue + "+pickleball";
      setSearchValue(val);
    }
    else {
      const words: string[] = searchValue.split(/\+pickleball/)
      const val: string = words.join("+");
      setSearchValue(val);
    }
  }
  const [checkedBasket, setCheckedBasket] = useState(false);
  const handleBasketChange = (newBasket: any) => {
    setCheckedBasket(newBasket);
    if (!checkedBasket) {
      const val = searchValue + "+basketball";
      setSearchValue(val);
    }
    else {
      const words: string[] = searchValue.split(/\+basketball/);
      const val: string = words.join("+");
      setSearchValue(val);
    }
  }
  const [checkedTennis, setCheckedTennis] = useState(false);
  const handleTennisChange = (newTennis: any) => {
    setCheckedTennis(newTennis);
    if (!checkedTennis) {
      const val = searchValue + "+tennis";
      setSearchValue(val);
    }
    else {
      const words: string[] = searchValue.split(/\+tennis/);
      const val: string = words.join("+");
      setSearchValue(val);
    }
  }
  const [checkedVolley, setCheckedVolley] = useState(false);
  const handleVolleyChange = (newVolley: any) => {
    setCheckedVolley(newVolley);
    if (!checkedVolley) {
      const val = searchValue + "+volleyball";
      setSearchValue(val);
    }
    else {
      const words: string[] = searchValue.split(/\+volleyball/);
      const val: string = words.join("+");
      setSearchValue(val);
    }
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="col-span-3 space-y-6">
            <Filters 
              onValueChange={handleValueChange} 
              onPickleChange={handlePickleChange} 
              onBasketChange={handleBasketChange} 
              onTennisChange={handleTennisChange} 
              onVolleyChange={handleVolleyChange} 
          />
          </div>
          <div className="col-span-9 space-y-6">
            <GoogleMaps searchValue={searchValue} />
            <CourtLists />
          </div>
        </div>
      </div>
    </div>
  );
}
