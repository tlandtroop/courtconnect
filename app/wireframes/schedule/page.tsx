import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const GameScheduleWireframe = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar - Consistent across pages */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">CourtConnect</div>
          <div className="flex items-center gap-8">
            <nav className="flex gap-6">
              <div className="cursor-pointer">Dashboard</div>
              <div className="cursor-pointer">Find Courts</div>
              <div className="text-blue-600 cursor-pointer">Schedule Game</div>
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
          {/* Create Game Form */}
          <div className="col-span-8">
            <Card>
              <CardHeader>
                <CardTitle>Schedule a New Game</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Court Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Select Court
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2].map((court) => (
                        <div
                          key={court}
                          className="border rounded-lg p-4 cursor-pointer hover:border-blue-500"
                        >
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                            <div>
                              <div className="font-medium">
                                Court Name #{court}
                              </div>
                              <div className="text-sm text-gray-500">
                                2.3 miles away
                              </div>
                              <div className="mt-2 flex gap-2">
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                  Available
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date and Time */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="date"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <input
                          type="time"
                          className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Game Type
                      </label>
                      <select className="w-full p-2 border rounded-lg">
                        <option>Pickleball - Singles</option>
                        <option>Pickleball - Doubles</option>
                        <option>Basketball - 3v3</option>
                        <option>Basketball - 5v5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Skill Level
                      </label>
                      <select className="w-full p-2 border rounded-lg">
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>All Levels Welcome</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Number of Players Needed
                      </label>
                      <input
                        type="number"
                        className="w-full p-2 border rounded-lg"
                        placeholder="Enter number of players"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Additional Notes
                      </label>
                      <textarea
                        className="w-full p-2 border rounded-lg"
                        rows={3}
                        placeholder="Add any additional information about the game..."
                      />
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
                    Create Game
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Available Times */}
          <div className="col-span-4 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Court Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((slot) => (
                    <div
                      key={slot}
                      className="p-3 border rounded-lg hover:border-blue-500 cursor-pointer"
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium">2:00 PM - 3:00 PM</div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Available
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Court #1</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weather Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((forecast) => (
                    <div
                      key={forecast}
                      className="flex items-center justify-between p-2"
                    >
                      <div className="text-sm">2:00 PM</div>
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <div className="text-sm">72°</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameScheduleWireframe;
