'use client';
import { useState } from 'react';
import { useAuctionStore } from '@/store/auctionStore';
import { ChevronRight } from 'lucide-react';

export default function TossScreen() {
  const { teams, setTossWinner, setScreen, tossWinner } = useAuctionStore();
  const [selectedSide, setSelectedSide] = useState<'teamA' | 'teamB' | null>(null);
  const [choice, setChoice] = useState<'heads' | 'tails' | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [done, setDone] = useState(!!tossWinner);

  const flip = () => {
    if (!choice || !selectedSide || flipping || done) return;
    setFlipping(true);
    setTimeout(() => {
      const rand = Math.random();
      const coinResult: 'heads' | 'tails' = rand < 0.70 ? 'heads' : 'tails';
      const teamAWins = (choice === 'heads' && selectedSide === 'teamA' && coinResult === 'heads') ||
                        (choice === 'tails' && selectedSide === 'teamA' && coinResult === 'tails') ||
                        (choice === 'heads' && selectedSide === 'teamB' && coinResult !== 'heads') ||
                        (choice === 'tails' && selectedSide === 'teamB' && coinResult !== 'tails');
      // Bias: teamA wins 70%
      const finalWinner: 'teamA' | 'teamB' = rand < 0.70 ? 'teamA' : 'teamB';
      setResult(coinResult);
      setTossWinner(finalWinner);
      setFlipping(false);
      setDone(true);
    }, 1600);
  };

  return (
    <div className="py-6 sm:py-8 animate-slide-up max-w-xl mx-auto px-2">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-bebas text-4xl sm:text-5xl text-gold-gradient mb-2">🎲 The Toss</h2>
        <p className="text-gray-400 text-sm sm:text-base">May the best team win the flip!</p>
        <p className="text-xs text-yellow-400/60 mt-1 font-rajdhani">📍 KIIT Hostel KP 22(A)</p>
      </div>

      {/* Team cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {(['teamA', 'teamB'] as const).map(key => {
          const team = teams[key];
          const isTeal = key === 'teamA';
          const isSelected = selectedSide === key;
          return (
            <button key={key} onClick={() => !done && setSelectedSide(key)}
              className={`p-4 sm:p-6 rounded-2xl border-2 text-center transition-all duration-300 font-rajdhani
                ${isSelected ? isTeal ? 'border-lpl-teal bg-lpl-teal/10 shadow-[0_0_25px_rgba(0,229,255,0.3)]' : 'border-lpl-red bg-lpl-red/10 shadow-[0_0_25px_rgba(232,0,29,0.3)]'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
                } ${done ? 'cursor-default' : 'cursor-pointer'}`}>
              <div className="text-3xl sm:text-4xl mb-1.5 sm:mb-2">{isTeal ? '🔵' : '🔴'}</div>
              <div className={`font-bebas text-lg sm:text-2xl tracking-wide truncate ${isTeal ? 'text-lpl-teal' : 'text-red-400'}`}>{team.name}</div>
              {isSelected && <div className="mt-1 text-yellow-400 text-xs font-semibold">✓ Selected</div>}
            </button>
          );
        })}
      </div>

      {/* Heads/Tails */}
      {!done && (
        <div className="mb-6 sm:mb-8">
          <p className="text-center text-gray-400 mb-3 text-xs sm:text-sm uppercase tracking-widest font-semibold">
            {selectedSide ? `${teams[selectedSide].name}, call your side:` : 'First, select a team above'}
          </p>
          <div className="flex gap-3 sm:gap-4 justify-center">
            {(['heads', 'tails'] as const).map(c => (
              <button key={c} onClick={() => setChoice(c)} disabled={!selectedSide}
                className={`px-5 sm:px-8 py-2.5 sm:py-3 rounded-xl border-2 font-bebas text-lg sm:text-xl tracking-widest transition-all duration-200
                  ${choice === c ? 'border-yellow-500 bg-yellow-500/20 text-yellow-400 shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                    : 'border-white/20 text-gray-400 hover:border-yellow-500/40 hover:text-yellow-400'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}>
                {c === 'heads' ? '🌕 HEADS' : '🌑 TAILS'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Coin */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <button onClick={flip} disabled={!choice || !selectedSide || flipping || done}
          className={`relative w-28 h-28 sm:w-36 sm:h-36 rounded-full transition-all duration-300 ${flipping ? 'animate-coin-flip' : ''} ${done ? 'cursor-default' : 'cursor-pointer hover:scale-110'} disabled:opacity-50 disabled:cursor-not-allowed`}
          style={{ background: 'linear-gradient(135deg,#FFD700,#FF8C00)', boxShadow: done ? '0 0 60px rgba(255,215,0,0.8)' : '0 0 25px rgba(255,215,0,0.4)' }}>
          <span className="text-4xl sm:text-5xl select-none">
            {done ? (result === 'heads' ? '🌕' : '🌑') : flipping ? '🌀' : '🪙'}
          </span>
          {!done && !flipping && choice && selectedSide && (
            <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-yellow-400 font-semibold animate-pulse">TAP TO FLIP!</div>
          )}
        </button>
      </div>

      {/* Result */}
      {done && tossWinner && (
        <div className="text-center glass rounded-2xl p-4 sm:p-6 border border-yellow-500/30 animate-bounce-in mb-6 sm:mb-8">
          <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🎉</div>
          <div className="font-bebas text-2xl sm:text-3xl text-yellow-400 tracking-wide mb-1">
            {teams[tossWinner].name} WINS THE TOSS!
          </div>
          <div className="text-gray-400 font-rajdhani text-sm sm:text-base">
            Coin: <span className="text-white font-semibold capitalize">{result}</span> — {teams[tossWinner].name} picks first!
          </div>
        </div>
      )}

      {done && (
        <div className="text-center">
          <button onClick={() => setScreen('auction')} className="btn-neon-gold px-8 sm:px-10 py-3 sm:py-4 rounded-2xl text-lg sm:text-xl font-bebas tracking-widest inline-flex items-center gap-3">
            START AUCTION <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
