import { MessageSquare } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const RecentDiscussions = () => {
  return (
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
            <div key={discussion} className="p-3 hover:bg-gray-50 rounded-lg">
              <div className="font-medium">Best Courts in Gainesville</div>
              <div className="text-sm text-gray-500 mt-1">
                Latest reply from User #{discussion} - 3 new replies
              </div>
              <div className="text-xs text-gray-400 mt-1">10m ago</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentDiscussions;
