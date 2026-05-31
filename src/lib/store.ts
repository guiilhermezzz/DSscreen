import { useState, useCallback, useEffect } from 'react';
import { supabase } from './supabase';
import type { Movie, User, View } from './types';

type RegisteredUser = User & {
  password: string;
};

function loadRegisteredUsers(): RegisteredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem('dscreen-registered-users');
    return stored ? JSON.parse(stored) as RegisteredUser[] : [];
  } catch {
    return [];
  }
}

function loadCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('dscreen-current-user');
    return stored ? JSON.parse(stored) as User : null;
  } catch {
    return null;
  }
}

// Simple in-memory store using React state
export function useAppStore() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [user, setUser] = useState<User | null>(loadCurrentUser);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(loadRegisteredUsers);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [downloads, setDownloads] = useState<string[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [watchingMovie, setWatchingMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    localStorage.setItem('dscreen-registered-users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dscreen-current-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dscreen-current-user');
    }
  }, [user]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Try Supabase auth first
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
      if (!error && data?.user) {
        // Try to load profile from users table
        const { data: profile, error: profileErr } = await supabase
          .from('users')
          .select('*')
          .eq('email', normalizedEmail)
          .single();

        if (!profileErr && profile) {
          const authenticatedUser: User = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            username: profile.username,
            bio: profile.bio,
            avatarUrl: profile.avatar_url ?? profile.avatarUrl,
            plan: profile.plan,
          };
          setUser(authenticatedUser);
          setCurrentView('home');
          return authenticatedUser;
        }
      }
    } catch (err) {
      // ignore and fallback to localStorage
      // eslint-disable-next-line no-console
      console.error('Supabase login error', err);
    }

    // Fallback to localStorage-based auth
    const match = registeredUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!match || match.password !== password) {
      return null;
    }

    const authenticatedUser: User = {
      id: match.id,
      name: match.name,
      email: match.email,
      username: match.username,
      bio: match.bio,
      avatarUrl: match.avatarUrl,
      plan: match.plan,
    };

    setUser(authenticatedUser);
    setCurrentView('home');
    return authenticatedUser;
  }, [registeredUsers]);

  const register = useCallback(async (email: string, name: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !name.trim() || !password) {
      return null;
    }

    // Try Supabase sign up first
    try {
      const { data, error } = await supabase.auth.signUp({ email: normalizedEmail, password });
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Supabase signUp error', error);
      } else if (data?.user) {
        const userId = data.user.id;
        const username = name.trim().toLowerCase().replace(/\s+/g, '');
        // Insert profile into users table
        const { data: profile, error: insertErr } = await supabase.from('users').insert({
          id: userId,
          name: name.trim(),
          email: normalizedEmail,
          username,
          bio: 'Amante de filmes e séries',
          plan: 'premium',
        }).select().single();

        if (!insertErr && profile) {
          const newUser: RegisteredUser = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            username: profile.username,
            bio: profile.bio,
            plan: profile.plan,
            password,
          };

          setRegisteredUsers(prev => [...prev, newUser]);
          setUser({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            username: newUser.username,
            bio: newUser.bio,
            plan: newUser.plan,
            avatarUrl: (profile as any).avatar_url ?? (profile as any).avatarUrl,
          });
          setCurrentView('home');
          return newUser;
        }
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Supabase register error', err);
    }

    // Fallback: localStorage-based registration
    if (registeredUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return null;
    }

    const newUser: RegisteredUser = {
      id: typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      username: name.trim().toLowerCase().replace(/\s+/g, ''),
      bio: 'Amante de filmes e séries',
      plan: 'premium',
      password,
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setUser({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      bio: newUser.bio,
      plan: newUser.plan,
      avatarUrl: newUser.avatarUrl,
    });
    setCurrentView('home');
    return newUser;
  }, [registeredUsers]);

  const logout = useCallback(() => {
    setUser(null);
    setCurrentView('landing');
    setFavorites([]);
    setDownloads([]);
  }, []);

  const resetPassword = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    // Try Supabase password reset email
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: window.location.origin,
      });
      if (!error) {
        return true;
      }
      // eslint-disable-next-line no-console
      console.error('Supabase reset password error', error);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Supabase resetPassword failed', err);
    }

    // Fallback: update localStorage-registered user password directly
    let updated = false;
    setRegisteredUsers(prev => prev.map(user => {
      if (user.email.toLowerCase() === normalizedEmail) {
        updated = true;
        return { ...user, password };
      }
      return user;
    }));

    return updated;
  }, []);

  const toggleFavorite = useCallback((movieId: string) => {
    setFavorites(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId);
      }
      return [...prev, movieId];
    });
  }, []);

  const toggleDownload = useCallback((movieId: string) => {
    setDownloads(prev => {
      if (prev.includes(movieId)) {
        return prev.filter(id => id !== movieId);
      }
      return [...prev, movieId];
    });
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const next = { ...prev, ...updates };
      setRegisteredUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === next.id ? { ...user, ...updates } : user
        )
      );
      return next;
    });
  }, []);

  return {
    currentView, setCurrentView,
    user, login, register, resetPassword, logout, updateUser,
    favorites, toggleFavorite,
    downloads, toggleDownload,
    selectedMovie, setSelectedMovie,
    watchingMovie, setWatchingMovie,
    searchQuery, setSearchQuery,
    activeCategory, setActiveCategory,
    toast, showToast,
  };
}
