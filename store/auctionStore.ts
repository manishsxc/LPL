import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player, Team, BidEntry, AuctionHistory, Notification, AppScreen, Theme, PlayerRole } from '@/types';

interface AuctionStore {
  // State
  screen: AppScreen;
  theme: Theme;
  players: Player[];
  teams: {
    teamA: Team;
    teamB: Team;
  };
  currentPlayer: Player | null;
  currentBid: number;
  currentBidder: 'teamA' | 'teamB' | null;
  bidHistory: BidEntry[];
  auctionHistory: AuctionHistory[];
  notifications: Notification[];
  tossWinner: 'teamA' | 'teamB' | null;
  currentTurn: 'teamA' | 'teamB' | null;
  timerActive: boolean;
  timerSeconds: number;
  selectedIncrement: number;
  reportGenerated: boolean;
  undoStack: { player: Player; team: Team; teamKey: 'teamA' | 'teamB' }[];

  // Actions
  setScreen: (screen: AppScreen) => void;
  toggleTheme: () => void;
  addPlayer: (name: string, role: PlayerRole, basePrice: number) => void;
  removePlayer: (id: string) => void;
  updateTeamName: (team: 'teamA' | 'teamB', name: string) => void;
  updateTeamBudget: (team: 'teamA' | 'teamB', budget: number) => void;
  setTeamCaptain: (team: 'teamA' | 'teamB', playerId: string) => void;
  setTossWinner: (winner: 'teamA' | 'teamB') => void;
  selectPlayerForAuction: (playerId: string) => void;
  placeBid: (team: 'teamA' | 'teamB') => void;
  setIncrement: (val: number) => void;
  soldCurrentPlayer: () => void;
  skipCurrentPlayer: () => void;
  undoLastBid: () => void;
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
  setTimer: (active: boolean, seconds?: number) => void;
  tickTimer: () => void;
  setReportGenerated: (val: boolean) => void;
  resetAuction: () => void;
  exportData: () => void;
}

const defaultPlayers: Player[] = [
  { id: '1', name: 'Ayush', role: 'Batsman', basePrice: 1, sold: false, team: null, soldPrice: 0 },
  { id: '2', name: 'Jaggu', role: 'All-rounder', basePrice: 1, sold: false, team: null, soldPrice: 0 },
  { id: '3', name: 'Satwik', role: 'Bowler', basePrice: 1, sold: false, team: null, soldPrice: 0 },
  { id: '4', name: 'Sayan', role: 'Batsman', basePrice: 1, sold: false, team: null, soldPrice: 0 },
  { id: '5', name: 'Sagar', role: 'Bowler', basePrice: 1, sold: false, team: null, soldPrice: 0 },
  { id: '6', name: 'Sumit', role: 'All-rounder', basePrice: 1, sold: false, team: null, soldPrice: 0 },
];

const defaultTeams = {
  teamA: {
    id: 'teamA' as const,
    name: 'Team Alpha',
    captainId: null,
    budget: 500,
    spent: 0,
    color: '#00E5FF',
    playerIds: [],
  },
  teamB: {
    id: 'teamB' as const,
    name: 'Team Beta',
    captainId: null,
    budget: 500,
    spent: 0,
    color: '#E8001D',
    playerIds: [],
  },
};

export const useAuctionStore = create<AuctionStore>()(
  persist(
    (set, get) => ({
      screen: 'setup',
      theme: 'dark',
      players: defaultPlayers,
      teams: defaultTeams,
      currentPlayer: null,
      currentBid: 0,
      currentBidder: null,
      bidHistory: [],
      auctionHistory: [],
      notifications: [],
      tossWinner: null,
      currentTurn: null,
      timerActive: false,
      timerSeconds: 30,
      selectedIncrement: 1,
      reportGenerated: false,
      undoStack: [],

      setScreen: (screen) => set({ screen }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

      addPlayer: (name, role, basePrice) => {
        const id = Date.now().toString();
        set((s) => ({
          players: [...s.players, { id, name, role, basePrice, sold: false, team: null, soldPrice: 0 }],
        }));
      },

      removePlayer: (id) =>
        set((s) => ({ players: s.players.filter((p) => p.id !== id) })),

      updateTeamName: (team, name) =>
        set((s) => ({ teams: { ...s.teams, [team]: { ...s.teams[team], name } } })),

      updateTeamBudget: (team, budget) =>
        set((s) => ({ teams: { ...s.teams, [team]: { ...s.teams[team], budget } } })),

      setTeamCaptain: (team, playerId) =>
        set((s) => ({ teams: { ...s.teams, [team]: { ...s.teams[team], captainId: playerId } } })),

      setTossWinner: (winner) => set({ tossWinner: winner, currentTurn: winner }),

      selectPlayerForAuction: (playerId) => {
        const player = get().players.find((p) => p.id === playerId);
        if (!player || player.sold) return;
        set({ currentPlayer: player, currentBid: player.basePrice, currentBidder: null, bidHistory: [] });
      },

      placeBid: (team) => {
        const { currentPlayer, currentBid, selectedIncrement, teams } = get();
        if (!currentPlayer) return;
        const newBid = currentBid + selectedIncrement;
        const teamData = teams[team];
        if (newBid > teamData.budget - teamData.spent) {
          get().addNotification('warning', `${teamData.name} over budget!`);
          return;
        }
        const entry: BidEntry = {
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          bidder: team,
          amount: newBid,
          timestamp: Date.now(),
        };
        set((s) => ({
          currentBid: newBid,
          currentBidder: team,
          bidHistory: [...s.bidHistory, entry],
          timerSeconds: 30,
        }));
        get().addNotification('info', `${teams[team].name} bids ₹${newBid}!`);
      },

      setIncrement: (val) => set({ selectedIncrement: val }),

      soldCurrentPlayer: () => {
        const { currentPlayer, currentBidder, currentBid, teams, auctionHistory } = get();
        if (!currentPlayer || !currentBidder) return;
        const teamData = teams[currentBidder];
        const histEntry: AuctionHistory = {
          playerId: currentPlayer.id,
          playerName: currentPlayer.name,
          role: currentPlayer.role,
          soldTo: currentBidder,
          soldPrice: currentBid,
          basePrice: currentPlayer.basePrice,
          timestamp: Date.now(),
        };
        set((s) => {
          const updatedPlayer = { ...currentPlayer, sold: true, team: currentBidder, soldPrice: currentBid };
          const updatedTeam = {
            ...teamData,
            spent: teamData.spent + currentBid,
            playerIds: [...teamData.playerIds, currentPlayer.id],
          };
          return {
            players: s.players.map((p) => (p.id === currentPlayer.id ? updatedPlayer : p)),
            teams: { ...s.teams, [currentBidder]: updatedTeam },
            auctionHistory: [...auctionHistory, histEntry],
            undoStack: [...s.undoStack, { player: currentPlayer, team: teamData, teamKey: currentBidder }],
            currentPlayer: null,
            currentBid: 0,
            currentBidder: null,
            bidHistory: [],
            currentTurn: s.currentTurn === 'teamA' ? 'teamB' : 'teamA',
            timerActive: false,
          };
        });
        get().addNotification('sold', `🔨 ${currentPlayer.name} SOLD to ${teamData.name} for ₹${currentBid}!`);
      },

      skipCurrentPlayer: () => {
        set({ currentPlayer: null, currentBid: 0, currentBidder: null, bidHistory: [], timerActive: false });
        get().addNotification('info', 'Player skipped');
      },

      undoLastBid: () => {
        const { undoStack } = get();
        if (undoStack.length === 0) return;
        const last = undoStack[undoStack.length - 1];
        set((s) => ({
          players: s.players.map((p) => (p.id === last.player.id ? last.player : p)),
          teams: { ...s.teams, [last.teamKey]: last.team },
          auctionHistory: s.auctionHistory.filter((h) => h.playerId !== last.player.id),
          undoStack: undoStack.slice(0, -1),
        }));
        get().addNotification('warning', `↩ Undo: ${last.player.name} returned to pool`);
      },

      addNotification: (type, message) => {
        const id = Date.now().toString();
        set((s) => ({ notifications: [...s.notifications.slice(-4), { id, type, message, timestamp: Date.now() }] }));
        setTimeout(() => get().removeNotification(id), 4000);
      },

      removeNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

      setTimer: (active, seconds) =>
        set((s) => ({ timerActive: active, timerSeconds: seconds ?? s.timerSeconds })),

      tickTimer: () => {
        const { timerSeconds, timerActive } = get();
        if (!timerActive) return;
        if (timerSeconds <= 1) {
          get().soldCurrentPlayer();
        } else {
          set({ timerSeconds: timerSeconds - 1 });
        }
      },

      setReportGenerated: (val) => set({ reportGenerated: val }),

      resetAuction: () => {
        set({
          screen: 'setup',
          players: defaultPlayers,
          teams: defaultTeams,
          currentPlayer: null,
          currentBid: 0,
          currentBidder: null,
          bidHistory: [],
          auctionHistory: [],
          notifications: [],
          tossWinner: null,
          currentTurn: null,
          timerActive: false,
          timerSeconds: 30,
          reportGenerated: false,
          undoStack: [],
        });
      },

      exportData: () => {
        const { players, teams, auctionHistory } = get();
        const data = {
          tournament: 'Langta Premier League',
          exportedAt: new Date().toISOString(),
          teams: {
            teamA: {
              ...teams.teamA,
              players: players.filter((p) => p.team === 'teamA'),
            },
            teamB: {
              ...teams.teamB,
              players: players.filter((p) => p.team === 'teamB'),
            },
          },
          auctionHistory,
          unsoldPlayers: players.filter((p) => !p.sold),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'LPL_Auction_Data.json';
        a.click();
      },
    }),
    {
      name: 'lpl-auction-store',
      partialize: (state) => ({
        players: state.players,
        teams: state.teams,
        auctionHistory: state.auctionHistory,
        tossWinner: state.tossWinner,
        currentTurn: state.currentTurn,
        screen: state.screen,
        theme: state.theme,
        undoStack: state.undoStack,
        reportGenerated: state.reportGenerated,
      }),
    }
  )
);
