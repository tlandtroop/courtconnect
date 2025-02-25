import Navbar from "@/components/navbar";
import UpcomingGames from "@/components/upcoming-games";
import Weather from "@/components/weather";
import RecentActivity from "@/components/recent-activity";
import RecentDiscussions from "@/components/recent-discussions";
import GoogleMaps from "@/components/google-maps";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - 8/12 width */}
          <div className="col-span-8 space-y-6">
            <GoogleMaps />
            <UpcomingGames />
          </div>

          {/* Right Column - 4/12 width */}
          <div className="col-span-4 space-y-6">
            <Weather />
            <RecentActivity />
            <RecentDiscussions />
          </div>
        </div>
      </div>
    </div>
  );
}
