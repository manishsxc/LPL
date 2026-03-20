'use client';
import { useState } from 'react';
import { useAuctionStore } from '@/store/auctionStore';
import { Plus, Trash2, Crown, Users, Wallet, ChevronRight, Info } from 'lucide-react';
import type { PlayerRole } from '@/types';

const ROLE_ICONS: Record<PlayerRole, string> = {
  Batsman: '🏏', Bowler: '🎯', 'All-rounder': '⭐', Wicketkeeper: '🧤',
};
const ROLE_COLORS: Record<PlayerRole, string> = {
  Batsman: 'text-lpl-teal border-lpl-teal/40 bg-lpl-teal/10',
  Bowler: 'text-lpl-green border-lpl-green/40 bg-lpl-green/10',
  'All-rounder': 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  Wicketkeeper: 'text-purple-400 border-purple-400/40 bg-purple-400/10',
};

export default function SetupScreen() {
  const { players, teams, addPlayer, removePlayer, updateTeamName, updateTeamBudget, setTeamCaptain, setScreen } = useAuctionStore();
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<PlayerRole>('Batsman');
  const [newBase, setNewBase] = useState(1);
  const [editTeamName, setEditTeamName] = useState({ teamA: teams.teamA.name, teamB: teams.teamB.name });
  const [editBudget, setEditBudget] = useState({ teamA: teams.teamA.budget, teamB: teams.teamB.budget });
  const [activeTab, setActiveTab] = useState<'players' | 'teams'>('players');

  const handleAddPlayer = () => {
    if (!newName.trim()) return;
    addPlayer(newName.trim(), newRole, newBase);
    setNewName(''); setNewBase(1);
  };

  return (
    <div className="py-4 sm:py-6 animate-slide-up">
      {/* Info banner */}
      <div className="mb-4 flex items-start gap-2 p-3 rounded-xl bg-lpl-teal/5 border border-lpl-teal/20 text-xs text-lpl-teal/80 font-rajdhani">
        <Info size={14} className="flex-shrink-0 mt-0.5" />
        <span>Venue: <strong className="text-lpl-teal">KIIT Hostel KP 22(A)</strong>, Bhubaneswar · Season 2025 · All bids start from ₹1</span>
      </div>

      <div className="text-center mb-6">
        <h2 className="font-bebas text-3xl sm:text-4xl md:text-5xl text-gold-gradient mb-1">Tournament Setup</h2>
        <p className="text-gray-400 font-rajdhani text-sm sm:text-base">Configure players and teams before the auction</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-5 gap-4 justify-center">
        {(['players', 'teams'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`pb-2.5 px-2 font-semibold font-rajdhani text-base sm:text-lg capitalize tracking-wide transition-all duration-200 border-b-2 -mb-px
              ${activeTab === tab ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
            {tab === 'players' ? <><Users className="inline w-4 h-4 mr-1" />Players</> : <><Crown className="inline w-4 h-4 mr-1" />Teams</>}
          </button>
        ))}
      </div>

      {activeTab === 'players' && (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Add Player */}
          <div className="glass rounded-2xl p-4 sm:p-6 border border-yellow-500/20 card-glow-gold">
            <h3 className="font-bebas text-xl sm:text-2xl text-yellow-400 mb-4 tracking-wide">➕ Add Player</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-lpl-teal uppercase tracking-widest mb-1 block font-semibold">Player Name</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 text-white focus:border-yellow-500/60 focus:outline-none focus:ring-1 focus:ring-yellow-500/20 transition-all font-rajdhani text-base"
                  placeholder="Enter player name..." value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddPlayer()} />
              </div>
              <div>
                <label className="text-xs text-lpl-teal uppercase tracking-widest mb-1 block font-semibold">Role</label>
                <select className="w-full bg-lpl-dark2 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 text-white focus:border-yellow-500/60 focus:outline-none transition-all font-rajdhani text-base"
                  value={newRole} onChange={e => setNewRole(e.target.value as PlayerRole)}>
                  <option value="Batsman">🏏 Batsman</option>
                  <option value="Bowler">🎯 Bowler</option>
                  <option value="All-rounder">⭐ All-rounder</option>
                  <option value="Wicketkeeper">🧤 Wicketkeeper</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-lpl-teal uppercase tracking-widest mb-1 block font-semibold">Base Price (₹)</label>
                <input type="number" min={1} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 text-white focus:border-yellow-500/60 focus:outline-none transition-all font-rajdhani text-base"
                  value={newBase} onChange={e => setNewBase(Number(e.target.value) || 1)} />
              </div>
              <button onClick={handleAddPlayer} className="btn-neon-gold w-full py-3 rounded-xl text-lg font-bebas tracking-widest flex items-center justify-center gap-2">
                <Plus size={18} /> ADD PLAYER
              </button>
            </div>
          </div>

          {/* Player List */}
          <div className="glass rounded-2xl p-4 sm:p-6 border border-white/10">
            <h3 className="font-bebas text-xl sm:text-2xl text-white mb-4 tracking-wide">
              👥 Player Pool <span className="text-yellow-400">({players.length})</span>
            </h3>
            <div className="space-y-2 max-h-64 sm:max-h-80 overflow-y-auto pr-1">
              {players.map(p => (
                <div key={p.id} className={`flex items-center justify-between p-2.5 sm:p-3 rounded-xl border transition-all hover:bg-white/5 ${p.sold ? 'opacity-50 border-white/5' : 'border-white/10'}`}>
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="text-lg sm:text-xl flex-shrink-0">{ROLE_ICONS[p.role]}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-white font-rajdhani text-sm sm:text-base truncate">
                        {p.name} {p.sold && <span className="text-xs text-lpl-green">(Sold)</span>}
                      </div>
                      <div className={`text-xs px-1.5 py-0.5 rounded-full border inline-block font-semibold ${ROLE_COLORS[p.role]}`}>{p.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <span className="text-yellow-400 font-orbitron text-xs sm:text-sm">₹{p.basePrice}</span>
                    <button onClick={() => removePlayer(p.id)} className="text-red-400/50 hover:text-red-400 transition-colors p-1 rounded">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
              {players.length === 0 && (
                <div className="text-center py-8 text-gray-600">
                  <div className="text-4xl mb-2">🏏</div>
                  <div className="text-sm">No players yet</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {(['teamA', 'teamB'] as const).map(key => {
            const team = teams[key];
            const isTeal = key === 'teamA';
            return (
              <div key={key} className={`glass rounded-2xl p-4 sm:p-6 border ${isTeal ? 'border-lpl-teal/30 card-glow-teal' : 'border-lpl-red/30 card-glow-red'}`}>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isTeal ? 'bg-lpl-teal shadow-[0_0_8px_#00E5FF]' : 'bg-lpl-red shadow-[0_0_8px_#E8001D]'}`} />
                  <h3 className={`font-bebas text-xl sm:text-2xl tracking-wide ${isTeal ? 'text-lpl-teal' : 'text-red-400'}`}>{team.name}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-400 mb-1 block font-semibold">Team Name</label>
                    <input className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500/40 transition-all font-rajdhani text-base"
                      value={editTeamName[key]} onChange={e => setEditTeamName(s => ({ ...s, [key]: e.target.value }))}
                      onBlur={() => updateTeamName(key, editTeamName[key])} />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-400 mb-1 block font-semibold flex items-center gap-1"><Wallet size={12} /> Budget (₹)</label>
                    <input type="number" min={1} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500/40 transition-all font-rajdhani text-base"
                      value={editBudget[key]} onChange={e => setEditBudget(s => ({ ...s, [key]: Number(e.target.value) || 1 }))}
                      onBlur={() => updateTeamBudget(key, editBudget[key])} />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-400 mb-1 block font-semibold flex items-center gap-1"><Crown size={12} /> Select Captain</label>
                    <select className="w-full bg-lpl-dark2 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500/40 transition-all font-rajdhani text-base"
                      value={team.captainId || ''} onChange={e => setTeamCaptain(key, e.target.value)}>
                      <option value="">-- Select Captain --</option>
                      {players.map(p => <option key={p.id} value={p.id}>{p.name} ({p.role})</option>)}
                    </select>
                    {team.captainId && (
                      <div className="mt-2 text-sm text-yellow-400 font-semibold flex items-center gap-1">
                        <Crown size={14} /> Captain: {players.find(p => p.id === team.captainId)?.name}
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Budget used</span>
                      <span>₹{team.spent} / ₹{team.budget}</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${isTeal ? 'bg-lpl-teal' : 'bg-lpl-red'}`}
                        style={{ width: `${Math.min((team.spent / team.budget) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="text-center mt-6 sm:mt-8">
        <button onClick={() => setScreen('toss')} className="btn-neon-gold px-8 sm:px-10 py-3 sm:py-4 rounded-2xl text-lg sm:text-xl font-bebas tracking-widest inline-flex items-center gap-3">
          PROCEED TO TOSS <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
