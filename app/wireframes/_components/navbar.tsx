import React from "react";

const Navbar = ({ currentPage = "dashboard" }) => {
  // Navigation items configuration
  const navItems = [
    { id: "dashboard", label: "Dashboard", href: "/wireframes/dashboard" },
    { id: "courts", label: "Find Courts", href: "/wireframes/courts" },
    { id: "schedule", label: "Schedule Game", href: "/wireframes/schedule" },
    { id: "discussions", label: "Discussions", href: "/discussions" },
  ];

  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold cursor-pointer">CourtConnect</div>

          {/* Main Navigation */}
          <div className="flex items-center gap-8">
            <nav className="flex gap-6">
              {navItems.map((item) => (
                <div
                  key={item.id}
                  className={`cursor-pointer hover:text-blue-600 transition-colors ${
                    currentPage === item.id ? "text-blue-600" : ""
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </nav>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full cursor-pointer"></div>
                <div className="text-sm">
                  <div className="font-medium">John Doe</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
