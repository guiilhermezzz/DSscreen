import { Heart } from 'lucide-react';
import { MovieCard } from './MovieCard';
import { MOCK_MOVIES } from '../lib/mockData';
import type { Movie } from '../lib/types';

interface FavoritesPageProps {
  favorites: string[];
  downloads: string[];
  onMovieClick: (movie: Movie) => void;
  onFavorite: (movieId: string) => void;
  onDownload: (movieId: string) => void;
}

export function FavoritesPage({ favorites, downloads, onMovieClick, onFavorite, onDownload }: FavoritesPageProps) {
  const favoriteMovies = MOCK_MOVIES.filter(m => favorites.includes(m.id));

  return (
    <div className="pb-20 pt-4">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Heart size={22} className="fill-red-500 text-red-500" />
          Meus Favoritos
        </h1>
        <p className="text-white/40 text-sm mt-0.5">
          {favoriteMovies.length} título{favoriteMovies.length !== 1 ? 's' : ''} salvos
        </p>
      </div>

      {favoriteMovies.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <Heart size={32} className="text-white/20" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Nenhum favorito ainda</h3>
          <p className="text-white/40 text-sm max-w-xs">
            Toque no ícone de coração em qualquer título para adicioná-lo aqui.
          </p>
        </div>
      ) : (
        <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {favoriteMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isFavorite={favorites.includes(movie.id)}
              isDownloaded={downloads.includes(movie.id)}
              onClick={() => onMovieClick(movie)}
              onFavorite={e => { e.stopPropagation(); onFavorite(movie.id); }}
              onDownload={e => { e.stopPropagation(); onDownload(movie.id); }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
