"use client";

import { useState, useEffect } from "react";
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
  Search,
  Bell,
} from "lucide-react";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

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
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Games",
      href: "/games",
      icon: <Calendar className="h-4 w-4 mr-2" />,
    },
    {
      name: "Courts",
      href: "/courts",
      icon: <MapPin className="h-4 w-4 mr-2" />,
    },
    {
      name: "Players",
      href: "/players",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Left side - Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-md">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                CourtConnect
              </span>
            </Link>
          </div>

          {/* Center - Navigation (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 flex items-center ${
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Right side - User Profile & Actions */}
          <div className="flex items-center space-x-2">
            <div className="hidden lg:block">
              <Link href="/schedule">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Game</span>
                </Button>
              </Link>
            </div>

            {/* User Menu */}
            {user && (
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 px-2 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.imageUrl}
                          alt={user.fullName || "User"}
                        />
                        <AvatarFallback>
                          {user?.firstName?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline">{user.firstName}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/profile/${user.id}`}
                        className="flex cursor-pointer"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/games?tab=my-games"
                        className="flex cursor-pointer"
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        My Games
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <SignOutButton>
                        <button className="flex items-center w-full text-left cursor-pointer">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </SignOutButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

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
              {item.name}
            </Link>
          ))}

          <Link
            href="/schedule"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 bg-gray-50 hover:bg-blue-50 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Game
          </Link>

          {user && (
            <Link
              href={`/profile/${user.id}`}
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4 mr-2" />
              Profile
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
