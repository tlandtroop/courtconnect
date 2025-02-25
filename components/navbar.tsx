"use client";

import Link from "next/link";
import { Home, Calendar, Users } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { user } = useUser();

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-900">
                CourtConnect
              </span>
            </Link>
          </div>

          {/* Right side - User Profile */}
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="hover:text-blue-600 cursor-pointer"
            >
              Dashboard
            </Link>
            <Link href="/courts" className="hover:text-blue-600 cursor-pointer">
              Find Courts
            </Link>
            <Link
              href="/schedule"
              className="hover:text-blue-600 cursor-pointer"
            >
              Schedule Game
            </Link>
            <Link
              href="/discussions"
              className="hover:text-blue-600 cursor-pointer"
            >
              Discussions
            </Link>
            {user && (
              <Link
                href={`/profile/${user.id}`}
                className="hover:text-blue-600 cursor-pointer"
              >
                Profile
              </Link>
            )}
            <UserButton showName />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="sm:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
          >
            <Home className="h-4 w-4 mr-2" />
            Home
          </Link>
          <Link
            href="/schedule"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Link>
          <Link
            href="/teams"
            className="flex items-center px-3 py-2 text-base font-medium text-gray-900 hover:text-blue-600"
          >
            <Users className="h-4 w-4 mr-2" />
            Teams
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
