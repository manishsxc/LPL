'use client';
import { useAuctionStore } from '@/store/auctionStore';
import { X } from 'lucide-react';

const typeStyles = {
  success: 'border-green-500/40 bg-green-500/10 text-green-300',
  warning: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
  info: 'border-lpl-teal/40 bg-lpl-teal/10 text-lpl-teal',
  sold: 'border-yellow-400/60 bg-gradient-to-r from-yellow-500/20 to-orange-500/10 text-yellow-300',
};

export default function Notifications() {
  const { notifications, removeNotification } = useAuctionStore();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-xs w-full">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`flex items-start gap-2 p-3 rounded-lg border backdrop-blur-md animate-notification-slide ${typeStyles[n.type]} shadow-lg`}
          style={{ animationFillMode: 'forwards' }}
        >
          <span className="text-sm font-semibold flex-1 font-rajdhani">{n.message}</span>
          <button onClick={() => removeNotification(n.id)} className="opacity-60 hover:opacity-100 flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
