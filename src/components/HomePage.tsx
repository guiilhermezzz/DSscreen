import { useMemo } from 'react';
import { HeroSection } from './HeroSection';
import { CategoryBar } from './CategoryBar';
import { MovieCard } from './MovieCard';
import { MOCK_MOVIES, FEATURED_MOVIE } from '../lib/mockData';
import type { Movie } from '../lib/types';

interface HomePageProps {
  favorites: string[];
  downloads: string[];
  searchQuery: string;
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onMovieClick: (movie: Movie) => void;
  onFavorite: (movieId: string) => void;
  onDownload: (movieId: string) => void;
  onPlay: (movie: Movie) => void;
}

export function HomePage({
  favorites, downloads, searchQuery, activeCategory,
  onCategoryChange, onMovieClick, onFavorite, onDownload, onPlay,
}: HomePageProps) {
  const filteredMovies = useMemo(() => {
    return MOCK_MOVIES.filter(movie => {
      const matchSearch = !searchQuery || movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        activeCategory === 'Todos' ||
        (activeCategory === 'Filmes' && movie.type === 'movie') ||
        (activeCategory === 'Séries' && movie.type === 'series') ||
        movie.genre.some(g => g === activeCategory);
      return matchSearch && matchCat;
    });
  }, [searchQuery, activeCategory]);

  const newReleases = useMemo(() => MOCK_MOVIES.filter(m => m.isNew), []);
  const topRated = useMemo(() => [...MOCK_MOVIES].sort((a, b) => b.rating - a.rating).slice(0, 6), []);

  const showSections = !searchQuery && activeCategory === 'Todos';

  return (
    <div className="pb-20">
      {/* Hero */}
      {showSections && (
        <HeroSection
          movie={FEATURED_MOVIE}
          isFavorite={favorites.includes(FEATURED_MOVIE.id)}
          onPlay={onPlay}
          onFavorite={onFavorite}
          onInfo={onMovieClick}
        />
      )}

      {/* Category Bar */}
      <CategoryBar activeCategory={activeCategory} onCategoryChange={onCategoryChange} />

      {/* Search Results */}
      {(searchQuery || activeCategory !== 'Todos') && (
        <section className="px-4 pb-6">
          <h2 className="text-white font-bold text-base mb-4">
            {searchQuery ? `Resultados para "${searchQuery}"` : activeCategory}
            <span className="ml-2 text-white/40 font-normal text-sm">({filteredMovies.length})</span>
          </h2>
          {filteredMovies.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4"></div>
              <p className="text-white/50">Nenhum resultado encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredMovies.map(movie => (
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
        </section>
      )}

      {/* Sections */}
      {showSections && (
        <>
          {/* New Releases */}
          {newReleases.length > 0 && (
            <Section title="Novidades" movies={newReleases} favorites={favorites} downloads={downloads} onMovieClick={onMovieClick} onFavorite={onFavorite} onDownload={onDownload} />
          )}

          {/* Top Rated */}
          <Section title="Mais Bem Avaliados" movies={topRated} favorites={favorites} downloads={downloads} onMovieClick={onMovieClick} onFavorite={onFavorite} onDownload={onDownload} />

          {/* All Movies */}
          <section className="px-4 pb-6">
            <h2 className="text-white font-bold text-base mb-4">Todo o Catálogo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {MOCK_MOVIES.map(movie => (
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
          </section>
        </>
      )}
    </div>
  );
}

function Section({ title, movies, favorites, downloads, onMovieClick, onFavorite, onDownload }: {
  title: string;
  movies: Movie[];
  favorites: string[];
  downloads: string[];
  onMovieClick: (m: Movie) => void;
  onFavorite: (id: string) => void;
  onDownload: (id: string) => void;
}) {
  return (
    <section className="mb-6">
      <h2 className="px-4 text-white font-bold text-base mb-3">{title}</h2>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
        {movies.map(movie => (
          <div key={movie.id} className="shrink-0 w-36">
            <MovieCard
              movie={movie}
              isFavorite={favorites.includes(movie.id)}
              isDownloaded={downloads.includes(movie.id)}
              onClick={() => onMovieClick(movie)}
              onFavorite={e => { e.stopPropagation(); onFavorite(movie.id); }}
              onDownload={e => { e.stopPropagation(); onDownload(movie.id); }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
