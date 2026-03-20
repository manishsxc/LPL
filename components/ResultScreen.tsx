'use client';
import { useState, useEffect } from 'react';
import { useAuctionStore } from '@/store/auctionStore';
import { Download, RotateCcw, Crown, TrendingUp, MapPin, Shield } from 'lucide-react';

const ROLE_ICONS: Record<string, string> = { Batsman:'🏏', Bowler:'🎯', 'All-rounder':'⭐', Wicketkeeper:'🧤' };

function CricketLoader() {
  const [frame, setFrame] = useState(0);
  const frames = ['🏃','🏃‍♂️','🏏','💨','🎯','🔥','🏆'];
  useEffect(() => {
    const t = setInterval(() => setFrame(f => (f+1)%frames.length), 200);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center px-4">
      <div className="text-6xl sm:text-7xl mb-5 animate-bounce">{frames[frame]}</div>
      <div className="font-bebas text-2xl sm:text-3xl text-yellow-400 tracking-widest mb-2 text-center">Generating Report...</div>
      <div className="flex gap-1.5 mt-3">
        {[0,1,2,3,4].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />
        ))}
      </div>
      <div className="mt-5 font-rajdhani text-gray-500 text-sm tracking-widest uppercase text-center">
        Crunching the numbers...
      </div>
    </div>
  );
}

export default function ResultScreen() {
  const { players, teams, auctionHistory, reportGenerated, setReportGenerated, exportData, resetAuction } = useAuctionStore();
  const [loading, setLoading] = useState(false);

  const teamAPlayers = players.filter(p => p.team==='teamA');
  const teamBPlayers = players.filter(p => p.team==='teamB');
  const unsoldPlayers = players.filter(p => !p.sold);

  const handleGenerateReport = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setReportGenerated(true);
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then(({ default: confetti }) => {
          confetti({ particleCount:200, spread:120, origin:{y:0.4}, colors:['#FFD700','#FFA500','#00E5FF','#00FF88','#E8001D'] });
        });
      }
    }, 3000);
  };

  const TeamCard = ({ teamKey }: { teamKey: 'teamA'|'teamB' }) => {
    const team = teams[teamKey];
    const isTeal = teamKey==='teamA';
    const tp = isTeal ? teamAPlayers : teamBPlayers;
    const captain = players.find(p=>p.id===team.captainId);
    const batsmen = tp.filter(p=>p.role==='Batsman');
    const bowlers = tp.filter(p=>p.role==='Bowler');
    const allr = tp.filter(p=>p.role==='All-rounder'||p.role==='Wicketkeeper');
    const pct = Math.min((team.spent/team.budget)*100, 100);
    const top = tp.reduce((a,b)=>a.soldPrice>b.soldPrice?a:b, tp[0]);
    return (
      <div className={`glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 relative overflow-hidden ${isTeal?'border-lpl-teal/40':'border-lpl-red/40'}`}
        style={{ boxShadow:`0 0 40px ${isTeal?'rgba(0,229,255,0.08)':'rgba(232,0,29,0.08)'}` }}>
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ background:`radial-gradient(ellipse at top, ${isTeal?'#00E5FF':'#E8001D'}, transparent 70%)` }} />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div>
              <div className="font-bebas text-2xl sm:text-3xl tracking-wide" style={{ color:team.color }}>{team.name}</div>
              {captain && (
                <div className="flex items-center gap-1.5 mt-1">
                  <Crown size={13} className="text-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">{captain.name}</span>
                  <span className="text-gray-500 text-xs">(Captain)</span>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="font-orbitron text-xl font-bold" style={{ color:team.color }}>{tp.length}</div>
              <div className="text-xs text-gray-500">Players</div>
            </div>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>Budget Used: ₹{team.spent}</span>
              <span>Left: ₹{team.budget-team.spent}</span>
            </div>
            <div className="h-2 sm:h-2.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-1000"
                style={{ width:`${pct}%`, background:`linear-gradient(90deg,${team.color},${isTeal?'#0090A8':'#A00010'})` }} />
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
            {tp.map((p,i) => (
              <div key={p.id} className="flex items-center justify-between py-2 px-2.5 sm:px-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all"
                style={{ animationDelay:`${i*0.06}s` }}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base sm:text-lg flex-shrink-0">{ROLE_ICONS[p.role]}</span>
                  <div className="min-w-0">
                    <span className="font-semibold text-white font-rajdhani text-sm sm:text-base truncate block">
                      {p.name} {p.id===team.captainId && <Crown size={11} className="inline text-yellow-400 ml-1" />}
                    </span>
                    <div className="text-xs text-gray-500">{p.role}</div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-orbitron text-xs sm:text-sm font-bold text-yellow-400">₹{p.soldPrice}</div>
                  {p.soldPrice>p.basePrice && <div className="text-xs text-lpl-green">+{Math.round((p.soldPrice/p.basePrice-1)*100)}%</div>}
                </div>
              </div>
            ))}
            {tp.length===0 && <div className="text-center py-3 text-gray-600 italic text-sm">No players</div>}
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {[{label:'Batsmen',value:batsmen.length,icon:'🏏'},{label:'Bowlers',value:bowlers.length,icon:'🎯'},{label:'Others',value:allr.length,icon:'⭐'}].map(s => (
              <div key={s.label} className="bg-white/5 rounded-xl p-2 text-center">
                <div className="text-base sm:text-lg">{s.icon}</div>
                <div className="font-orbitron text-base sm:text-lg font-bold" style={{ color:team.color }}>{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
          {top && (
            <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-xs sm:text-sm">
              <span className="text-gray-400">💎 Top pick: </span>
              <span className="text-yellow-400 font-semibold">{top.name}</span>
              <span className="text-gray-400"> @ </span>
              <span className="font-orbitron text-yellow-400">₹{top.soldPrice}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="py-4 sm:py-6 animate-slide-up">
      {loading && <CricketLoader />}

      <div className="text-center mb-6 sm:mb-8">
        <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 animate-float">🏆</div>
        <h2 className="font-bebas text-4xl sm:text-5xl text-gold-gradient mb-1 sm:mb-2">Final Squads</h2>
        <p className="text-gray-400 text-sm sm:text-base">Langta Premier League · Season 2025</p>
        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-yellow-400/70">
          <MapPin size={11} /> <span>KIIT Hostel KP 22(A), Bhubaneswar</span>
        </div>
      </div>

      {!reportGenerated && (
        <div className="text-center mb-6 sm:mb-8">
          <button onClick={handleGenerateReport} className="btn-neon-gold px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-bebas text-lg sm:text-xl tracking-widest inline-flex items-center gap-3">
            <TrendingUp size={20} /> GENERATE FULL REPORT
          </button>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">Includes analysis, budget breakdown & comparison</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <TeamCard teamKey="teamA" />
        <TeamCard teamKey="teamB" />
      </div>

      {reportGenerated && (
        <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-yellow-500/20 card-glow-gold mb-6 sm:mb-8 animate-slide-up">
          <h3 className="font-bebas text-2xl sm:text-3xl text-yellow-400 text-center tracking-wide mb-5 sm:mb-6">📊 FULL AUCTION REPORT</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
            {[
              { label:'Total Spend', a:`₹${teams.teamA.spent}`, b:`₹${teams.teamB.spent}` },
              { label:'Players', a:teamAPlayers.length, b:teamBPlayers.length },
              { label:'Budget Left', a:`₹${teams.teamA.budget-teams.teamA.spent}`, b:`₹${teams.teamB.budget-teams.teamB.spent}` },
            ].map(row => (
              <div key={row.label} className="bg-white/5 rounded-2xl p-3 sm:p-4 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2 sm:mb-3 font-semibold">{row.label}</div>
                <div className="flex justify-around items-center">
                  <div><div className="font-orbitron text-base sm:text-lg font-bold text-lpl-teal">{row.a}</div><div className="text-xs text-gray-500 mt-0.5">{teams.teamA.name}</div></div>
                  <div className="text-gray-600 font-bebas text-xl">vs</div>
                  <div><div className="font-orbitron text-base sm:text-lg font-bold text-lpl-red">{row.b}</div><div className="text-xs text-gray-500 mt-0.5">{teams.teamB.name}</div></div>
                </div>
              </div>
            ))}
          </div>

          <h4 className="font-bebas text-lg sm:text-xl text-white tracking-wide mb-3">🕐 Complete Auction History</h4>
          <div className="overflow-x-auto -mx-1 px-1">
            <table className="w-full text-xs sm:text-sm min-w-[480px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-widest">
                  <th className="text-left pb-2 font-semibold">#</th>
                  <th className="text-left pb-2 font-semibold">Player</th>
                  <th className="text-left pb-2 font-semibold hidden sm:table-cell">Role</th>
                  <th className="text-left pb-2 font-semibold">Team</th>
                  <th className="text-right pb-2 font-semibold">Base</th>
                  <th className="text-right pb-2 font-semibold">Sold</th>
                  <th className="text-right pb-2 font-semibold hidden sm:table-cell">Markup</th>
                </tr>
              </thead>
              <tbody>
                {auctionHistory.map((h,i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="py-2 sm:py-2.5 text-gray-500">{i+1}</td>
                    <td className="py-2 sm:py-2.5 font-semibold text-white">{h.playerName}</td>
                    <td className="py-2 sm:py-2.5 text-gray-400 hidden sm:table-cell">{ROLE_ICONS[h.role]} {h.role}</td>
                    <td className="py-2 sm:py-2.5"><span style={{ color:h.soldTo==='teamA'?'#00E5FF':'#E8001D' }} className="font-semibold">{h.soldTo?teams[h.soldTo].name:'—'}</span></td>
                    <td className="py-2 sm:py-2.5 text-right text-gray-400 font-orbitron text-xs">₹{h.basePrice}</td>
                    <td className="py-2 sm:py-2.5 text-right text-yellow-400 font-orbitron text-xs font-bold">₹{h.soldPrice}</td>
                    <td className="py-2 sm:py-2.5 text-right text-lpl-green text-xs hidden sm:table-cell">{h.soldPrice>h.basePrice?`+${Math.round((h.soldPrice/h.basePrice-1)*100)}%`:'—'}</td>
                  </tr>
                ))}
                {auctionHistory.length===0 && (
                  <tr><td colSpan={7} className="text-center py-6 text-gray-600 italic">No auction data yet</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {unsoldPlayers.length > 0 && (
            <div className="mt-4 sm:mt-5 p-3 sm:p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="font-semibold text-gray-400 mb-2 text-xs sm:text-sm">⚠️ Unsold Players ({unsoldPlayers.length})</div>
              <div className="flex flex-wrap gap-2">
                {unsoldPlayers.map(p => (
                  <span key={p.id} className="px-2.5 py-1 rounded-full border border-white/10 text-gray-500 text-xs sm:text-sm">
                    {ROLE_ICONS[p.role]} {p.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 sm:gap-3 justify-center flex-wrap">
        <button onClick={exportData} className="btn-neon-teal px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-bebas text-base sm:text-lg tracking-widest flex items-center gap-2">
          <Download size={16} /> EXPORT
        </button>
        <button onClick={() => { if (confirm('Start a new auction? This will reset everything.')) resetAuction(); }}
          className="btn-neon-red px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-bebas text-base sm:text-lg tracking-widest flex items-center gap-2">
          <RotateCcw size={16} /> NEW AUCTION
        </button>
      </div>
    </div>
  );
}
