/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GenerationForm } from '@/components/forms/GenerationForm';

// Mock fetch
global.fetch = jest.fn();

describe('GenerationForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  test('renders form elements correctly', () => {
    render(<GenerationForm />);
    
    expect(screen.getByLabelText(/describe your image/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/style/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aspect ratio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model version/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate image/i })).toBeInTheDocument();
  });

  test('has correct default values', () => {
    render(<GenerationForm />);
    
    expect(screen.getByDisplayValue('realistic')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1:1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('sd-1.5')).toBeInTheDocument();
  });

  test('validates required prompt field', async () => {
    const user = userEvent.setup();
    render(<GenerationForm />);
    
    const submitButton = screen.getByRole('button', { name: /generate image/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a prompt/i)).toBeInTheDocument();
    });
  });

  test('disables form during generation', async () => {
    const user = userEvent.setup();
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 1000))
    );
    
    render(<GenerationForm />);
    
    const promptInput = screen.getByLabelText(/describe your image/i);
    const submitButton = screen.getByRole('button', { name: /generate image/i });
    
    await user.type(promptInput, 'test prompt');
    await user.click(submitButton);
    
    expect(screen.getByText(/generating/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    expect(promptInput).toBeDisabled();
  });

  test('handles successful generation', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      id: 'test-id',
      imageUrl: 'data:image/png;base64,test',
      originalPrompt: 'test prompt',
      refinedPrompt: 'enhanced test prompt',
      negativePrompt: 'negative prompt',
      style: 'realistic',
      aspectRatio: '1:1',
      modelVersion: 'sd-1.5',
      userId: 'user-id',
      createdAt: new Date().toISOString(),
      processingTime: 1000
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    
    render(<GenerationForm />);
    
    const promptInput = screen.getByLabelText(/describe your image/i);
    const submitButton = screen.getByRole('button', { name: /generate image/i });
    
    await user.type(promptInput, 'test prompt');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/generated image/i)).toBeInTheDocument();
      expect(screen.getByAltText('test prompt')).toBeInTheDocument();
      expect(screen.getByText('test prompt')).toBeInTheDocument();
      expect(screen.getByText('enhanced test prompt')).toBeInTheDocument();
    });
  });

  test('handles generation error', async () => {
    const user = userEvent.setup();
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Generation failed' }),
    });
    
    render(<GenerationForm />);
    
    const promptInput = screen.getByLabelText(/describe your image/i);
    const submitButton = screen.getByRole('button', { name: /generate image/i });
    
    await user.type(promptInput, 'test prompt');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/generation failed/i)).toBeInTheDocument();
    });
  });

  test('updates form values correctly', async () => {
    const user = userEvent.setup();
    render(<GenerationForm />);
    
    const styleSelect = screen.getByLabelText(/style/i);
    const aspectRatioSelect = screen.getByLabelText(/aspect ratio/i);
    const modelSelect = screen.getByLabelText(/model version/i);
    
    await user.selectOptions(styleSelect, 'cinematic');
    await user.selectOptions(aspectRatioSelect, '16:9');
    await user.selectOptions(modelSelect, 'sd-xl');
    
    expect(screen.getByDisplayValue('cinematic')).toBeInTheDocument();
    expect(screen.getByDisplayValue('16:9')).toBeInTheDocument();
    expect(screen.getByDisplayValue('sd-xl')).toBeInTheDocument();
  });

  test('saves to localStorage on successful generation', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      id: 'test-id',
      imageUrl: 'data:image/png;base64,test',
      originalPrompt: 'test prompt',
      refinedPrompt: 'enhanced test prompt',
      negativePrompt: 'negative prompt',
      style: 'realistic',
      aspectRatio: '1:1',
      modelVersion: 'sd-1.5',
      userId: 'user-id',
      createdAt: new Date().toISOString(),
      processingTime: 1000
    };
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });
    
    // Mock localStorage
    const mockLocalStorage = {
      getItem: jest.fn().mockReturnValue('[]'),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
    
    render(<GenerationForm />);
    
    const promptInput = screen.getByLabelText(/describe your image/i);
    const submitButton = screen.getByRole('button', { name: /generate image/i });
    
    await user.type(promptInput, 'test prompt');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'pixilator_history',
        expect.stringContaining('test-id')
      );
    });
  });
});
