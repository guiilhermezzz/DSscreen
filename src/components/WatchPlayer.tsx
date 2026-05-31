import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, Settings } from 'lucide-react';
import type { Movie } from '../lib/types';

interface WatchPlayerProps {
  movie: Movie;
  onBack: () => void;
}

export function WatchPlayer({ movie, onBack }: WatchPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(80);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (playing) {
      interval = setInterval(() => {
        setProgress(p => Math.min(p + 0.1, 100));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [playing]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (showControls && playing) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls, playing]);

  const formatTime = (pct: number) => {
    const totalSecs = movie.duration
      ? parseInt(movie.duration) * 60
      : 120 * 60;
    const elapsed = Math.floor((pct / 100) * totalSecs);
    const h = Math.floor(elapsed / 3600);
    const m = Math.floor((elapsed % 3600) / 60);
    const s = elapsed % 60;
    return h > 0
      ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const totalTime = movie.duration || '2:00:00';

  return (
    <div
      className="fixed inset-0 bg-black z-[200] flex flex-col"
      onClick={() => setShowControls(true)}
    >
      {/* Video Area (Simulated) */}
      <div className="flex-1 relative overflow-hidden">
        <img
          src={movie.heroUrl || movie.coverUrl}
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          {!playing && (
            <button
              onClick={e => { e.stopPropagation(); setPlaying(true); }}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Play size={36} className="fill-white text-white ml-2" />
            </button>
          )}
        </div>

        {/* Controls Overlay */}
        <div
          className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={e => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="flex items-center gap-4 p-4 bg-gradient-to-b from-black/80 to-transparent">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h3 className="text-white font-bold text-sm">{movie.title}</h3>
              <p className="text-white/50 text-xs">{movie.year} · {movie.type === 'series' ? 'Série' : 'Filme'}</p>
            </div>
            <button className="ml-auto w-10 h-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-all">
              <Settings size={18} />
            </button>
          </div>

          {/* Center Controls */}
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={() => setProgress(p => Math.max(0, p - 5))}
              className="text-white/70 hover:text-white transition-colors"
            >
              <SkipBack size={32} />
            </button>
            <button
              onClick={() => setPlaying(!playing)}
              className="w-16 h-16 rounded-full bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center hover:scale-110 transition-transform"
            >
              {playing
                ? <Pause size={28} className="text-white" />
                : <Play size={28} className="fill-white text-white ml-1" />
              }
            </button>
            <button
              onClick={() => setProgress(p => Math.min(100, p + 5))}
              className="text-white/70 hover:text-white transition-colors"
            >
              <SkipForward size={32} />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
            {/* Progress */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white/70 text-xs font-mono">{formatTime(progress)}</span>
              <div className="flex-1 relative group cursor-pointer" onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                setProgress(Math.max(0, Math.min(100, pct)));
              }}>
                <div className="h-1 bg-white/20 rounded-full group-hover:h-1.5 transition-all">
                  <div
                    className="h-full bg-red-600 rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
              <span className="text-white/70 text-xs font-mono">{totalTime}</span>
            </div>

            {/* Volume & Fullscreen */}
            <div className="flex items-center gap-3">
              <button onClick={() => setMuted(!muted)} className="text-white/70 hover:text-white transition-colors">
                {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="w-24 h-1 bg-white/20 rounded-full cursor-pointer" onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect();
                const pct = ((e.clientX - rect.left) / rect.width) * 100;
                setVolume(Math.max(0, Math.min(100, pct)));
              }}>
                <div className="h-full bg-white/60 rounded-full" style={{ width: muted ? '0%' : `${volume}%` }} />
              </div>
              <div className="ml-auto flex items-center gap-2 text-xs text-white/50">
                <span className="px-2 py-0.5 bg-white/10 rounded">{movie.quality || 'HD'}</span>
                <button className="text-white/70 hover:text-white transition-colors">
                  <Maximize size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
