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
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No generations yet. Create your first image!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {history.length} recent generation{history.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={clearHistory}
          className="text-xs text-red-400 hover:text-red-300 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
          >
            <div className="flex space-x-3">
              <Image
                src={item.imageUrl}
                alt={item.originalPrompt}
                width={64}
                height={64}
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                unoptimized
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">
                  {item.originalPrompt}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {item.style} • {item.aspectRatio} • {item.modelVersion}
                </p>
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
