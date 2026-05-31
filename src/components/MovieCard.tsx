import { Star, Download, Heart, Play } from 'lucide-react';
import type { Movie } from '../lib/types';

interface MovieCardProps {
  movie: Movie;
  isFavorite: boolean;
  isDownloaded: boolean;
  onClick: () => void;
  onFavorite: (e: React.MouseEvent) => void;
  onDownload: (e: React.MouseEvent) => void;
}

export function MovieCard({ movie, isFavorite, isDownloaded, onClick, onFavorite, onDownload }: MovieCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer rounded-xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-red-600/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-red-600/10"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.coverUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Badges Top */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {movie.isNew && (
            <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded uppercase tracking-wide">
              Novo
            </span>
          )}
          {movie.quality && (
            <span className="px-1.5 py-0.5 bg-yellow-500/90 text-black text-[9px] font-bold rounded uppercase">
              {movie.quality}
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={onFavorite}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isFavorite
                ? 'bg-red-600 text-white'
                : 'bg-black/60 text-white/70 hover:bg-red-600/80 hover:text-white'
            }`}
          >
            <Heart size={13} className={isFavorite ? 'fill-white' : ''} />
          </button>
          <button
            onClick={onDownload}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
              isDownloaded
                ? 'bg-green-600 text-white'
                : 'bg-black/60 text-white/70 hover:bg-green-600/80 hover:text-white'
            }`}
          >
            <Download size={13} />
          </button>
        </div>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
          <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30">
            <Play size={20} className="fill-white text-white ml-0.5" />
          </div>
        </div>

        {/* Title overlay */}
        <div className="absolute left-0 right-0 bottom-0 p-3">
          <div className="bg-gradient-to-t from-black/80 via-transparent to-transparent px-2 py-1 rounded-md">
            <h3 className="font-semibold text-white text-sm line-clamp-1">{movie.title}</h3>
            <div className="flex items-center justify-between mt-1">
              <span className="text-white/40 text-xs">{movie.year}</span>
              <div className="flex items-center gap-0.5">
                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                <span className="text-white/60 text-xs">{movie.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Type badge */}
        {movie.type === 'series' && (
          <div className="absolute bottom-2 left-2">
            <span className="px-2 py-0.5 bg-black/60 backdrop-blur text-white/80 text-[10px] rounded border border-white/10">
              {movie.seasons}T
            </span>
          </div>
        )}
      </div>

      {/* Info (compact) */}
      <div className="p-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-white/40 text-xs">{movie.type === 'movie' ? 'Filme' : 'Série'}</div>
          </div>
          <div className="flex items-center gap-0.5">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-white/60 text-xs">{movie.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {movie.genre.slice(0, 1).map(g => (
            <span key={g} className="px-2 py-0.5 bg-white/5 border border-white/5 text-white/40 text-[10px] rounded-full">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
