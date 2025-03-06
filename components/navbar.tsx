"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Users,
  Menu,
  X,
  MapPin,
  User,
  LogOut,
} from "lucide-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "Find Courts",
      href: "/courts",
      icon: <MapPin className="h-4 w-4" />,
    },
    {
      name: "Schedule Game",
      href: "/schedule",
      icon: <Calendar className="h-4 w-4" />,
    },
    { name: "Players", href: "/players", icon: <Users className="h-4 w-4" /> },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-md">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                CourtConnect
              </span>
            </Link>
          </div>

          {/* Center - Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center space-x-1 ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <span className="hidden lg:block">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side - User Profile */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center">
                <Link
                  href={`/profile/${user.id}`}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.imageUrl}
                      alt={user.fullName || "User"}
                    />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:block">{user.firstName}</span>
                </Link>
              </div>
            )}

            <div className="hidden md:block">
              <SignOutButton>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:block">Sign Out</span>
                </Button>
              </SignOutButton>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 shadow-lg border-t">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-900 hover:bg-gray-50 hover:text-blue-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}

          {user && (
            <Link
              href={`/profile/${user.id}`}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              <span className="ml-3">Profile</span>
            </Link>
          )}

          <div className="px-3 py-2">
            <SignOutButton>
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Sign Out</span>
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
