interface Game {
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
