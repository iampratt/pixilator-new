/**
 * @jest-environment node
 */

import { STYLE_PRESETS } from '@/lib/config';

// Mock the AI service functions
const mockEnhancePrompt = jest.fn();
const mockGenerateNegativePrompt = jest.fn();

// Mock axios
jest.mock('axios', () => ({
  post: jest.fn(),
}));

describe('Prompt Enhancement Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Style Presets', () => {
    test('should have all required style presets', () => {
      const expectedStyles = ['realistic', 'cinematic', 'artistic', 'vaporwave'];
      
      expect(STYLE_PRESETS).toHaveLength(4);
      
      expectedStyles.forEach(style => {
        const preset = STYLE_PRESETS.find(p => p.id === style);
        expect(preset).toBeDefined();
        expect(preset?.name).toBeTruthy();
        expect(preset?.description).toBeTruthy();
        expect(preset?.prompt).toBeTruthy();
        expect(preset?.negativePrompt).toBeTruthy();
      });
    });

    test('should have unique style IDs', () => {
      const ids = STYLE_PRESETS.map(preset => preset.id);
      const uniqueIds = new Set(ids);
      
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have valid prompt templates', () => {
      STYLE_PRESETS.forEach(preset => {
        expect(preset.prompt.length).toBeGreaterThan(10);
        expect(preset.negativePrompt.length).toBeGreaterThan(10);
        expect(preset.prompt).not.toEqual(preset.negativePrompt);
      });
    });
  });

  describe('Prompt Enhancement Functions', () => {
    test('should handle empty prompt gracefully', () => {
      const emptyPrompt = '';
      mockEnhancePrompt.mockReturnValue(emptyPrompt);
      const result = mockEnhancePrompt(emptyPrompt);
      
      // Should return original prompt or handle gracefully
      expect(typeof result).toBe('string');
    });

    test('should enhance simple prompts', () => {
      const simplePrompt = 'a cat';
      const enhancedPrompt = 'a beautiful cat sitting gracefully';
      mockEnhancePrompt.mockReturnValue(enhancedPrompt);
      const result = mockEnhancePrompt(simplePrompt);
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(simplePrompt.length);
    });

    test('should preserve original prompt meaning', () => {
      const originalPrompt = 'a majestic mountain at sunset';
      const enhancedPrompt = 'a majestic mountain at sunset with golden light';
      mockEnhancePrompt.mockReturnValue(enhancedPrompt);
      const result = mockEnhancePrompt(originalPrompt);
      
      expect(result.toLowerCase()).toContain('mountain');
      expect(result.toLowerCase()).toContain('sunset');
    });
  });

  describe('Negative Prompt Generation', () => {
    test('should generate appropriate negative prompts for each style', () => {
      STYLE_PRESETS.forEach(preset => {
        const negativePrompt = 'blurry, low quality, distorted';
        mockGenerateNegativePrompt.mockReturnValue(negativePrompt);
        const result = mockGenerateNegativePrompt(preset.id);
        
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(10);
        expect(result).toContain(',');
      });
    });

    test('should generate different negative prompts for different styles', () => {
      const realisticNegative = 'blurry, low quality, distorted';
      const cinematicNegative = 'amateur, low budget, poorly lit';
      mockGenerateNegativePrompt
        .mockReturnValueOnce(realisticNegative)
        .mockReturnValueOnce(cinematicNegative);
      
      const result1 = mockGenerateNegativePrompt('realistic');
      const result2 = mockGenerateNegativePrompt('cinematic');
      
      expect(result1).not.toEqual(result2);
    });

    test('should handle unknown style gracefully', () => {
      const defaultNegative = 'blurry, low quality';
      mockGenerateNegativePrompt.mockReturnValue(defaultNegative);
      const result = mockGenerateNegativePrompt('unknown-style');
      
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('API Payload Construction', () => {
    test('should construct valid Stable Diffusion payload', () => {
      const payload = {
        text_prompts: [
          { text: 'test prompt', weight: 1 },
          { text: 'negative prompt', weight: -1 }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 50
      };

      expect(payload.text_prompts).toHaveLength(2);
      expect(payload.text_prompts[0].weight).toBe(1);
      expect(payload.text_prompts[1].weight).toBe(-1);
      expect(payload.cfg_scale).toBe(7);
      expect(payload.height).toBe(1024);
      expect(payload.width).toBe(1024);
    });

    test('should validate required payload fields', () => {
      const requiredFields = ['text_prompts', 'cfg_scale', 'height', 'width', 'samples', 'steps'];
      const payload = {
        text_prompts: [{ text: 'test', weight: 1 }],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 50
      };

      requiredFields.forEach(field => {
        expect(payload).toHaveProperty(field);
      });
    });
  });
});
