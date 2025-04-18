"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Search, MapPin, Filter, UserPlus, Loader2, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface Player {
  id: string;
  clerkId: string;
  name: string;
  username: string;
  avatarUrl?: string;
  location?: string;
  gamesPlayed: number;
  winRate: number;
  createdAt: string;
  lastActive: string;
  isFriend: boolean;
  friendsCount: number;
}

interface ApiPlayer {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  location?: string;
  gamesPlayed: number;
  winRate: number;
  createdAt: string;
  lastActive: string;
}

export default function PlayersPage() {
  const { user } = useUser();

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState("games");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isAddingFriend, setIsAddingFriend] = useState<string | null>(null);

  const playersPerPage = 10;

  const fetchPlayers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        location: locationFilter,
        sortBy,
        page: currentPage.toString(),
        limit: playersPerPage.toString(),
      });

      const response = await fetch(`/api/v1/players?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch players");
      }
      const data = await response.json();
      if (data.data) {
        const transformedPlayers = data.data.map((player: ApiPlayer) => ({
          ...player,
          lastActive: player.lastActive || new Date().toISOString(),
          createdAt: player.createdAt || new Date().toISOString(),
        }));
        setPlayers(transformedPlayers);
        setTotalCount(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching players:", error);
      toast.error("Failed to load players");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, locationFilter, sortBy, currentPage, playersPerPage]);

  const debouncedSearch = useCallback(() => {
    if (user) {
      setCurrentPage(1);
      fetchPlayers();
    }
  }, [user, fetchPlayers]);

  useEffect(() => {
    if (user) {
      fetchPlayers();
    }
  }, [user, fetchPlayers]);

  useEffect(() => {
    const timer = setTimeout(debouncedSearch, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, locationFilter, debouncedSearch]);

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Never";

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleAddFriend = async (e: React.MouseEvent, playerId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddingFriend) return;

    setIsAddingFriend(playerId);
    try {
      const response = await fetch(`/api/v1/users/friends?id=${playerId}`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add friend");
      }
      if (data.success) {
        setPlayers((current) =>
          current.map((p) => (p.id === playerId ? { ...p, isFriend: true } : p))
        );
        toast.success("Friend added successfully!");
      }
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error("Failed to add friend");
    } finally {
      setIsAddingFriend(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Find Players</h1>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="games">Most Games</SelectItem>
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

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            className="pl-10 bg-white"
            placeholder="Search players by name or username"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            {totalCount} {totalCount === 1 ? "player" : "players"} found
          </p>
        </div>

        <div className="space-y-6 my-4">
          {loading ? (
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
              </CardContent>
            </Card>
          ) : (
            players.map((player) => (
              <Link href={`/profile/${player.id}`} key={player.id}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow my-2">
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
                        {player.clerkId !== user?.id && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div>
                                  {player.isFriend ? (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="text-green-600 hover:text-green-700"
                                      disabled
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) =>
                                        handleAddFriend(e, player.id)
                                      }
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
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {player.isFriend
                                  ? "Already friends"
                                  : "Add as friend"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

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
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
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
