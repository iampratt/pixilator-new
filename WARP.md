# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Pixilator is a full-stack AI image generator built with Next.js 14, featuring advanced prompt refinement and multiple style presets. The app uses a serverless architecture with Supabase for backend services and integrates multiple AI services for image generation.

## Development Commands

### Core Development
```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start
```

### Code Quality & Testing
```bash
# Run linter
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Server Management
- Always kill existing servers before starting new ones to prevent port conflicts
- Use `npm run dev` for development with hot reload enabled
- After making significant changes, restart the server for proper testing

## Architecture & Core Components

### Tech Stack
- **Frontend**: Next.js 14 with React 19, TypeScript, Tailwind CSS
- **Backend**: Serverless functions via Next.js API routes
- **Database**: Supabase PostgreSQL with Row Level Security
- **AI Services**: Hugging Face Inference API (primary), Stable Diffusion (fallback)
- **State Management**: Zustand for client-side state
- **Authentication**: Supabase Auth with Google OAuth
- **Testing**: Jest with React Testing Library

### Project Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/               # Serverless API routes
│   │   └── generate/      # Main image generation endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── forms/            # Form components
│   └── ui/               # UI components
├── lib/                   # Utility functions
│   ├── config.ts         # App configuration
│   └── supabase.ts       # Supabase client
└── types/                 # TypeScript type definitions
```

### Core Workflow Architecture
1. **User Input** → Frontend form with prompt + style options
2. **Prompt Enhancement** → LLM call via Hugging Face to expand/improve user prompt
3. **Negative Prompt Generation** → AI-generated negative prompts based on style
4. **Image Generation** → Hugging Face Inference API call (fallback: Stable Diffusion)
5. **Storage & Database** → Save image URL and metadata to Supabase
6. **History & Caching** → User history with client-side caching via Zustand

### Key API Endpoint
- **POST `/api/generate`**: Main image generation endpoint with rate limiting (10 requests/hour)
  - Handles prompt enhancement, negative prompt generation, and image creation
  - Supports authenticated and anonymous users
  - Returns base64-encoded images with metadata

## Development Guidelines

### Code Standards
- **File Size Limit**: Keep files under 200-300 lines - refactor when approaching this limit
- **Single Responsibility**: Each file should have one clear purpose
- **Existing Patterns**: Prefer existing patterns over introducing new ones
- **Environment Awareness**: Consider dev, test, and prod differences
- **No Mocking**: Only mock data in tests, never in dev/prod

### Testing Strategy
- **Unit Tests**: Focus on prompt refinement logic, API validation, and database operations
- **Integration Tests**: Test API endpoints and database interactions
- **Critical Functions**: Always test image generation workflow components

### Error Handling
- **Server-side**: Catch specific API errors (rate limits, invalid prompts, AI service timeouts)
- **Client-side**: Display user-friendly error messages
- **Fallback Mechanisms**: Graceful degradation when AI services are unavailable

### AI Services Integration
- **Primary**: Hugging Face Inference API with model `tencent/HunyuanImage-3.0`
- **Prompt Enhancement**: Uses DialoGPT-medium for prompt refinement
- **Rate Limiting**: 10 requests/hour per IP (free tier consideration)
- **Aspect Ratios**: Supports 1:1, 16:9, 9:16, 4:3, 3:4
- **Styles**: Realistic, Cinematic, Artistic, Vaporwave

### Database Schema
- **generations table**: Stores all image generation data with user association
- **Row Level Security**: Users can only access their own generations
- **Fields**: original_prompt, refined_prompt, negative_prompt, image_url, style, aspect_ratio, model_version, processing_time

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STABLE_DIFFUSION_API_KEY`
- `HUGGING_FACE_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## Development Workflow

### Before Starting Work
1. Check existing code patterns before implementing new features
2. Review similar functionality to avoid code duplication
3. Ensure proper environment variables are set

### During Development
1. Use TypeScript strict mode - maintain type safety
2. Follow existing file organization patterns
3. Test locally before committing changes
4. Handle errors gracefully with user-friendly messages

### Testing & Quality Assurance
1. Run `npm run lint` before committing
2. Ensure TypeScript compilation passes
3. Run relevant tests with `npm test`
4. Verify the development server starts without errors

### Deployment Considerations
- Designed for Vercel deployment with serverless functions
- Built-in CDN for static assets and generated images
- Free-tier optimized with rate limiting and caching strategies
- Uses Turbopack for faster builds and development
