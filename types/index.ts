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
  gameType: string;
  skillLevel: string;
  date: string;
  startTime: string;
  playersNeeded: number;
  notes?: string;
  participants: UserProfile[];
  organizer: UserProfile;
  court: {
    id: string;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    hasLights: boolean;
    hasWaterFountain: boolean;
    hasRestrooms: boolean;
    isPickleball: boolean;
    isBasketball: boolean;
  };
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
