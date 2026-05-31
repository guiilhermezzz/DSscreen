import { Download, Play, Trash2, HardDrive } from 'lucide-react';
import { MOCK_MOVIES } from '../lib/mockData';
import type { Movie } from '../lib/types';

interface DownloadsPageProps {
  downloads: string[];
  onMovieClick: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  onRemoveDownload: (movieId: string) => void;
}

export function DownloadsPage({ downloads, onMovieClick, onPlay, onRemoveDownload }: DownloadsPageProps) {
  const downloadedMovies = MOCK_MOVIES.filter(m => downloads.includes(m.id));
  const totalSize = downloadedMovies.length * 1.8; // Fake GB

  return (
    <div className="pb-20 pt-4">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Download size={22} className="text-green-400" />
          Downloads
        </h1>
        <p className="text-white/40 text-sm mt-0.5">
          {downloadedMovies.length} título{downloadedMovies.length !== 1 ? 's' : ''} baixados
        </p>

        {downloadedMovies.length > 0 && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2 bg-white/5 rounded-xl border border-white/5">
            <HardDrive size={14} className="text-white/40" />
            <span className="text-white/50 text-xs">
              Espaço utilizado: <span className="text-white font-medium">{totalSize.toFixed(1)} GB</span>
            </span>
          </div>
        )}
      </div>

      {downloadedMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Download size={32} className="text-white/20" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Nenhum download ainda</h3>
          <p className="text-white/40 text-sm max-w-xs">
            Baixe filmes e séries para assistir offline, sem precisar de internet.
          </p>
        </div>
      ) : (
        <div className="px-4 space-y-3">
          {downloadedMovies.map(movie => (
            <div
              key={movie.id}
              className="flex items-center gap-3 p-3 bg-zinc-900 border border-white/5 rounded-xl hover:border-white/10 transition-all"
            >
              {/* Thumbnail */}
              <div
                className="relative shrink-0 w-16 h-24 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => onMovieClick(movie)}
              >
                <img src={movie.coverUrl} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Play size={16} className="fill-white text-white" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-white text-sm line-clamp-1 cursor-pointer hover:text-red-400 transition-colors"
                  onClick={() => onMovieClick(movie)}
                >
                  {movie.title}
                </h3>
                <p className="text-white/40 text-xs mt-0.5">
                  {movie.year} · {movie.type === 'series' ? `${movie.seasons} temporadas` : movie.duration}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-bold rounded uppercase">
                    ✓ Baixado
                  </span>
                  {movie.quality && (
                    <span className="px-1.5 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-bold rounded uppercase">
                      {movie.quality}
                    </span>
                  )}
                  <span className="text-white/30 text-[10px]">~1.8 GB</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={() => onPlay(movie)}
                  className="w-9 h-9 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 hover:bg-red-600/30 transition-all"
                >
                  <Play size={14} className="fill-red-400 ml-0.5" />
                </button>
                <button
                  onClick={() => onRemoveDownload(movie.id)}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-600/10 hover:border-red-600/20 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
