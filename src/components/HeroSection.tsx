import { Play, Plus, Star, Info } from 'lucide-react';
import type { Movie } from '../lib/types';

interface HeroSectionProps {
  movie: Movie;
  isFavorite: boolean;
  onPlay: (movie: Movie) => void;
  onFavorite: (movieId: string) => void;
  onInfo: (movie: Movie) => void;
}

export function HeroSection({ movie, isFavorite, onPlay, onFavorite, onInfo }: HeroSectionProps) {
  return (
    <div className="relative w-full" style={{ height: 'clamp(320px, 55vw, 520px)' }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.heroUrl || movie.coverUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-xs font-bold">
            Em Destaque
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur text-white/80 text-xs font-medium border border-white/10">
            {movie.type === 'movie' ? 'Filme' : `Série · ${movie.seasons} temporadas`}
          </span>
          {movie.quality && (
            <span className="px-2.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold border border-yellow-500/20">
              {movie.quality}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.8)' }}>
          {movie.title}
        </h2>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 text-sm text-white/70">
          <div className="flex items-center gap-1">
            <Star size={13} className="fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-white">{movie.rating.toFixed(1)}</span>
          </div>
          <span>•</span>
          <span>{movie.year}</span>
          {movie.duration && (
            <>
              <span>•</span>
              <span>{movie.duration}</span>
            </>
          )}
          {movie.language && (
            <>
              <span>•</span>
              <span>{movie.language}</span>
            </>
          )}
        </div>

        {/* Description */}
        <p className="text-white/60 text-sm max-w-lg line-clamp-2 mb-5 leading-relaxed">
          {movie.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onPlay(movie)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
          >
            <Play size={16} className="fill-black" />
            Assistir
          </button>
          <button
            onClick={() => onInfo(movie)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur text-white font-bold text-sm border border-white/10 hover:bg-white/20 transition-all hover:scale-105"
          >
            <Info size={16} />
            Mais info
          </button>
          <button
            onClick={() => onFavorite(movie.id)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 border ${
              isFavorite
                ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/30'
                : 'bg-white/10 backdrop-blur text-white border-white/10 hover:bg-white/20'
            }`}
          >
            {isFavorite ? null : <Plus size={16} />}
            {isFavorite ? 'Favoritado' : 'Favoritar'}
          </button>
        </div>
      </div>
    </div>
  );
}
