import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const GameForm = () => {
  return (
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
  );
};

export default GameForm;
