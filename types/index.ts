export type PlayerRole = 'Batsman' | 'Bowler' | 'All-rounder' | 'Wicketkeeper';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  basePrice: number;
  sold: boolean;
  team: 'teamA' | 'teamB' | null;
  soldPrice: number;
  stats?: {
    matches?: number;
    runs?: number;
    wickets?: number;
    average?: number;
  };
}

export interface Team {
  id: 'teamA' | 'teamB';
  name: string;
  captainId: string | null;
  budget: number;
  spent: number;
  color: string;
  playerIds: string[];
}

export interface BidEntry {
  playerId: string;
  playerName: string;
  bidder: 'teamA' | 'teamB';
  amount: number;
  timestamp: number;
}

export interface AuctionHistory {
  playerId: string;
  playerName: string;
  role: PlayerRole;
  soldTo: 'teamA' | 'teamB' | null;
  soldPrice: number;
  basePrice: number;
  timestamp: number;
}

export interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'sold';
  message: string;
  timestamp: number;
}

export type AppScreen = 'setup' | 'toss' | 'auction' | 'result';
export type Theme = 'dark' | 'light';
