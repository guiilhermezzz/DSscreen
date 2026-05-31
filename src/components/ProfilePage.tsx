import { Mail, Edit3, Star, Download, Heart, Film, LogOut, ChevronRight, Crown } from 'lucide-react';
import type { User as UserType, View } from '../lib/types';
import { MOCK_MOVIES } from '../lib/mockData';

interface ProfilePageProps {
  user: UserType;
  favorites: string[];
  downloads: string[];
  onLogout: () => void;
  onNavigate: (view: View) => void;
}

export function ProfilePage({ user, favorites, downloads, onLogout, onNavigate }: ProfilePageProps) {
  const stats = [
    { icon: <Heart size={16} className="text-red-400" />, label: 'Favoritos', value: favorites.length },
    { icon: <Download size={16} className="text-green-400" />, label: 'Downloads', value: downloads.length },
    { icon: <Film size={16} className="text-blue-400" />, label: 'Catálogo', value: MOCK_MOVIES.length },
  ];

  const menuItems = [
    { icon: <Edit3 size={16} />, label: 'Editar perfil', action: () => onNavigate('editProfile') },
    { icon: <Star size={16} />, label: 'Meus favoritos', action: () => onNavigate('favorites') },
    { icon: <Download size={16} />, label: 'Meus downloads', action: () => onNavigate('downloads') },
    { icon: <Crown size={16} />, label: 'Plano Premium', action: () => {} },
  ];

  return (
    <div className="pb-20 pt-4">
      {/* Header */}
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-black text-white">Perfil</h1>
      </div>

      {/* Avatar & Info */}
      <div className="flex flex-col items-center px-4 mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-red-600/50 to-red-900/50 border-2 border-red-600/50 flex items-center justify-center text-4xl font-black text-white">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span>{user.name[0]?.toUpperCase()}</span>
            )}
          </div>
          {user.plan === 'premium' && (
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-yellow-500 border-2 border-black flex items-center justify-center">
              <Crown size={14} className="text-black" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-bold text-white">{user.name}</h2>
        <p className="text-white/50 text-sm">@{user.username}</p>
        {user.bio && (
          <p className="text-white/40 text-xs text-center mt-2 max-w-xs">{user.bio}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <Mail size={12} className="text-white/30" />
          <span className="text-white/30 text-xs">{user.email}</span>
        </div>

        {user.plan === 'premium' && (
          <div className="mt-3 px-4 py-1.5 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-full flex items-center gap-2">
            <Crown size={13} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-bold">Assinante Premium</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ icon, label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-4 bg-zinc-900 border border-white/5 rounded-2xl">
              {icon}
              <span className="text-2xl font-black text-white">{value}</span>
              <span className="text-white/40 text-xs">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 space-y-2">
        {menuItems.map(({ icon, label, action }) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center gap-3 px-4 py-3.5 bg-zinc-900 border border-white/5 rounded-xl text-white/70 hover:text-white hover:border-white/10 transition-all text-sm"
          >
            <span className="text-white/40">{icon}</span>
            <span className="flex-1 text-left font-medium">{label}</span>
            <ChevronRight size={16} className="text-white/20" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="px-4 mt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-red-600/20 bg-red-600/5 text-red-400 hover:bg-red-600/10 transition-all text-sm font-bold"
        >
          <LogOut size={16} />
          Sair da conta
        </button>
      </div>

      {/* Version */}
      <div className="text-center mt-6 text-white/20 text-xs">
        DScreen v1.0.0 • Made with love
      </div>
    </div>
  );
}
