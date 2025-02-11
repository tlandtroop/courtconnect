import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserButton } from "@clerk/nextjs";
import {
  MapPin,
  Calendar,
  Users,
  MessageSquare,
  CloudRain,
} from "lucide-react";

const DashboardWireframe = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">CourtConnect</div>
          <div className="flex items-center gap-8">
            <nav className="flex gap-6">
              <div className="hover:text-blue-600 cursor-pointer">
                Dashboard
              </div>
              <div className="hover:text-blue-600 cursor-pointer">
                Find Courts
              </div>
              <div className="hover:text-blue-600 cursor-pointer">
                Schedule Game
              </div>
              <div className="hover:text-blue-600 cursor-pointer">
                Discussions
              </div>
            </nav>
            <div className="flex items-center gap-4">
              <UserButton showName />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - 8/12 width */}
          <div className="col-span-8 space-y-6">
            {/* Map Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Nearby Courts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                  Interactive Map Preview
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Games */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((game) => (
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
                      <div>
                        <div className="text-sm font-medium">2:00 PM</div>
                        <div className="text-sm text-gray-500">Today</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 4/12 width */}
          <div className="col-span-4 space-y-6">
            {/* Weather Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudRain className="w-5 h-5" />
                  Weather
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl font-bold">72°</div>
                    <div className="text-right">
                      <div className="font-medium">Partly Cloudy</div>
                      <div className="text-sm text-gray-500">
                        Gainesville, FL
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="p-2 bg-white rounded">
                      <div className="font-medium">75°</div>
                      <div className="text-gray-500">High</div>
                    </div>
                    <div className="p-2 bg-white rounded">
                      <div className="font-medium">65°</div>
                      <div className="text-gray-500">Low</div>
                    </div>
                    <div className="p-2 bg-white rounded">
                      <div className="font-medium">10%</div>
                      <div className="text-gray-500">Rain</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((activity) => (
                    <div
                      key={activity}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                      <div>
                        <div className="font-medium">User Name</div>
                        <div className="text-sm text-gray-500">
                          joined Game #{activity}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 ml-auto">
                        2m ago
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Discussions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recent Discussions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((discussion) => (
                    <div
                      key={discussion}
                      className="p-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="font-medium">
                        Best Courts in Gainesville
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Latest reply from User #{discussion} - 3 new replies
                      </div>
                      <div className="text-xs text-gray-400 mt-1">10m ago</div>
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

export default DashboardWireframe;
