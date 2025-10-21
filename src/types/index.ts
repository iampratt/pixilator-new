// Core types for the Pixilator application

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface GenerationRequest {
  prompt: string;
  style?: string;
  aspectRatio?: string;
  modelVersion?: string;
  negativePrompt?: string;
}

export interface GenerationResponse {
  id: string;
  imageUrl: string;
  originalPrompt: string;
  refinedPrompt: string;
  negativePrompt: string;
  style: string;
  aspectRatio: string;
  modelVersion: string;
  userId: string;
  createdAt: string;
  processingTime?: number;
}

export interface GenerationHistory {
  id: string;
  imageUrl: string;
  originalPrompt: string;
  refinedPrompt: string;
  negativePrompt: string;
  style: string;
  aspectRatio: string;
  modelVersion: string;
  createdAt: string;
  processingTime?: number;
}

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  negativePrompt: string;
}

export interface AspectRatio {
  id: string;
  name: string;
  value: string;
  width: number;
  height: number;
}

export interface ModelVersion {
  id: string;
  name: string;
  description: string;
  endpoint: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: unknown;
}

export interface GenerationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  result?: GenerationResponse;
  error?: string;
}
