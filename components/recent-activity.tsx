import { Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentActivity = () => {
  return (
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
              <div className="text-xs text-gray-400 ml-auto">2m ago</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
