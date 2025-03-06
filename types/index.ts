export interface Court {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
}

export interface Game {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  gameType: string;
  skillLevel: string;
  playersNeeded: number;
  notes?: string;
  court: {
    id: string;
    name: string;
  };
  participants: {
    id: string;
    name?: string;
    username?: string;
    avatarUrl?: string;
  }[];
}

export interface Friend {
  id: string;
  clerkId: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  rating: number;
}

export interface UserProfile {
  id: string;
  clerkId: string;
  name?: string;
  username?: string;
  email: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  rating: number;
  gamesPlayed: number;
  courtsVisited: number;
  profileCompletionPercentage?: number;
  games: Game[];
  createdGames: Game[];
  favorites: Court[];
  friends: Friend[];
}
