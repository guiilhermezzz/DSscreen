import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Eye, EyeOff, Loader2, ArrowLeft, Play } from 'lucide-react';

interface AuthPageProps {
  mode: 'login' | 'register' | 'forgotPassword';
  onLogin: (email: string, password: string) => Promise<boolean> | boolean;
  onRegister: (email: string, name: string, password: string) => Promise<boolean> | boolean;
  onResetPassword: (email: string, password: string) => Promise<boolean> | boolean;
  onForgotPassword: () => void;
  onSwitchMode: () => void;
  onBack: () => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export function AuthPage({ mode, onLogin, onRegister, onResetPassword, onForgotPassword, onSwitchMode, onBack, showToast }: AuthPageProps) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: string) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email.includes('@')) {
      showToast('E-mail inválido', 'error');
      return;
    }

    if (mode === 'register') {
      if (!form.name.trim()) {
        showToast('Informe seu nome', 'error');
        return;
      }
      if (form.password !== form.confirm) {
        showToast('As senhas não coincidem', 'error');
        return;
      }
      if (form.password.length < 6) {
        showToast('Senha deve ter no mínimo 6 caracteres', 'error');
        return;
      }
    }

    if (mode === 'forgotPassword') {
      if (form.password.length < 6) {
        showToast('Senha deve ter no mínimo 6 caracteres', 'error');
        return;
      }
      if (form.password !== form.confirm) {
        showToast('As senhas não coincidem', 'error');
        return;
      }
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);

    const success = mode === 'register'
      ? await onRegister(form.email, form.name, form.password)
      : mode === 'forgotPassword'
        ? await onResetPassword(form.email, form.password)
        : await onLogin(form.email, form.password);

    if (!success) {
      if (mode === 'login') {
        showToast('E-mail ou senha inválidos. Cadastre-se primeiro.', 'error');
      } else if (mode === 'register') {
        showToast('Este e-mail já está cadastrado.', 'error');
      } else {
        showToast('E-mail não encontrado. Cadastre-se antes.', 'error');
      }
      return;
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8 relative">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-black" />
      </div>

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} />
        Voltar
      </button>

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-3">
            <Play size={20} className="fill-white text-white" />
          </div>
          <span className="text-3xl font-black tracking-widest text-white" style={{ letterSpacing: '0.2em' }}>
            DSCREEN
          </span>
          <p className="text-white/50 text-sm mt-1">
            {mode === 'login' ? 'Entre na sua conta' : mode === 'register' ? 'Crie sua conta' : 'Recupere sua senha'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Cadastro' : 'Esqueceu a senha?'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Nome completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={set('name')}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all disabled:opacity-50"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">E-mail</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={set('email')}
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={set('password')}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">Confirmar senha</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={set('confirm')}
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 focus:bg-white/15 transition-all disabled:opacity-50"
                />
              </div>
            )}

            {mode === 'login' && (
              <div className="text-right">
                <button type="button" onClick={onForgotPassword} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                  Esqueceu a senha?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading
                ? (mode === 'login' ? 'Entrando...' : mode === 'forgotPassword' ? 'Redefinindo...' : 'Criando conta...')
                : (mode === 'login' ? 'Entrar' : mode === 'forgotPassword' ? 'Redefinir senha' : 'Criar Conta')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/50">
            {mode === 'login' ? (
              <>
                Não tem conta?{' '}
                <button onClick={onSwitchMode} className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Criar conta grátis
                </button>
              </>
            ) : mode === 'register' ? (
              <>
                Já tem conta?{' '}
                <button onClick={onSwitchMode} className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Fazer login
                </button>
              </>
            ) : (
              <>
                Lembrou sua senha?{' '}
                <button onClick={onSwitchMode} className="text-red-400 hover:text-red-300 font-medium transition-colors">
                  Fazer login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
