# 🎨 Pixilator - AI Image Generator

A full-stack AI-powered image generator built with Next.js, featuring advanced prompt refinement and multiple style presets.

## ✨ Features

- **AI-Powered Image Generation**: Uses Google Nano Banana (primary), Google Imagen, and Stable Diffusion for high-quality image generation
- **Prompt Enhancement**: Automatically refines user prompts using LLaMA-2/Mistral via Hugging Face
- **Style Presets**: Multiple artistic styles including Realistic, Cinematic, Artistic, and Vaporwave
- **User Authentication**: Secure login/registration with Supabase Auth
- **Generation History**: Save and view your previous generations
- **Local Caching**: Client-side caching for faster access to recent generations
- **Responsive Design**: Beautiful, modern UI that works on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with React, TypeScript, and Tailwind CSS
- **Backend**: Serverless functions with Next.js API routes
- **Database**: Supabase PostgreSQL for user data and generation history
- **AI Services**:
  - Google Nano Banana for advanced image generation (primary)
  - Google Imagen for high-quality image generation (fallback)
  - Stable Diffusion for reliable image generation (final fallback)
  - Hugging Face Inference API for prompt enhancement
- **Authentication**: Supabase Auth with Google OAuth
- **Deployment**: Vercel (free tier)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Nano Banana API key (primary)
- Google Imagen API key (fallback)
- Stable Diffusion API key (final fallback)
- Hugging Face API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/pixilator.git
cd pixilator
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service API Keys
STABLE_DIFFUSION_API_KEY=your_stable_diffusion_api_key
HUGGING_FACE_API_KEY=your_hugging_face_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

5. Set up Supabase database:

```sql
-- Create the generations table
CREATE TABLE generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  original_prompt TEXT NOT NULL,
  refined_prompt TEXT NOT NULL,
  negative_prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style VARCHAR(50) NOT NULL,
  aspect_ratio VARCHAR(10) NOT NULL,
  model_version VARCHAR(50) NOT NULL,
  processing_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can view their own generations" ON generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations" ON generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

6. Run the development server:

```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
pixilator/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # Serverless API routes
│   │   │   └── generate/   # Image generation endpoint
│   │   ├── globals.css     # Global styles
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Home page
│   ├── components/         # React components
│   │   ├── forms/          # Form components
│   │   └── ui/             # UI components
│   ├── lib/                # Utility functions
│   │   ├── config.ts       # App configuration
│   │   └── supabase.ts     # Supabase client
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
└── .cursor/               # Cursor AI rules
```

## 🔧 API Endpoints

### POST /api/generate

Generates an AI image based on the provided prompt and parameters.

**Request Body:**

```json
{
  "prompt": "A majestic mountain landscape at sunset",
  "style": "realistic",
  "aspectRatio": "16:9",
  "modelVersion": "sd-1.5"
}
```

**Response:**

```json
{
  "id": "uuid",
  "imageUrl": "data:image/png;base64,...",
  "originalPrompt": "A majestic mountain landscape at sunset",
  "refinedPrompt": "Enhanced prompt text",
  "negativePrompt": "cartoon, anime, low quality",
  "style": "realistic",
  "aspectRatio": "16:9",
  "modelVersion": "sd-1.5",
  "userId": "user-uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "processingTime": 5000
}
```

## 🎨 Style Presets

- **Realistic**: Photorealistic, high-quality images
- **Cinematic**: Movie-like dramatic scenes
- **Artistic**: Creative and artistic interpretations
- **Vaporwave**: Retro-futuristic aesthetic

## 📱 Features

### Core Functionality

- ✅ Prompt-based image generation
- ✅ Automatic prompt enhancement
- ✅ Style preset selection
- ✅ Aspect ratio customization
- ✅ Model version selection

### User Experience

- ✅ User authentication
- ✅ Generation history
- ✅ Local caching
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

### Performance

- ✅ Rate limiting
- ✅ Client-side caching
- ✅ Optimized images
- ✅ Fast loading times

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Stable Diffusion](https://stability.ai/) for image generation
- [Hugging Face](https://huggingface.co/) for prompt enhancement
- [Supabase](https://supabase.com/) for backend services
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

Made with ❤️ by the Pixilator team
