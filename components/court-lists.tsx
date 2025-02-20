import { Star, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const CourtLists = () => {
  return (
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
  );
};

export default CourtLists;
