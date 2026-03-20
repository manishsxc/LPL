'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuctionStore } from '@/store/auctionStore';
import { Gavel, SkipForward, Undo2, Timer, TrendingUp, ChevronRight, ChevronDown } from 'lucide-react';

const ROLE_ICONS: Record<string, string> = { Batsman:'🏏', Bowler:'🎯', 'All-rounder':'⭐', Wicketkeeper:'🧤' };
const INCREMENTS = [1, 5, 10, 25, 50, 100];

export default function AuctionScreen() {
  const store = useAuctionStore();
  const { players, teams, currentPlayer, currentBid, currentBidder, bidHistory, auctionHistory, currentTurn,
    selectedIncrement, timerActive, timerSeconds, setScreen, selectPlayerForAuction, placeBid, soldCurrentPlayer,
    skipCurrentPlayer, undoLastBid, setIncrement, setTimer, tickTimer } = store;

  const [showSold, setShowSold] = useState(false);
  const [soldInfo, setSoldInfo] = useState<{ name: string; team: string; price: number } | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timerActive) { timerRef.current = setInterval(tickTimer, 1000); }
    else { if (timerRef.current) clearInterval(timerRef.current); }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerActive, tickTimer]);

  const handleSold = () => {
    if (!currentPlayer || !currentBidder) return;
    const teamName = teams[currentBidder].name;
    setSoldInfo({ name: currentPlayer.name, team: teamName, price: currentBid });
    setShowSold(true);
    soldCurrentPlayer();
    setTimer(false);
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ['#FFD700','#FFA500','#00E5FF','#00FF88'] });
      });
    }
    setTimeout(() => setShowSold(false), 2500);
  };

  const unsold = players.filter(p => !p.sold);
  const allSold = unsold.length === 0 && players.length > 0;
  const timerPct = (timerSeconds / 30) * 100;
  const timerColor = timerSeconds > 15 ? '#00FF88' : timerSeconds > 7 ? '#FFD700' : '#E8001D';
  const teamAPlayers = players.filter(p => p.team === 'teamA');
  const teamBPlayers = players.filter(p => p.team === 'teamB');

  return (
    <div className="py-3 sm:py-4 animate-slide-up">
      {/* SOLD overlay */}
      {showSold && soldInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center pointer-events-none px-4">
          <div className="sold-stamp text-center">SOLD!</div>
          <div className="font-bebas text-3xl sm:text-4xl text-white mt-2 tracking-widest text-center">{soldInfo.name}</div>
          <div className="text-gray-300 mt-1 font-rajdhani text-base sm:text-lg">to {soldInfo.team}</div>
          <div className="font-orbitron text-2xl sm:text-3xl text-lpl-green mt-2" style={{ textShadow:'0 0 20px #00FF88' }}>₹{soldInfo.price}</div>
        </div>
      )}

      {/* Turn banner */}
      {currentTurn && (
        <div className="mb-3 text-center py-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 font-bebas text-base sm:text-xl tracking-widest">
          🏏 <span className="text-yellow-400">{teams[currentTurn].name}</span>'s turn to pick!
        </div>
      )}

      {allSold && (
        <div className="text-center glass rounded-2xl p-5 border border-lpl-green/30 mb-4 animate-bounce-in">
          <div className="text-3xl sm:text-4xl mb-2">🏆</div>
          <div className="font-bebas text-2xl sm:text-3xl text-lpl-green mb-2">Auction Complete!</div>
          <p className="text-gray-400 mb-4 text-sm sm:text-base">All players have been sold.</p>
          <button onClick={() => setScreen('result')} className="btn-neon-gold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bebas text-base sm:text-lg tracking-widest inline-flex items-center gap-2">
            VIEW FINAL TEAMS <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Main layout: stacked on mobile, side by side on lg */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] gap-4">
        {/* LEFT */}
        <div className="space-y-4">
          {/* Spotlight card */}
          <div className="relative glass rounded-2xl p-4 sm:p-6 border border-yellow-500/20 card-glow-gold overflow-hidden">
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 animate-spin-slow opacity-20"
                style={{ background:'conic-gradient(from 0deg, transparent 0%, rgba(255,215,0,0.08) 25%, transparent 50%)' }} />
            </div>
            <div className="relative z-10">
              {/* Player name */}
              <div className="text-center mb-3 sm:mb-4">
                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">🎯 On the Block</div>
                {currentPlayer ? (
                  <>
                    <div className="font-bebas text-4xl sm:text-5xl md:text-6xl text-yellow-400 tracking-wide leading-none animate-bounce-in">
                      {currentPlayer.name}
                    </div>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold border
                      ${currentPlayer.role==='Batsman'?'text-lpl-teal border-lpl-teal/40 bg-lpl-teal/10':currentPlayer.role==='Bowler'?'text-lpl-green border-lpl-green/40 bg-lpl-green/10':'text-yellow-400 border-yellow-400/40 bg-yellow-400/10'}`}>
                      {ROLE_ICONS[currentPlayer.role]} {currentPlayer.role}
                    </span>
                    <div className="mt-1 text-gray-500 text-xs">Base: ₹{currentPlayer.basePrice}</div>
                  </>
                ) : (
                  <div className="font-bebas text-2xl sm:text-3xl text-gray-600 tracking-wide">← Select a player</div>
                )}
              </div>

              {/* Price */}
              <div className="text-center my-3 sm:my-4">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1 font-semibold">Current Bid</div>
                <div className="font-orbitron text-4xl sm:text-5xl font-black price-display animate-glow">₹{currentBid}</div>
                {currentBidder && (
                  <div className="mt-2 text-sm font-semibold">
                    <span className="text-gray-400">Highest: </span>
                    <span style={{ color: teams[currentBidder].color }}>{teams[currentBidder].name}</span>
                  </div>
                )}
              </div>

              {/* Timer */}
              {currentPlayer && (
                <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke={timerColor} strokeWidth="3"
                        strokeDasharray="94.2" strokeDashoffset={94.2 * (1 - timerPct / 100)}
                        strokeLinecap="round" style={{ transition:'stroke-dashoffset 1s linear, stroke 0.3s' }} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-orbitron text-xs sm:text-sm font-bold" style={{ color:timerColor }}>
                      {timerActive ? timerSeconds : '—'}
                    </span>
                  </div>
                  <button onClick={() => setTimer(!timerActive, timerActive ? undefined : 30)}
                    className={`px-3 sm:px-4 py-2 rounded-lg border font-semibold text-xs sm:text-sm transition-all
                      ${timerActive ? 'border-red-500/40 text-red-400 hover:bg-red-500/10' : 'border-white/20 text-gray-400 hover:border-yellow-500/40 hover:text-yellow-400'}`}>
                    <Timer size={13} className="inline mr-1" />
                    {timerActive ? 'Stop' : 'Start Timer'}
                  </button>
                </div>
              )}

              {/* Increment chips - scrollable on small screens */}
              <div className="flex items-center gap-1.5 sm:gap-2 justify-center flex-wrap mb-3 sm:mb-4">
                <span className="text-xs text-gray-500 font-semibold">+₹</span>
                {INCREMENTS.map(inc => (
                  <button key={inc} onClick={() => setIncrement(inc)}
                    className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-150
                      ${selectedIncrement===inc ? 'bg-yellow-500 border-yellow-500 text-lpl-dark shadow-[0_0_10px_rgba(255,215,0,0.5)]' : 'border-white/20 text-gray-400 hover:border-yellow-500/40 hover:text-yellow-400'}`}>
                    {inc}
                  </button>
                ))}
              </div>

              {/* Bid buttons */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3">
                {(['teamA','teamB'] as const).map(key => (
                  <button key={key} onClick={() => placeBid(key)} disabled={!currentPlayer}
                    className={`py-2.5 sm:py-3 rounded-xl font-bebas text-base sm:text-lg tracking-widest transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed truncate px-2
                      ${key==='teamA' ? 'btn-neon-teal' : 'btn-neon-red'}`}>
                    {key==='teamA'?'🔵':'🔴'} {teams[key].name}
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-center flex-wrap">
                <button onClick={handleSold} disabled={!currentPlayer || !currentBidder}
                  className="btn-neon-gold px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-bebas text-base sm:text-lg tracking-widest flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed">
                  <Gavel size={16} /> SOLD!
                </button>
                <button onClick={skipCurrentPlayer} disabled={!currentPlayer}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-white/20 text-gray-400 hover:border-white/40 hover:text-white font-bebas text-base sm:text-lg tracking-widest flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  <SkipForward size={14} /> SKIP
                </button>
                <button onClick={undoLastBid}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-orange-500/30 text-orange-400 hover:border-orange-500/60 font-bebas text-base sm:text-lg tracking-widest flex items-center gap-1.5 transition-all">
                  <Undo2 size={14} /> UNDO
                </button>
              </div>
            </div>
          </div>

          {/* Bid history - collapsible on mobile */}
          {bidHistory.length > 0 && (
            <div className="glass rounded-2xl p-4 border border-white/10">
              <button className="w-full flex items-center justify-between text-left" onClick={() => setShowHistory(!showHistory)}>
                <div className="font-bebas text-base sm:text-lg text-gray-400 tracking-wide flex items-center gap-2">
                  <TrendingUp size={15} /> BID HISTORY ({bidHistory.length})
                </div>
                <ChevronDown size={16} className={`text-gray-500 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
              </button>
              {showHistory && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto mt-3">
                  {[...bidHistory].reverse().map((b, i) => (
                    <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0">
                      <span style={{ color:teams[b.bidder].color }} className="font-semibold">{teams[b.bidder].name}</span>
                      <span className="font-orbitron text-yellow-400 font-bold text-xs">₹{b.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Player Pool */}
          <div className="glass rounded-2xl p-4 sm:p-5 border border-white/10">
            <div className="font-bebas text-lg sm:text-xl text-white tracking-wide mb-3">
              📋 PLAYER POOL <span className="text-yellow-400">({unsold.length} remaining)</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {players.map(p => (
                <button key={p.id} onClick={() => !p.sold && selectPlayerForAuction(p.id)}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-200
                    ${p.sold ? 'border-white/5 text-gray-700 line-through cursor-default opacity-40'
                      : currentPlayer?.id===p.id ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-[0_0_10px_rgba(255,215,0,0.4)]'
                      : 'border-white/20 text-gray-300 hover:border-yellow-500/50 hover:text-yellow-400 cursor-pointer'}`}>
                  {ROLE_ICONS[p.role]} {p.name}
                  {p.sold && <span className="ml-1 text-xs" style={{ color:p.team==='teamA'?'#00E5FF':'#E8001D' }}>✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Teams + Stats */}
        <div className="space-y-3 sm:space-y-4">
          {(['teamA','teamB'] as const).map(key => {
            const team = teams[key];
            const isTeal = key==='teamA';
            const tp = key==='teamA' ? teamAPlayers : teamBPlayers;
            const pct = Math.min((team.spent/team.budget)*100, 100);
            return (
              <div key={key} className={`glass rounded-2xl p-3 sm:p-4 border ${isTeal?'border-lpl-teal/30':'border-lpl-red/30'}`}>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isTeal?'bg-lpl-teal shadow-[0_0_6px_#00E5FF]':'bg-lpl-red shadow-[0_0_6px_#E8001D]'}`} />
                  <div className="font-bebas text-lg sm:text-xl tracking-wide truncate" style={{ color:team.color }}>{team.name}</div>
                  {team.captainId && (
                    <span className="ml-auto text-xs text-yellow-400 font-semibold flex-shrink-0">
                      👑 {players.find(p=>p.id===team.captainId)?.name}
                    </span>
                  )}
                </div>
                <div className="mb-2 sm:mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>₹{team.spent} spent</span>
                    <span>₹{team.budget-team.spent} left</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width:`${pct}%`, background:pct>80?'#E8001D':isTeal?'#00E5FF':'#E8001D' }} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {tp.length===0 ? <span className="text-gray-600 text-xs italic">No players yet</span>
                    : tp.map(p => (
                    <span key={p.id} className="px-2 py-0.5 rounded-full text-xs font-semibold border animate-bounce-in"
                      style={{ color:team.color, borderColor:`${team.color}40`, background:`${team.color}12` }}>
                      {ROLE_ICONS[p.role]} {p.name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Stats */}
          <div className="glass rounded-2xl p-3 sm:p-4 border border-white/10">
            <div className="font-bebas text-base sm:text-lg text-gray-400 tracking-wide mb-2 sm:mb-3">📊 STATS</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label:'Sold', value:players.filter(p=>p.sold).length, color:'text-lpl-green' },
                { label:'Left', value:unsold.length, color:'text-yellow-400' },
                { label:'Top Bid', value:`₹${auctionHistory.reduce((m,h)=>Math.max(m,h.soldPrice),0)}`, color:'text-lpl-teal' },
                { label:'Bids', value:bidHistory.length, color:'text-orange-400' },
              ].map(s => (
                <div key={s.label} className="bg-white/5 rounded-xl p-2 sm:p-3 text-center">
                  <div className={`font-orbitron text-lg sm:text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Auction History */}
          {auctionHistory.length > 0 && (
            <div className="glass rounded-2xl p-3 sm:p-4 border border-white/10">
              <div className="font-bebas text-base sm:text-lg text-gray-400 tracking-wide mb-2 sm:mb-3">🕐 HISTORY</div>
              <div className="space-y-1.5 max-h-36 sm:max-h-48 overflow-y-auto">
                {[...auctionHistory].reverse().map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-xs sm:text-sm py-1.5 border-b border-white/5 last:border-0">
                    <div>
                      <span className="font-semibold text-white">{h.playerName}</span>
                      <span className="text-gray-500 text-xs ml-1">{ROLE_ICONS[h.role]}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-orbitron text-xs text-yellow-400">₹{h.soldPrice}</span>
                      <div className="text-xs" style={{ color:h.soldTo==='teamA'?'#00E5FF':'#E8001D' }}>
                        {h.soldTo ? teams[h.soldTo].name : '—'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
