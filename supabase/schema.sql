-- Supabase / PostgreSQL schema for the streaming app

-- Enable UUID generation extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table stores profile and subscription data
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  username text NOT NULL UNIQUE,
  bio text,
  avatar_url text,
  plan text NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Movies table stores the catalog
CREATE TABLE IF NOT EXISTS movies (
  id text PRIMARY KEY,
  title text NOT NULL,
  year integer NOT NULL,
  rating numeric(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
  genre text[] NOT NULL,
  cover_url text NOT NULL,
  hero_url text,
  type text NOT NULL CHECK (type IN ('movie', 'series')),
  description text,
  duration text,
  seasons integer,
  director text,
  cast_members text[],
  language text,
  quality text,
  is_new boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  stream_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Favorite movies per user
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id text NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id)
);

-- Downloaded movies per user
CREATE TABLE IF NOT EXISTS downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  movie_id text NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  added_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, movie_id)
);

-- Trigger to keep updated_at current
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
    EXECUTE 'CREATE TRIGGER update_users_updated_at
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()';
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_movies_updated_at') THEN
    EXECUTE 'CREATE TRIGGER update_movies_updated_at
      BEFORE UPDATE ON movies
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()';
  END IF;
END;
$$;
