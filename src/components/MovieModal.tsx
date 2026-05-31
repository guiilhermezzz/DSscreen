import { X, Play, Star, Heart, Download, Clock, Calendar, Globe, Film, Tv, User } from 'lucide-react';
import type { Movie } from '../lib/types';

interface MovieModalProps {
  movie: Movie;
  isFavorite: boolean;
  isDownloaded: boolean;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onFavorite: (movieId: string) => void;
  onDownload: (movieId: string) => void;
}

export function MovieModal({ movie, isFavorite, isDownloaded, onClose, onPlay, onFavorite, onDownload }: MovieModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full md:max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 md:rounded-2xl border border-white/10 shadow-2xl animate-scale-in">
        {/* Hero Image */}
        <div className="relative h-48 md:h-64 overflow-hidden md:rounded-t-2xl">
          <img
            src={movie.heroUrl || movie.coverUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10"
          >
            <X size={18} />
          </button>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            {movie.quality && (
              <span className="px-2 py-0.5 bg-yellow-500/90 text-black text-xs font-bold rounded">
                {movie.quality}
              </span>
            )}
            {movie.isNew && (
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                Novo
              </span>
            )}
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-4 left-5 right-5">
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{movie.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Rating & Meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
              <Star size={13} className="fill-yellow-400 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-sm">{movie.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-sm">
              <Calendar size={13} />
              <span>{movie.year}</span>
            </div>
            {movie.duration && (
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <Clock size={13} />
                <span>{movie.duration}</span>
              </div>
            )}
            {movie.seasons && (
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <Tv size={13} />
                <span>{movie.seasons} temporadas</span>
              </div>
            )}
            {movie.language && (
              <div className="flex items-center gap-1.5 text-white/50 text-sm">
                <Globe size={13} />
                <span>{movie.language}</span>
              </div>
            )}
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {movie.genre.map(g => (
              <span key={g} className="px-3 py-1 bg-white/5 border border-white/10 text-white/60 text-xs rounded-full">
                {g}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-white/70 text-sm leading-relaxed mb-5">
            {movie.description}
          </p>

          {/* Director & Cast */}
          {movie.director && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Film size={13} className="text-white/40" />
                <span className="text-white/40 text-xs uppercase tracking-wide">Diretor</span>
              </div>
              <span className="text-white/80 text-sm">{movie.director}</span>
            </div>
          )}

          {movie.cast && movie.cast.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <User size={13} className="text-white/40" />
                <span className="text-white/40 text-xs uppercase tracking-wide">Elenco</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map(name => (
                  <span key={name} className="px-3 py-1.5 bg-zinc-900 border border-white/5 text-white/70 text-xs rounded-lg">
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { onPlay(movie); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play size={16} className="fill-white" />
              Assistir Agora
            </button>
            <button
              onClick={() => onFavorite(movie.id)}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${
                isFavorite
                  ? 'bg-red-600/20 text-red-400 border-red-600/30'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              <Heart size={16} className={isFavorite ? 'fill-red-400' : ''} />
              {isFavorite ? 'Favoritado' : 'Favoritar'}
            </button>
            <button
              onClick={() => onDownload(movie.id)}
              className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${
                isDownloaded
                  ? 'bg-green-600/20 text-green-400 border-green-600/30'
                  : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10'
              }`}
            >
              <Download size={16} />
              {isDownloaded ? 'Baixado' : 'Baixar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
