import { useState } from 'react';
import { Play, Search, Menu, X, Home, Star, Download, Settings, LogOut, User, ChevronRight } from 'lucide-react';
import type { User as UserType, View } from '../lib/types';

interface HeaderProps {
  user: UserType;
  currentView: View;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  onSearch: (q: string) => void;
  searchQuery: string;
}

export function Header({ user, currentView, onNavigate, onLogout, onSearch, searchQuery }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = [
    { icon: <Home size={18} />, label: 'Início', view: 'home' as View },
    { icon: <Star size={18} />, label: 'Favoritos', view: 'favorites' as View },
    { icon: <Download size={18} />, label: 'Downloads', view: 'downloads' as View },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/95 backdrop-blur-xl">
        <div className="flex items-center h-14 px-4 gap-3">
          {/* Avatar / Profile */}
          <div className="relative">
            <button
              onClick={() => { setProfileOpen(!profileOpen); setMenuOpen(false); }}
              className="w-9 h-9 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center overflow-hidden hover:border-red-500 transition-all"
            >
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-red-400">{user.name[0]?.toUpperCase()}</span>
              )}
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute top-11 left-0 w-64 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center">
                      <span className="text-sm font-bold text-red-400">{user.name[0]?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{user.name}</p>
                      <p className="text-xs text-white/50">@{user.username}</p>
                    </div>
                  </div>
                  {user.bio && (
                    <p className="text-xs text-white/40 mt-2 line-clamp-2">{user.bio}</p>
                  )}
                  {user.plan === 'premium' && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-red-600/20 text-red-400 text-[10px] font-bold rounded-full border border-red-600/30">
                      ✨ PREMIUM
                    </span>
                  )}
                </div>
                <div className="p-2">
                  <button
                    onClick={() => { onNavigate('profile'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    <User size={15} /> Meu Perfil
                    <ChevronRight size={14} className="ml-auto" />
                  </button>
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm"
                  >
                    <Settings size={15} /> Configurações
                    <ChevronRight size={14} className="ml-auto" />
                  </button>
                  <button
                    onClick={() => { onLogout(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-600/10 transition-all text-sm"
                  >
                    <LogOut size={15} /> Sair
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Logo - Center */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-1.5"
            >
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                <Play size={12} className="fill-white text-white" />
              </div>
              <span className="text-lg font-black tracking-widest text-white" style={{ letterSpacing: '0.15em' }}>
                DSCREEN
              </span>
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => { setSearchOpen(!searchOpen); setMenuOpen(false); setProfileOpen(false); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              <Search size={18} />
            </button>

            {/* Menu */}
            <button
              onClick={() => { setMenuOpen(!menuOpen); setProfileOpen(false); setSearchOpen(false); }}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-all"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="px-4 pb-3 animate-fade-in">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                autoFocus
                type="text"
                placeholder="Buscar filmes, séries..."
                value={searchQuery}
                onChange={e => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Side Menu */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-72 z-50 bg-zinc-950 border-l border-white/10 shadow-2xl animate-slide-right">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <span className="font-bold text-white">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="text-white/50 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item.view}
                  onClick={() => { onNavigate(item.view); setMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                    currentView === item.view
                      ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <button
                onClick={() => { onLogout(); setMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-600/10 transition-all text-sm font-medium"
              >
                <LogOut size={18} />
                Sair da conta
              </button>
            </div>
          </div>
        </>
      )}

      {/* Overlay close for profile */}
      {profileOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
      )}
    </>
  );
}
