import { Search, } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Filters = ({value, onValueChange}:any) => {
  const handleSearch = (event:any) => {
    onValueChange(event.target.value)
  }
  const handleClick = () => {
    window.location.reload()
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
            value={value}
            onChange={handleSearch}
          />
        </div>
        <div className="w-full pl-10 pr-4 py-2 border rounded-lg">
          <button onClick={handleClick}>Search</button>
        </div>
        {/* Filters */}
        <div className="space-y-4">
          <div className="font-medium">Filters</div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Pickleball Courts</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Basketball Courts</span>
            </label>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Distance</div>
            <input type="range" className="w-full" />
            <div className="text-sm text-gray-500">
              Within 5 miles
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Amenities</div>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Lights</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Water Fountain</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Restrooms</span>
            </label>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
  );
};

export default Filters;
