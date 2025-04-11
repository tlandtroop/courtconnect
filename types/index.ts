export interface Court {
  id: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  city?: string;
  state?: string;
  address?: string;
  zipCode?: string;
  courtType?: string;
  amenities: string[];
  images: string[];
  reviewCount: number;
  rating: number;
  isOpen: boolean;
  createdAt?: Date;
  updatedAt?: Date;
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
  skillLevel: string;
  profileCompletionPercentage?: number;
  games: Game[];
  createdGames: Game[];
  favorites: Court[];
  friends: Friend[];
}
