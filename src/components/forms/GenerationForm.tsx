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
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            Describe your image
          </label>
          <textarea
            id="prompt"
            value={formData.prompt}
            onChange={(e) => handleInputChange('prompt', e.target.value)}
            placeholder="A majestic mountain landscape at sunset..."
            className="salt-paper-input w-full px-4 py-3 rounded-lg resize-none"
            rows={3}
            disabled={isGenerating}
          />
        </div>

        {/* Style Selection */}
        <div>
          <label htmlFor="style" className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <select
            id="style"
            value={formData.style}
            onChange={(e) => handleInputChange('style', e.target.value)}
            className="salt-paper-input w-full px-4 py-3 rounded-lg"
            disabled={isGenerating}
          >
            {STYLE_PRESETS.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>
        </div>

        {/* Aspect Ratio */}
        <div>
          <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-700 mb-2">
            Aspect Ratio
          </label>
          <select
            id="aspectRatio"
            value={formData.aspectRatio}
            onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
            className="salt-paper-input w-full px-4 py-3 rounded-lg"
            disabled={isGenerating}
          >
            {ASPECT_RATIOS.map((ratio) => (
              <option key={ratio.id} value={ratio.value}>
                {ratio.name}
              </option>
            ))}
          </select>
        </div>

        {/* Model Version */}
        <div>
          <label htmlFor="modelVersion" className="block text-sm font-medium text-gray-700 mb-2">
            Model Version
          </label>
          <select
            id="modelVersion"
            value={formData.modelVersion}
            onChange={(e) => handleInputChange('modelVersion', e.target.value)}
            className="salt-paper-input w-full px-4 py-3 rounded-lg"
            disabled={isGenerating}
          >
            <option value="tencent/HunyuanImage-3.0">HunyuanImage 3.0</option>
            <option value="black-forest-labs/FLUX.1-dev">FLUX.1-dev</option>
            <option value="stabilityai/stable-diffusion-xl-base-1.0">Stability AI Stable Diffusion XL Base 1.0</option>
          </select>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-300 rounded-lg animate-fade-in-up">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isGenerating || !formData.prompt.trim()}
          className="salt-paper-button w-full py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Generating...</span>
            </div>
          ) : (
            'Generate Image'
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 salt-paper-card rounded-lg animate-fade-in-up">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated Image</h3>
          <div className="space-y-4">
            <div className="relative group">
              <Image
                src={result.imageUrl}
                alt={result.originalPrompt}
                width={1024}
                height={1024}
                className="w-full rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = result.imageUrl;
                  link.download = `pixilator-${result.id}.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-gray-900 p-2 rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110"
                title="Download image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-700 font-medium">Original Prompt:</span>
                <p className="text-gray-600">{result.originalPrompt}</p>
              </div>
              <div>
                <span className="text-gray-700 font-medium">Enhanced Prompt:</span>
                <p className="text-gray-600">{result.refinedPrompt}</p>
              </div>
              <div>
                <span className="text-gray-700 font-medium">Processing Time:</span>
                <p className="text-gray-600">{result.processingTime}ms</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
