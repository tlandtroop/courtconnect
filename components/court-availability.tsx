"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getCourts } from "@/actions/courts";
import { Court } from "@/types";

const CourtAvailability = () => {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const result = await getCourts();
        if (result.success && result.courts) {
          setCourts(result.courts as Court[]);
        } else {
          setError(result.error || "Failed to load courts");
        }
      } catch (error) {
        console.error("Error fetching courts:", error);
        setError("An error occurred while fetching courts");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const dates = [today, tomorrow, dayAfter];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Court Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          {dates.map((date) => (
            <Button
              key={date.toISOString()}
              variant={
                format(selectedDate, "yyyy-MM-dd") ===
                format(date, "yyyy-MM-dd")
                  ? "default"
                  : "outline"
              }
              size="sm"
              onClick={() => setSelectedDate(date)}
            >
              {format(date, "MMM d")}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : courts.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No courts available.
          </div>
        ) : (
          <div className="space-y-3">
            {courts.slice(0, 3).map((court) => (
              <div
                key={court.id}
                className="border p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{court.name}</h3>
                    <p className="text-sm text-gray-500">
                      {court.city}, {court.state}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      variant="outline"
                      className="mb-1 bg-green-50 text-green-700"
                    >
                      Available
                    </Badge>
                    <a href={`/courts/${court.id}`}>
                      <Button size="sm" variant="link" className="h-7 px-2">
                        Details
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  {["8:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"].map((time) => (
                    <Badge
                      key={time}
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
            {courts.length > 3 && (
              <a href="/courts" className="block text-center">
                <Button variant="link">View all courts</Button>
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CourtAvailability;
