import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Star, Users } from "lucide-react";

const CourtMapWireframe = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar - Consistent across pages */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">CourtConnect</div>
          <div className="flex items-center gap-8">
            <nav className="flex gap-6">
              <div className="cursor-pointer">Dashboard</div>
              <div className="text-blue-600 cursor-pointer">Find Courts</div>
              <div className="cursor-pointer">Schedule Game</div>
              <div className="cursor-pointer">Discussions</div>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-32 text-sm">John Doe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="col-span-3 space-y-6">
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
                      placeholder="Search by location..."
                    />
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
          </div>

          {/* Main Map Area */}
          <div className="col-span-9 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="bg-gray-200 h-[600px] rounded-lg flex items-center justify-center">
                Interactive Map
              </div>
            </div>

            {/* Court List */}
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((court) => (
                <Card key={court}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-grow">
                        <div className="flex items-center justify-between">
                          <div className="font-medium">Court Name #{court}</div>
                          <Star className="h-4 w-4 text-yellow-400" />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          2.3 miles away
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-sm">
                          <Users className="h-4 w-4" />
                          <span>8 players here now</span>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Open
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            Lights
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourtMapWireframe;
