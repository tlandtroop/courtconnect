import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CourtAvailability = () => {
  return (
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
  );
};

export default CourtAvailability;
