'use client';
import { useState } from 'react';
import { useAuctionStore } from '@/store/auctionStore';
import { Moon, Sun, RotateCcw, Download, Menu, X, MapPin } from 'lucide-react';

const NAV_ITEMS = [
  { screen: 'setup', label: '⚙️ Setup' },
  { screen: 'toss', label: '🎲 Toss' },
  { screen: 'auction', label: '🏏 Auction' },
  { screen: 'result', label: '🏆 Results' },
] as const;

export default function Header() {
  const { screen, setScreen, theme, toggleTheme, resetAuction, exportData } = useAuctionStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (s: typeof NAV_ITEMS[number]['screen']) => {
    setScreen(s as any);
    setMenuOpen(false);
  };

  return (
    <header className="relative z-20 border-b border-yellow-500/20 bg-black/40 backdrop-blur-md">
      <div className="border-b border-yellow-500/10 bg-yellow-500/5 px-4 py-1 flex items-center justify-center gap-2">
        <MapPin size={11} className="text-yellow-400 flex-shrink-0" />
        <span className="text-[10px] text-yellow-400/80 font-rajdhani tracking-widest uppercase text-center">
          KIIT Hostel KP 22(A) · Bhubaneswar, Odisha, India
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl sm:text-3xl animate-float flex-shrink-0">🏆</span>
            <div className="min-w-0">
              <h1 className="font-bebas text-xl sm:text-2xl md:text-3xl text-gold-gradient leading-none tracking-wider truncate">
                Langta Premier League
              </h1>
              <p className="text-[9px] sm:text-[10px] text-lpl-teal font-orbitron tracking-[0.2em] uppercase">
                ⚡ Official Player Auction ⚡
              </p>
            </div>
          </div>
          <nav className="hidden md:flex gap-1">
            {NAV_ITEMS.map((item) => (
              <button key={item.screen} onClick={() => handleNav(item.screen)}
                className={`px-3 py-1.5 rounded text-sm font-semibold transition-all duration-200 font-rajdhani tracking-wide whitespace-nowrap
                  ${screen === item.screen
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 shadow-[0_0_12px_rgba(255,215,0,0.3)]'
                    : 'text-gray-400 hover:text-yellow-400 hover:bg-white/5 border border-transparent'}`}>
                {item.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg border border-white/10 hover:border-yellow-500/40 text-gray-400 hover:text-yellow-400 transition-all" title="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={exportData} className="hidden sm:flex p-2 rounded-lg border border-white/10 hover:border-lpl-teal/40 text-gray-400 hover:text-lpl-teal transition-all" title="Export data">
              <Download size={15} />
            </button>
            <button onClick={() => { if (confirm('Reset entire auction?')) resetAuction(); }} className="hidden sm:flex p-2 rounded-lg border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 transition-all" title="Reset">
              <RotateCcw size={15} />
            </button>
            <button className="md:hidden p-2 rounded-lg border border-white/10 text-gray-400 hover:text-yellow-400 transition-all" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="md:hidden mt-2 pb-2 border-t border-white/10 pt-3 animate-slide-up">
            <div className="grid grid-cols-2 gap-2 mb-3">
              {NAV_ITEMS.map((item) => (
                <button key={item.screen} onClick={() => handleNav(item.screen)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-semibold transition-all font-rajdhani text-center
                    ${screen === item.screen ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' : 'text-gray-400 bg-white/5 border border-white/10'}`}>
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={exportData} className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 text-sm font-rajdhani flex items-center justify-center gap-1">
                <Download size={13} /> Export
              </button>
              <button onClick={() => { if (confirm('Reset entire auction?')) { resetAuction(); setMenuOpen(false); } }} className="flex-1 py-2 rounded-lg border border-red-500/20 text-red-400 text-sm font-rajdhani flex items-center justify-center gap-1">
                <RotateCcw size={13} /> Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
