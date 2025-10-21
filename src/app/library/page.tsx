'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LibraryImage {
  id: string;
  original_prompt: string;
  refined_prompt: string;
  negative_prompt: string;
  image_url: string;
  style: string;
  aspect_ratio: string;
  model_version: string;
  processing_time: number;
  created_at: string;
}

export default function LibraryPage() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    style: '',
    modelVersion: ''
  });

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.style) params.append('style', filters.style);
      if (filters.modelVersion) params.append('modelVersion', filters.modelVersion);
      
      const response = await fetch(`/api/library?${params.toString()}`);
      const data = await response.json();
      
      if (response.ok) {
        setImages(data.images);
      } else {
        setError(data.error || 'Failed to fetch images');
      }
    } catch (err) {
      setError('Failed to fetch images');
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  }, [filters.style, filters.modelVersion]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-pulse-subtle text-gray-600">Loading library...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchImages}
            className="salt-paper-button px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Image Library</h1>
          <p className="text-gray-600 text-lg">Explore the community&apos;s AI-generated images</p>
        </div>

        {/* Filters */}
        <div className="mb-8 salt-paper-card rounded-lg p-6 animate-fade-in-up">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style
              </label>
              <select
                value={filters.style}
                onChange={(e) => setFilters(prev => ({ ...prev, style: e.target.value }))}
                className="salt-paper-input w-full px-3 py-2 rounded"
              >
                <option value="">All Styles</option>
                <option value="realistic">Realistic</option>
                <option value="cinematic">Cinematic</option>
                <option value="artistic">Artistic</option>
                <option value="vaporwave">Vaporwave</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <select
                value={filters.modelVersion}
                onChange={(e) => setFilters(prev => ({ ...prev, modelVersion: e.target.value }))}
                className="salt-paper-input w-full px-3 py-2 rounded"
              >
                <option value="">All Models</option>
                <option value="tencent/HunyuanImage-3.0">HunyuanImage 3.0</option>
                <option value="black-forest-labs/FLUX.1-dev">FLUX.1-dev</option>
                <option value="stabilityai/stable-diffusion-xl-base-1.0">Stable Diffusion XL</option>
              </select>
            </div>
          </div>
        </div>

        {images.length === 0 ? (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-4">No images found in the library yet</p>
            <p className="text-gray-500 mb-6">Be the first to generate an image and add it to the community library!</p>
            <Link 
              href="/" 
              className="salt-paper-button px-6 py-3 rounded-lg font-semibold inline-block hover:scale-105 transition-transform"
            >
              Generate Your First Image
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="salt-paper-card rounded-lg p-4 hover:shadow-lg transition-all duration-300 animate-fade-in-up hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-4 group">
                  <Image
                    src={image.image_url}
                    alt={image.original_prompt}
                    width={400}
                    height={400}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <button
                    onClick={() => downloadImage(
                      image.image_url, 
                      `pixilator-${image.id}.png`
                    )}
                    className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                    title="Download image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {image.original_prompt}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {image.style}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {image.aspect_ratio}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {image.model_version.split('/').pop()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(image.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}