'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GenerationHistory as GenerationHistoryType } from '@/types';

export default function HistoryPage() {
  const [history, setHistory] = useState<GenerationHistoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearHistory = () => {
    localStorage.removeItem('pixilator_history');
    setHistory([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-pulse-subtle text-gray-600">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-900">Generation History</h1>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="salt-paper-button px-4 py-2 rounded-lg hover:scale-105 transition-transform"
            >
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg">No generations yet. Create your first image!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="salt-paper-card rounded-lg p-4 hover:shadow-lg transition-all duration-300 animate-fade-in-up hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative mb-4 group">
                  <Image
                    src={item.imageUrl}
                    alt={item.originalPrompt}
                    width={400}
                    height={400}
                    className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <button
                    onClick={() => downloadImage(
                      item.imageUrl, 
                      `pixilator-${item.id}.png`
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
                    {item.originalPrompt}
                  </h3>
                  <div className="flex flex-wrap gap-1">
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
                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
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
