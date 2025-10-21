-- Supabase Storage Setup for Pixilator
-- Run these commands in your Supabase SQL editor

-- Create storage bucket for generated images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('generated-images', 'generated-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access to images
CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT USING (bucket_id = 'generated-images');

-- Create policy for public upload access (for the API)
CREATE POLICY "Public can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'generated-images');

-- Update the generations table to allow public access
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to generations
CREATE POLICY "Public can view all generations" ON generations
FOR SELECT USING (true);

-- Create policy for public insert access to generations
CREATE POLICY "Public can insert generations" ON generations
FOR INSERT WITH CHECK (true);

-- Update the generations table to allow public user_id
-- This allows the API to insert with user_id = 'public'
ALTER TABLE generations ALTER COLUMN user_id DROP NOT NULL;
