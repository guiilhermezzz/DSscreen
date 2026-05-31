export type MovieType = 'movie' | 'series';

export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genre: string[];
  coverUrl: string;
  heroUrl?: string;
  type: MovieType;
  description?: string;
  duration?: string;
  seasons?: number;
  director?: string;
  cast?: string[];
  language?: string;
  quality?: string;
  isNew?: boolean;
  isFeatured?: boolean;
  streamUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  plan?: 'free' | 'premium';
}

export type View = 'landing' | 'login' | 'register' | 'forgotPassword' | 'home' | 'favorites' | 'downloads' | 'profile' | 'editProfile' | 'watch';
