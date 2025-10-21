/**
 * @jest-environment node
 */

import { APP_CONFIG, AI_CONFIG, STYLE_PRESETS, ASPECT_RATIOS, RATE_LIMIT_CONFIG, CACHE_CONFIG } from '@/lib/config';

describe('Application Configuration', () => {
  describe('APP_CONFIG', () => {
    test('should have required app configuration', () => {
      expect(APP_CONFIG.name).toBe('Pixilator');
      expect(APP_CONFIG.description).toContain('AI-powered');
      expect(APP_CONFIG.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('AI_CONFIG', () => {
    test('should have Stable Diffusion configuration', () => {
      expect(AI_CONFIG.stableDiffusion.baseUrl).toBeTruthy();
      expect(AI_CONFIG.stableDiffusion.modelVersions).toHaveLength(2);
      expect(AI_CONFIG.stableDiffusion.modelVersions[0]).toHaveProperty('id');
      expect(AI_CONFIG.stableDiffusion.modelVersions[0]).toHaveProperty('name');
      expect(AI_CONFIG.stableDiffusion.modelVersions[0]).toHaveProperty('endpoint');
    });

    test('should have Hugging Face configuration', () => {
      expect(AI_CONFIG.huggingFace.baseUrl).toBeTruthy();
      expect(AI_CONFIG.huggingFace.models).toHaveProperty('promptEnhancement');
      expect(AI_CONFIG.huggingFace.models).toHaveProperty('negativePromptGeneration');
    });

    test('should have valid model versions', () => {
      AI_CONFIG.stableDiffusion.modelVersions.forEach(model => {
        expect(model.id).toMatch(/^sd-/);
        expect(model.name).toBeTruthy();
        expect(model.endpoint).toBeTruthy();
      });
    });
  });

  describe('STYLE_PRESETS', () => {
    test('should have all required style presets', () => {
      const expectedStyles = ['realistic', 'cinematic', 'artistic', 'vaporwave'];
      
      expect(STYLE_PRESETS).toHaveLength(4);
      
      expectedStyles.forEach(style => {
        const preset = STYLE_PRESETS.find(p => p.id === style);
        expect(preset).toBeDefined();
      });
    });

    test('should have valid preset structure', () => {
      STYLE_PRESETS.forEach(preset => {
        expect(preset).toHaveProperty('id');
        expect(preset).toHaveProperty('name');
        expect(preset).toHaveProperty('description');
        expect(preset).toHaveProperty('prompt');
        expect(preset).toHaveProperty('negativePrompt');
        
        expect(typeof preset.id).toBe('string');
        expect(typeof preset.name).toBe('string');
        expect(typeof preset.description).toBe('string');
        expect(typeof preset.prompt).toBe('string');
        expect(typeof preset.negativePrompt).toBe('string');
      });
    });
  });

  describe('ASPECT_RATIOS', () => {
    test('should have all required aspect ratios', () => {
      const expectedRatios = ['1:1', '16:9', '9:16', '4:3', '3:4'];
      
      expect(ASPECT_RATIOS).toHaveLength(5);
      
      expectedRatios.forEach(ratio => {
        const aspectRatio = ASPECT_RATIOS.find(a => a.value === ratio);
        expect(aspectRatio).toBeDefined();
      });
    });

    test('should have valid aspect ratio structure', () => {
      ASPECT_RATIOS.forEach(ratio => {
        expect(ratio).toHaveProperty('id');
        expect(ratio).toHaveProperty('name');
        expect(ratio).toHaveProperty('value');
        expect(ratio).toHaveProperty('width');
        expect(ratio).toHaveProperty('height');
        
        expect(typeof ratio.width).toBe('number');
        expect(typeof ratio.height).toBe('number');
        expect(ratio.width).toBeGreaterThan(0);
        expect(ratio.height).toBeGreaterThan(0);
      });
    });

    test('should have correct aspect ratio calculations', () => {
      ASPECT_RATIOS.forEach(ratio => {
        const [w, h] = ratio.value.split(':').map(Number);
        const calculatedRatio = ratio.width / ratio.height;
        const expectedRatio = w / h;
        
        expect(Math.abs(calculatedRatio - expectedRatio)).toBeLessThan(0.1);
      });
    });
  });

  describe('RATE_LIMIT_CONFIG', () => {
    test('should have valid rate limiting configuration', () => {
      expect(RATE_LIMIT_CONFIG.maxRequestsPerHour).toBeGreaterThan(0);
      expect(RATE_LIMIT_CONFIG.maxRequestsPerDay).toBeGreaterThan(0);
      expect(RATE_LIMIT_CONFIG.maxRequestsPerHour).toBeLessThanOrEqual(RATE_LIMIT_CONFIG.maxRequestsPerDay);
    });
  });

  describe('CACHE_CONFIG', () => {
    test('should have valid cache configuration', () => {
      expect(CACHE_CONFIG.localStorageKey).toBeTruthy();
      expect(CACHE_CONFIG.maxCachedItems).toBeGreaterThan(0);
      expect(CACHE_CONFIG.cacheExpiryDays).toBeGreaterThan(0);
    });
  });
});
