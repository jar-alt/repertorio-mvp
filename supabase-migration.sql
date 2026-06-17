-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cards table
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('thought', 'quote', 'link', 'image', 'insight', 'reference', 'trend', 'observation', 'sketch', 'concept')),
  title TEXT,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  date TEXT,
  context TEXT,
  author TEXT,
  source TEXT,
  image_url TEXT,
  projects UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT cards_user_id_not_null CHECK (user_id IS NOT NULL)
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  item_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT projects_user_id_not_null CHECK (user_id IS NOT NULL)
);

-- Create indexes for better query performance
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_created_at ON cards(created_at DESC);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cards table
-- Users can see only their own cards
CREATE POLICY "Users can view own cards" ON cards
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own cards
CREATE POLICY "Users can create cards" ON cards
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cards
CREATE POLICY "Users can update own cards" ON cards
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own cards
CREATE POLICY "Users can delete own cards" ON cards
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for projects table
-- Users can see only their own projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can create projects" ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_cards_updated_at
BEFORE UPDATE ON cards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
