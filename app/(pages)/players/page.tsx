"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  Search,
  MapPin,
  Star,
  Filter,
  Calendar,
  UserPlus,
  Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { findPlayers } from "@/actions/players/index";
import { addFriend } from "@/actions/users/friends";

interface Player {
  id: string;
  clerkId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  location?: string;
  rating: number;
  skillLevel: string;
  gamesPlayed: number;
  winRate: number;
  createdAt: string;
  lastActive: string;
  isFriend: boolean;
  friendsCount: number;
}

const skillLevels = [
  { value: "beginner", label: "Beginner (1.0-2.5)" },
  { value: "intermediate", label: "Intermediate (3.0-3.5)" },
  { value: "advanced", label: "Advanced (4.0-4.5)" },
  { value: "expert", label: "Expert (5.0+)" },
];

export default function PlayersPage() {
  const router = useRouter();
  const { user } = useUser();

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [skillFilter, setSkillFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isAddingFriend, setIsAddingFriend] = useState<string | null>(null);

  const playersPerPage = 10;

  // Function to fetch players with filters
  const fetchPlayers = async () => {
    setLoading(true);
    try {
      // Build query parameters for server action
      const result = await findPlayers({
        search: searchQuery,
        skillLevel: skillFilter.length > 0 ? skillFilter.join(",") : undefined,
        location: locationFilter || undefined,
        sortBy,
        page: currentPage,
        limit: playersPerPage,
      });

      if (result.success && result.players) {
        setPlayers(result.players as unknown as Player[]);
        setTotalCount(result.pagination?.total || 0);
        setTotalPages(result.pagination?.pages || 1);
      } else {
        throw new Error(result.error || "Failed to fetch players");
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to load players");
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch players when filters change
  useEffect(() => {
    if (user) {
      fetchPlayers();
    }
  }, [currentPage, sortBy, skillFilter, locationFilter, user]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (user) {
        setCurrentPage(1); // Reset to first page on new search
        fetchPlayers();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, skillFilter, locationFilter]);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getSkillLevelColor = (skillLevel: string) => {
    switch (skillLevel) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-purple-100 text-purple-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSkillLevelLabel = (skillLevel: string) => {
    return (
      skillLevels
        .find((level) => level.value === skillLevel)
        ?.label.split(" ")[0] || skillLevel
    );
  };

  const handleAddFriend = async (e: React.MouseEvent, playerId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingFriend) return; // Prevent multiple clicks

    setIsAddingFriend(playerId);
    try {
      // Use the server action to add friend
      const result = await addFriend(playerId);

      if (result.success) {
        // Update the player in the list to show as friend
        setPlayers((current) =>
          current.map((p) => (p.id === playerId ? { ...p, isFriend: true } : p))
        );

        toast.success("Friend added successfully!");
      } else {
        throw new Error(result.error || "Failed to add friend");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error("Failed to add friend");
    } finally {
      setIsAddingFriend(null);
    }
  };

  const handleScheduleGame = (e: React.MouseEvent, playerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    // Redirect to schedule page with the player pre-selected
    router.push(`/schedule?player=${playerId}`);
  };

  // Handle filter changes
  const handleSkillFilterChange = (skill: string) => {
    const updatedFilters = skillFilter.includes(skill)
      ? skillFilter.filter((s) => s !== skill)
      : [...skillFilter, skill];

    setSkillFilter(updatedFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchPlayers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Find Players</h1>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rating</SelectItem>
                <SelectItem value="games">Most Games</SelectItem>
                <SelectItem value="winRate">Best Win Rate</SelectItem>
                <SelectItem value="recentlyActive">Recently Active</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Skill Level</DropdownMenuLabel>
                {skillLevels.map((level) => (
                  <DropdownMenuCheckboxItem
                    key={level.value}
                    checked={skillFilter.includes(level.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSkillFilter([...skillFilter, level.value]);
                      } else {
                        setSkillFilter(
                          skillFilter.filter((item) => item !== level.value)
                        );
                      }
                    }}
                  >
                    {level.label}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <div className="p-2">
                  <label className="text-sm font-medium mb-1 block">
                    Location
                  </label>
                  <Input
                    placeholder="City, State"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="h-8"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 bg-white"
            placeholder="Search players by name or username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Active filters display */}
        {(skillFilter.length > 0 || locationFilter) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {skillFilter.map((skill) => (
              <Badge key={skill} variant="secondary" className="px-2 py-1">
                {getSkillLevelLabel(skill)}
                <button
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => handleSkillFilterChange(skill)}
                >
                  ×
                </button>
              </Badge>
            ))}
            {locationFilter && (
              <Badge variant="secondary" className="px-2 py-1">
                <MapPin className="h-3 w-3 mr-1" /> {locationFilter}
                <button
                  className="ml-1 text-gray-500 hover:text-gray-700"
                  onClick={() => setLocationFilter("")}
                >
                  ×
                </button>
              </Badge>
            )}
            <Button
              variant="link"
              className="text-xs h-auto p-0"
              onClick={handleApplyFilters}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Player count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            {totalCount} {totalCount === 1 ? "player" : "players"} found
          </p>
        </div>

        {/* Players list */}
        <div className="space-y-6 my-4">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="space-y-2 hidden sm:block">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-9 rounded" />
                      <Skeleton className="h-9 w-9 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : players.length === 0 ? (
            <Card className="overflow-hidden">
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No players match your criteria</p>
                <Button variant="link" onClick={handleApplyFilters}>
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            players.map((player) => (
              <Link href={`/profile/${player.clerkId}`} key={player.id}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="p-4 flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={player.avatarUrl || ""}
                          alt={player.name}
                        />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{player.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>@{player.username}</span>
                          {player.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {player.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="hidden sm:flex flex-col items-end gap-1 min-w-[100px]">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="font-medium">
                            {player.rating.toFixed(1)}
                          </span>
                        </div>
                        <Badge
                          className={getSkillLevelColor(player.skillLevel)}
                        >
                          {getSkillLevelLabel(player.skillLevel)}
                        </Badge>
                      </div>

                      <div className="hidden md:flex flex-col items-end gap-1 min-w-[140px] text-sm">
                        <div className="text-gray-700">
                          {player.gamesPlayed}{" "}
                          {player.gamesPlayed === 1 ? "game" : "games"}
                        </div>
                        <div className="text-gray-500">
                          {player.winRate}% win rate
                        </div>
                      </div>

                      <div className="hidden lg:block text-sm text-gray-500 min-w-[100px]">
                        Active {getTimeAgo(player.lastActive)}
                      </div>

                      <div className="flex gap-2">
                        {!player.isFriend && player.clerkId !== user?.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleAddFriend(e, player.id)}
                            className="text-blue-600 hover:text-blue-700"
                            disabled={isAddingFriend === player.id}
                          >
                            {isAddingFriend === player.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <UserPlus className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleScheduleGame(e, player.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current page
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis where needed
                    const showEllipsis =
                      index > 0 && array[index - 1] !== page - 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsis && (
                          <PaginationItem>
                            <span className="px-4 py-2">...</span>
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <Button
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-9 h-9 p-0"
                          >
                            {page}
                          </Button>
                        </PaginationItem>
                      </React.Fragment>
                    );
                  })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  );
}
