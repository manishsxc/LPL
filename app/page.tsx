'use client';
import dynamic from 'next/dynamic';
import { useAuctionStore } from '@/store/auctionStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Particles from '@/components/Particles';
import Notifications from '@/components/Notifications';

const SetupScreen = dynamic(() => import('@/components/SetupScreen'), { ssr: false });
const TossScreen = dynamic(() => import('@/components/TossScreen'), { ssr: false });
const AuctionScreen = dynamic(() => import('@/components/AuctionScreen'), { ssr: false });
const ResultScreen = dynamic(() => import('@/components/ResultScreen'), { ssr: false });
const Background3D = dynamic(() => import('@/components/Background3D'), { ssr: false });

export default function Home() {
  const screen = useAuctionStore((s) => s.screen);

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden bg-lpl-dark">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0">
        <Background3D />
      </div>

      {/* Particles */}
      <Particles />

      {/* Dark overlay */}
      <div className="fixed inset-0 z-[1] bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 px-3 sm:px-4 pb-6 max-w-7xl mx-auto w-full">
          {screen === 'setup' && <SetupScreen />}
          {screen === 'toss' && <TossScreen />}
          {screen === 'auction' && <AuctionScreen />}
          {screen === 'result' && <ResultScreen />}
        </div>
        <Footer />
      </div>

      <Notifications />
    </main>
  );
}
