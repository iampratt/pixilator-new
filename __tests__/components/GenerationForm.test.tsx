/**
 * @jest-environment jsdom
 */

import { render, screen, waitFor } from '@testing-library/react';
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
    
    expect(screen.getByRole('option', { name: 'Realistic' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Square (1:1)' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'HunyuanImage 3.0' })).toBeInTheDocument();
  });

  test('validates required prompt field', async () => {
    const user = userEvent.setup();
    render(<GenerationForm />);
    
    const submitButton = screen.getByRole('button', { name: /generate image/i });
    await user.click(submitButton);
    
    // The button should be disabled when no prompt is entered
    expect(submitButton).toBeDisabled();
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
    await user.selectOptions(modelSelect, 'black-forest-labs/FLUX.1-dev');
    
    expect(styleSelect).toHaveValue('cinematic');
    expect(aspectRatioSelect).toHaveValue('16:9');
    expect(modelSelect).toHaveValue('black-forest-labs/FLUX.1-dev');
  });

  test('displays generated image on successful generation', async () => {
    const user = userEvent.setup();
    const mockResponse = {
      id: 'test-id',
      imageUrl: 'data:image/png;base64,test',
      originalPrompt: 'test prompt',
      refinedPrompt: 'enhanced test prompt',
      negativePrompt: 'negative prompt',
      style: 'realistic',
      aspectRatio: '1:1',
      modelVersion: 'tencent/HunyuanImage-3.0',
      userId: 'public',
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
      expect(screen.getByText('enhanced test prompt')).toBeInTheDocument();
    });
  });
});
