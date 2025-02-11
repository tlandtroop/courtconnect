import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Settings,
  Calendar,
  Star,
  Users,
  Activity,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const ProfileWireframe = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">CourtConnect</div>
          <div className="flex items-center gap-8">
            <nav className="flex gap-6">
              <Link href="/wireframes/dashboard" className="cursor-pointer">
                Dashboard
              </Link>
              <Link href="/wireframes/map" className="cursor-pointer">
                Find Courts
              </Link>
              <Link href="/wireframes/scheduling" className="cursor-pointer">
                Schedule Game
              </Link>
              <Link href="/wireframes/discussions" className="cursor-pointer">
                Discussions
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="w-32 text-sm">John Doe</div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div className="flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">John Doe</h1>
                  <p className="text-gray-500">@johndoe</p>
                  <div className="flex items-center gap-2 mt-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Gainesville, FL</span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="text-center">
                  <div className="font-bold text-xl">24</div>
                  <div className="text-sm text-gray-500">Games Played</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">4.8</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">12</div>
                  <div className="text-sm text-gray-500">Friends</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-xl">8</div>
                  <div className="text-sm text-gray-500">Courts Visited</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8 space-y-6">
            {/* Upcoming Games */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((game) => (
                    <div
                      key={game}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">Pickup Game #{game}</div>
                        <div className="text-sm text-gray-500">
                          Local Court Name
                        </div>
                        <div className="text-sm text-gray-500">
                          4/6 players joined
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">2:00 PM</div>
                        <div className="text-sm text-gray-500">Today</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Game History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Game History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((game) => (
                    <div
                      key={game}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">Pickleball Doubles</div>
                        <div className="text-sm text-gray-500">
                          Veterans Memorial Park
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Jan {game}, 2025
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Favorite Courts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Favorite Courts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((court) => (
                    <div
                      key={court}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
                      <div>
                        <div className="font-medium">Court Name #{court}</div>
                        <div className="text-sm text-gray-500">
                          2.3 miles away
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Friends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((friend) => (
                    <div
                      key={friend}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div>
                        <div className="font-medium">Friend Name</div>
                        <div className="text-sm text-gray-500">4.5 rating</div>
                      </div>
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

export default ProfileWireframe;
