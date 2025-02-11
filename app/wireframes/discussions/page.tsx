import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageSquare,
  Search,
  Users,
  Star,
  ThumbsUp,
  TrendingUp,
  Pin,
  Info,
} from "lucide-react";
import Navbar from "../_components/navbar";

const DiscussionWireframe = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <Navbar currentPage="discussions" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-6">
        {/* Header with Search and Create Post */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Search discussions..."
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            New Discussion
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Discussion Area */}
          <div className="col-span-8 space-y-6">
            {/* Category Tabs */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
                  All Topics
                </button>
                <button className="px-4 py-2 hover:bg-gray-50 rounded-lg">
                  Pickleball
                </button>
                <button className="px-4 py-2 hover:bg-gray-50 rounded-lg">
                  Basketball
                </button>
                <button className="px-4 py-2 hover:bg-gray-50 rounded-lg">
                  Court Updates
                </button>
                <button className="px-4 py-2 hover:bg-gray-50 rounded-lg">
                  Events
                </button>
              </div>
            </div>

            {/* Pinned Discussion */}
            <Card className="border-2 border-blue-100">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Pin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            Community Guidelines & Rules
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Posted by Moderator • Pinned
                        </div>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Announcement
                      </span>
                    </div>
                    <p className="mt-3 text-gray-600">
                      Please read our community guidelines before posting...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Regular Discussions */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((post) => (
                <Card key={post} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-medium hover:text-blue-600 cursor-pointer">
                              Looking for doubles partners at Veterans Memorial
                            </div>
                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                              <span>Posted by UserName</span>
                              <span>•</span>
                              <span>2 hours ago</span>
                            </div>
                          </div>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Pickleball
                          </span>
                        </div>
                        <p className="mt-3 text-gray-600">
                          Looking for 3.5+ players for regular doubles
                          matches...
                        </p>
                        <div className="mt-4 flex items-center gap-6">
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm">24</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
                            <MessageSquare className="w-4 h-4" />
                            <span className="text-sm">12 replies</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 mb-3">
                  Create New Discussion
                </button>
                <button className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200">
                  Browse All Topics
                </button>
              </CardContent>
            </Card>

            {/* Trending Topics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((topic) => (
                    <div
                      key={topic}
                      className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                    >
                      <div className="text-lg font-medium text-gray-400">
                        #{topic}
                      </div>
                      <div>
                        <div className="font-medium">Best beginner courts</div>
                        <div className="text-sm text-gray-500">32 posts</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((user) => (
                    <div key={user} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-grow">
                        <div className="font-medium">User Name</div>
                        <div className="text-sm text-gray-500">Online</div>
                      </div>
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p>Have questions about using the discussion board?</p>
                  <button className="text-blue-600 hover:underline mt-2">
                    View Discussion Guidelines
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionWireframe;
