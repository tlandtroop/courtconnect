import React from "react";
import { Search, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Filters = ({onValueChange, onPickleChange, onBasketChange, onTennisChange, onVolleyChange, slider, onSliderChange}:any) => {
  const handleSearch = (event:any) => {
    onValueChange(event.target.value)
  }
  const handlePickleCheck = (event:any) => {
    onPickleChange(event.target.checked);
  }
  const handleBasketCheck = (event:any) => {
    onBasketChange(event.target.checked);
  }
  const handleTennisCheck = (event:any) => {
    onTennisChange(event.target.checked);
  }
  const handleVolleyChange = (event:any) => {
    onVolleyChange(event.target.checked);
  }
  const handleSlide = (event:any) => {
    onSliderChange(event.target.value);
  }
  return (
    <Card>
    <CardHeader>
      <CardTitle>Search Courts</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            type="text"
            placeholder="Search by location..."
            onChange={handleSearch}
          />
        </div>
        {/* Filters */}
        <div className="space-y-4">
          <div className="font-medium">Filters</div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" onChange={handlePickleCheck} />
              <span>Pickleball Courts</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" onChange={handleBasketCheck} />
              <span>Basketball Courts</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" onChange={handleTennisCheck} />
              <span>Tennis Courts</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" onChange={handleVolleyChange} />
              <span>Volleyball Courts</span>
            </label>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Distance</div>
            <input type="range" className="w-full" 
              step={1} 
              min={1} 
              max={10} 
              onChange={handleSlide}
            />
            <div className="text-sm text-gray-500">
              Within {slider} miles
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  );
};

export default Filters;
