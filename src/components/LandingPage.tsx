import { Play, Star, Tv, Film, Download } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

const FEATURES = [
  { icon: <Film size={24} />, title: 'Filmes em 4K', desc: 'Qualidade máxima para sua experiência' },
  { icon: <Tv size={24} />, title: 'Séries Completas', desc: 'Todas as temporadas disponíveis' },
  { icon: <Download size={24} />, title: 'Download Offline', desc: 'Assista sem internet' },
];

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/8263369/pexels-photo-8263369.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"
          alt="Cinema"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
            <Play size={16} className="fill-white text-white" />
          </div>
          <span className="text-2xl font-black tracking-widest text-white" style={{ fontFamily: 'system-ui', letterSpacing: '0.2em' }}>
            DSCREEN
          </span>
        </div>
        <button
          onClick={onLogin}
          className="px-5 py-2 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-all"
        >
          Entrar
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-16 pb-32 text-center md:pt-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-600/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-fade-in">
          <Star size={12} className="fill-red-400" />
          Streaming Premium
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-4 animate-fade-in" style={{ letterSpacing: '-0.02em' }}>
          D<span className="text-red-600">SCREEN</span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 max-w-lg mb-10 leading-relaxed animate-fade-in-delay">
          Assistir filmes e séries de qualidade você encontra aqui. Catálogo completo, sem limites.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm animate-fade-in-delay-2">
          <button
            onClick={onRegister}
            className="flex-1 py-4 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-base transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
          >
            Começar Grátis
          </button>
          <button
            onClick={onLogin}
            className="flex-1 py-4 px-6 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-base transition-all hover:scale-105 active:scale-95 backdrop-blur-sm"
          >
            Já tenho conta
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-8 mt-14 animate-fade-in-delay-2">
          {[
            { value: '+10k', label: 'Títulos' },
            { value: '4K', label: 'Qualidade' },
            { value: '5★', label: 'Avaliação' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs text-white/50 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Features */}
      <div className="relative z-10 px-6 pb-16 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-red-600/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-red-600/20 flex items-center justify-center text-red-400 shrink-0">
                {f.icon}
              </div>
              <div>
                <div className="font-bold text-white text-sm">{f.title}</div>
                <div className="text-white/50 text-xs mt-0.5">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
