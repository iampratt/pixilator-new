'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GenerationHistory as GenerationHistoryType } from '@/types';

export function GenerationHistory() {
  const [history, setHistory] = useState<GenerationHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    try {
      const storedHistory = localStorage.getItem('pixilator_history');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('pixilator_history');
    setHistory([]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse-subtle text-gray-600">Loading...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8 animate-fade-in-up">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-600">No generations yet. Create your first image!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between animate-fade-in-up">
        <p className="text-sm text-gray-600">
          {history.length} recent generation{history.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={clearHistory}
          className="text-xs text-red-600 hover:text-red-700 transition-colors hover:scale-105"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.map((item, index) => (
          <div
            key={item.id}
            className="salt-paper-card rounded-lg p-3 hover:shadow-lg transition-all duration-300 animate-fade-in-up hover:scale-105"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex space-x-3">
              <div className="relative group">
                <Image
                  src={item.imageUrl}
                  alt={item.originalPrompt}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium truncate">
                  {item.originalPrompt}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {item.style}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {item.aspectRatio}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {item.modelVersion.split('/').pop()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}