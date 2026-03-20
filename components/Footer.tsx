'use client';
import { MapPin, Shield, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 mt-auto border-t border-yellow-500/10 bg-black/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5">

        {/* Top row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="text-xl">🏆</span>
            <div>
              <div className="font-bebas text-lg text-yellow-400 tracking-wider leading-none">Langta Premier League</div>
              <div className="text-xs text-gray-500 font-rajdhani">Season {year}· Official Auction Platform</div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-yellow-400/70 font-rajdhani">
            <MapPin size={12} className="flex-shrink-0" />
            <span className="text-center">KIIT Hostel KP 22(A), Bhubaneswar, Odisha, India</span>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent mb-3" />

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-rajdhani">
            <Shield size={11} className="text-yellow-500/50" />
            <span>
              © {year} Langta Premier League. All rights reserved. This platform is for private tournament use only.
              Unauthorized reproduction or distribution is prohibited.
            </span>
          </div>
          <div className="text-xs text-gray-600 font-rajdhani flex items-center gap-1">
            Made with <Heart size={10} className="text-red-500 inline mx-0.5" /> for LPL {year}
          </div>
        </div>

        <div className="mt-2 text-center">
          <span className="text-[10px] text-gray-700 font-rajdhani tracking-widest uppercase">
            LPL is a private fantasy cricket league · Not affiliated with BCCI, IPL or any official cricket body
          </span>
        </div>
      </div>
    </footer>
  );
}
