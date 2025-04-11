import Link from "next/link";
import { UserX } from "lucide-react";

import { Button } from "@/components/ui/button";

const ProfileNotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-50 p-4 rounded-full">
            <UserX className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Profile Not Found
        </h2>

        <p className="text-gray-600 mb-6">
          The player profile you&apos;re looking for doesn&apos;t exist or may
          have been removed.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button>Return Home</Button>
          </Link>

          <Link href="/players">
            <Button variant="outline">Browse Players</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileNotFound;
