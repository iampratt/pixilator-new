'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GenerationRequest, GenerationResponse } from '@/types';
import { STYLE_PRESETS, ASPECT_RATIOS } from '@/lib/config';

export function GenerationForm() {
  const [formData, setFormData] = useState<GenerationRequest>({
    prompt: '',
    style: 'realistic',
    aspectRatio: '1:1',
    modelVersion: 'tencent/HunyuanImage-3.0',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Generation failed');
      }

      const data: GenerationResponse = await response.json();
      setResult(data);

      // Save to local storage for history
      const history = JSON.parse(localStorage.getItem('pixilator_history') || '[]');
      history.unshift(data);
      localStorage.setItem('pixilator_history', JSON.stringify(history.slice(0, 10)));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (field: keyof GenerationRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Describe your image
          </label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => handleInputChange('prompt', e.target.value)}
            placeholder="A majestic mountain landscape at sunset..."
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            rows={3}
            disabled={isGenerating}
          />
        </div>

        {/* Style Selection */}
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-300 mb-2">
            Style
          </label>
          <select
            id="style"
            value={formData.style}
            onChange={(e) => handleInputChange('style', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isGenerating}
          >
            {STYLE_PRESETS.map((style) => (
              <option key={style.id} value={style.id} className="bg-gray-800">
                {style.name}
              </option>
            ))}
          </select>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-300 mb-2">
            Aspect Ratio
          </label>
          <select
            id="aspectRatio"
            value={formData.aspectRatio}
            onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isGenerating}
          >
            {ASPECT_RATIOS.map((ratio) => (
              <option key={ratio.id} value={ratio.value} className="bg-gray-800">
                {ratio.name}
              </option>
            ))}
          </select>
        </div>

        {/* Model Version */}
        <div>
          <label htmlFor="modelVersion" className="block text-sm font-medium text-gray-300 mb-2">
            Model Version
          </label>
          <select
            id="modelVersion"
            value={formData.modelVersion}
            onChange={(e) => handleInputChange('modelVersion', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isGenerating}
          >
            <option value="tencent/HunyuanImage-3.0" className="bg-gray-800">HunyuanImage 3.0</option>
            <option value="black-forest-labs/FLUX.1-dev" className="bg-gray-800">FLUX.1-dev</option>
          </select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating || !formData.prompt.trim()}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Generating...</span>
            </div>
          ) : (
            'Generate Image'
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Generated Image</h3>
          <div className="space-y-4">
            <Image
              src={result.imageUrl}
              alt={result.originalPrompt}
              width={1024}
              height={1024}
              className="w-full rounded-lg shadow-lg"
              unoptimized
            />
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-300">Original Prompt:</span>
                <p className="text-white">{result.originalPrompt}</p>
              </div>
              <div>
                <span className="text-gray-300">Enhanced Prompt:</span>
                <p className="text-white">{result.refinedPrompt}</p>
              </div>
              <div>
                <span className="text-gray-300">Processing Time:</span>
                <p className="text-white">{result.processingTime}ms</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
