-- Supabase Database Setup for Pixilator
-- Run these commands in your Supabase SQL editor

-- Create the generations table
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_prompt TEXT NOT NULL,
  refined_prompt TEXT NOT NULL,
  negative_prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style VARCHAR(50) NOT NULL DEFAULT 'realistic',
  aspect_ratio VARCHAR(10) NOT NULL DEFAULT '1:1',
  model_version VARCHAR(50) NOT NULL DEFAULT 'sd-1.5',
  processing_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);

-- Enable Row Level Security
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view their own generations
CREATE POLICY "Users can view their own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy for authenticated users to insert their own generations
CREATE POLICY "Users can insert their own generations" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for authenticated users to update their own generations
CREATE POLICY "Users can update their own generations" ON generations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for authenticated users to delete their own generations
CREATE POLICY "Users can delete their own generations" ON generations
  FOR DELETE USING (auth.uid() = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_generations_updated_at 
    BEFORE UPDATE ON generations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to clean up old generations (optional)
CREATE OR REPLACE FUNCTION cleanup_old_generations()
RETURNS void AS $$
BEGIN
    -- Delete generations older than 30 days
    DELETE FROM generations 
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ language 'plpgsql';

-- You can call this function periodically to clean up old data
-- SELECT cleanup_old_generations();
