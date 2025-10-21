# 🔑 API Keys Setup Guide

This guide will help you obtain the necessary API keys for the Pixilator application.

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Choose your organization and enter project details:
   - **Name**: `pixilator`
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users

### Get Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Project API Key** (anon public key)

### Set up Database

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase-setup.sql`
3. Click **Run** to create the database schema

### Configure Authentication

1. Go to **Authentication** → **Settings**
2. Enable **Google** provider:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domain to authorized origins
3. Copy the **Client ID** and **Client Secret** to Supabase

## 2. Google Nano Banana API Setup (Primary)

### Getting Access to Nano Banana

1. Visit [https://banananano.ai](https://banananano.ai)
2. Sign up for early access or join the waitlist
3. Once approved, you'll receive API credentials
4. **Note**: Currently in testing phase, limited availability

### API Key Configuration

1. Once you have access, obtain your API key from the dashboard
2. Set up your project in the Nano Banana console
3. Configure usage limits and billing if applicable

## 3. Google Imagen API Setup (Fallback)

### Option 1: Vertex AI (Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the **Vertex AI API**
4. Go to **IAM & Admin** → **Service Accounts**
5. Create a service account with **Vertex AI User** role
6. Generate a JSON key file
7. **Free Tier**: Limited free usage per month

### Option 2: AI Platform (Alternative)

1. Enable **AI Platform API** in Google Cloud Console
2. Create credentials following the same process as Vertex AI

## 4. Stable Diffusion API Setup (Final Fallback)

### Option 1: Stability AI (Recommended)

1. Go to [https://platform.stability.ai](https://platform.stability.ai)
2. Sign up for a free account
3. Go to **API Keys** section
4. Create a new API key
5. **Free Tier**: 25 free credits per month

### Option 2: Replicate (Alternative)

1. Go to [https://replicate.com](https://replicate.com)
2. Sign up for a free account
3. Go to **Account** → **API Tokens**
4. Create a new token
5. **Free Tier**: $5 free credits

## 5. Hugging Face API Setup

### Create Hugging Face Account

1. Go to [https://huggingface.co](https://huggingface.co)
2. Sign up for a free account
3. Go to **Settings** → **Access Tokens**
4. Create a new token with **Read** permissions
5. **Free Tier**: 1000 requests per month

## 6. Environment Variables Setup

Create a `.env.local` file in your project root with the following values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Service API Keys (Primary: Nano Banana)
NANO_BANANA_API_KEY=your_nano_banana_api_key
NANO_BANANA_API_URL=https://api.nanobanana.ai

# Google Imagen API (Fallback)
GOOGLE_IMAGEN_API_KEY=your_google_imagen_api_key
GOOGLE_CLOUD_PROJECT_ID=your_google_cloud_project_id
GOOGLE_IMAGEN_API_URL=https://us-central1-aiplatform.googleapis.com

# Stable Diffusion API (Final Fallback)
STABLE_DIFFUSION_API_KEY=your_stability_ai_key
STABLE_DIFFUSION_API_URL=https://api.stability.ai

# Hugging Face for prompt enhancement
HUGGING_FACE_API_KEY=your_hugging_face_token

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 5. Testing Your Setup

### Test Supabase Connection

1. Start your development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Try to sign in with Google
4. Check the Supabase dashboard to see if users are being created

### Test AI Services

1. Try generating an image with a simple prompt
2. Check the browser console for any API errors
3. Verify that images are being saved to the database

## 6. Cost Optimization Tips

### Free Tier Limits

- **Stability AI**: 25 free credits/month
- **Hugging Face**: 1000 requests/month
- **Supabase**: 500MB database, 2GB bandwidth/month

### Optimization Strategies

1. **Implement caching** to reduce API calls
2. **Use rate limiting** to prevent abuse
3. **Optimize prompts** to reduce generation time
4. **Monitor usage** through dashboard analytics

## 7. Troubleshooting

### Common Issues

1. **API Key Invalid**: Double-check the key format and permissions
2. **Rate Limit Exceeded**: Wait for the limit to reset or upgrade plan
3. **Database Connection Failed**: Verify Supabase URL and key
4. **Authentication Not Working**: Check Google OAuth configuration

### Debug Steps

1. Check browser console for errors
2. Check server logs in terminal
3. Verify environment variables are loaded
4. Test API endpoints individually

## 8. Production Considerations

### Security

- Never commit API keys to version control
- Use environment variables for all secrets
- Implement proper rate limiting
- Validate all user inputs

### Scaling

- Monitor API usage and costs
- Consider upgrading to paid plans for production
- Implement proper error handling and fallbacks
- Set up monitoring and alerting

---

**Note**: Always keep your API keys secure and never share them publicly. Use environment variables and never commit them to version control.
