import { useAppStore } from './lib/store';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './components/HomePage';
import { FavoritesPage } from './components/FavoritesPage';
import { DownloadsPage } from './components/DownloadsPage';
import { ProfilePage } from './components/ProfilePage';
import { EditProfilePage } from './components/EditProfilePage';
import { MovieModal } from './components/MovieModal';
import { WatchPlayer } from './components/WatchPlayer';
import { Toast } from './components/Toast';

export default function App() {
  const store = useAppStore();

  const {
    currentView, setCurrentView,
    user, login, register, resetPassword, logout, updateUser,
    favorites, toggleFavorite,
    downloads, toggleDownload,
    selectedMovie, setSelectedMovie,
    watchingMovie, setWatchingMovie,
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    toast, showToast,
  } = store;

  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    if (!success) {
      return false;
    }
    showToast('Bem-vindo de volta!', 'success');
    return true;
  };

  const handleRegister = async (email: string, name: string, password: string) => {
    const success = await register(email, name, password);
    if (!success) {
      return false;
    }
    showToast('Conta criada com sucesso!', 'success');
    return true;
  };

  const handleResetPassword = async (email: string, password: string) => {
    const success = await resetPassword(email, password);
    if (!success) {
      return false;
    }
    showToast('Senha redefinida com sucesso! Faça login.', 'success');
    setCurrentView('login');
    return true;
  };

  const handleForgotPassword = () => {
    setCurrentView('forgotPassword');
  };

  const handleLogout = () => {
    logout();
    showToast('Sessão encerrada', 'info');
  };

  const handleFavorite = (movieId: string) => {
    const wasFav = favorites.includes(movieId);
    toggleFavorite(movieId);
    showToast(wasFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos!');
  };

  const handleDownload = (movieId: string) => {
    const wasDown = downloads.includes(movieId);
    toggleDownload(movieId);
    showToast(wasDown ? 'Download removido' : 'Download iniciado!');
  };

  // Watch player (fullscreen)
  if (watchingMovie) {
    return (
      <WatchPlayer
        movie={watchingMovie}
        onBack={() => setWatchingMovie(null)}
      />
    );
  }

  // Landing
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onLogin={() => setCurrentView('login')}
          onRegister={() => setCurrentView('register')}
        />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
      </>
    );
  }

  // Auth pages
  if (currentView === 'login' || currentView === 'register' || currentView === 'forgotPassword') {
    return (
      <>
        <AuthPage
          mode={currentView}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onResetPassword={handleResetPassword}
          onForgotPassword={handleForgotPassword}
          onSwitchMode={() => setCurrentView(currentView === 'login' ? 'register' : 'login')}
          onBack={() => setCurrentView('landing')}
          showToast={showToast}
        />
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
      </>
    );
  }

  // Main app (authenticated)
  if (!user) {
    setCurrentView('landing');
    return null;
  }

  const renderPage = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            favorites={favorites}
            downloads={downloads}
            searchQuery={searchQuery}
            activeCategory={activeCategory}
            onCategoryChange={cat => { setActiveCategory(cat); setSearchQuery(''); }}
            onMovieClick={setSelectedMovie}
            onFavorite={handleFavorite}
            onDownload={handleDownload}
            onPlay={setWatchingMovie}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            favorites={favorites}
            downloads={downloads}
            onMovieClick={setSelectedMovie}
            onFavorite={handleFavorite}
            onDownload={handleDownload}
          />
        );
      case 'downloads':
        return (
          <DownloadsPage
            downloads={downloads}
            onMovieClick={setSelectedMovie}
            onPlay={setWatchingMovie}
            onRemoveDownload={handleDownload}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            user={user}
            favorites={favorites}
            downloads={downloads}
            onLogout={handleLogout}
            onNavigate={setCurrentView}
          />
        );
      case 'editProfile':
        return (
          <EditProfilePage
            user={user}
            onSave={updateUser}
            onBack={() => setCurrentView('profile')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header
        user={user}
        currentView={currentView}
        onNavigate={view => {
          setCurrentView(view);
          setSearchQuery('');
          setActiveCategory('Todos');
        }}
        onLogout={handleLogout}
        onSearch={q => {
          setSearchQuery(q);
          if (currentView !== 'home') setCurrentView('home');
          if (q) setActiveCategory('Todos');
        }}
        searchQuery={searchQuery}
      />

      <main>
        {renderPage()}
      </main>

      <BottomNav
        currentView={currentView}
        onNavigate={view => {
          setCurrentView(view);
          setSearchQuery('');
          setActiveCategory('Todos');
        }}
        favoritesCount={favorites.length}
        downloadsCount={downloads.length}
      />

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isFavorite={favorites.includes(selectedMovie.id)}
          isDownloaded={downloads.includes(selectedMovie.id)}
          onClose={() => setSelectedMovie(null)}
          onPlay={movie => { setSelectedMovie(null); setWatchingMovie(movie); }}
          onFavorite={id => { handleFavorite(id); }}
          onDownload={id => { handleDownload(id); }}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => {}} />
      )}
    </div>
  );
}
