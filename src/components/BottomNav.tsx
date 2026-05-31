import { Home, Heart, Download, User } from 'lucide-react';
import type { View } from '../lib/types';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  favoritesCount?: number;
  downloadsCount?: number;
}

export function BottomNav({ currentView, onNavigate, favoritesCount = 0, downloadsCount = 0 }: BottomNavProps) {
  const items = [
    { icon: Home, label: 'Início', view: 'home' as View },
    { icon: Heart, label: 'Favoritos', view: 'favorites' as View, badge: favoritesCount },
    { icon: Download, label: 'Downloads', view: 'downloads' as View, badge: downloadsCount },
    { icon: User, label: 'Perfil', view: 'profile' as View },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-black/95 backdrop-blur-xl">
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {items.map(({ icon: Icon, label, view, badge }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              onClick={() => onNavigate(view)}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive ? 'text-red-500' : 'text-white/40 hover:text-white/70'
              }`}
            >
              <div className="relative">
                <Icon
                  size={22}
                  className={`transition-all ${isActive ? 'scale-110' : ''}`}
                  fill={isActive ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 0 : 1.5}
                />
                {badge ? (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {badge > 9 ? '9+' : badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-red-500' : ''}`}>{label}</span>
              {isActive && (
                <div className="absolute bottom-0 w-1 h-1 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
