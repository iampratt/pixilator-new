# 🚀 Deployment Guide

This guide covers deploying the Pixilator application to production using Vercel and GitHub Actions.

## Prerequisites

- GitHub repository with your code
- Vercel account
- Supabase project set up
- AI service API keys

## 1. Vercel Deployment

### Option 1: Deploy via Vercel Dashboard

1. **Connect Repository**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository and click "Import"

2. **Configure Environment Variables**

   - In your Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     STABLE_DIFFUSION_API_KEY=your_stability_ai_key
     HUGGING_FACE_API_KEY=your_hugging_face_token
     NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
     NODE_ENV=production
     ```

3. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

## 2. GitHub Actions CI/CD Setup

### 1. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions, and add:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STABLE_DIFFUSION_API_KEY=your_stability_ai_key
HUGGING_FACE_API_KEY=your_hugging_face_token
```

### 2. Get Vercel Credentials

1. **Vercel Token**

   - Go to Vercel Dashboard → Settings → Tokens
   - Create a new token with appropriate permissions

2. **Organization ID**

   - Go to your Vercel team settings
   - Copy the Organization ID from the URL

3. **Project ID**
   - Go to your project settings in Vercel
   - Copy the Project ID from the URL

### 3. Enable GitHub Actions

The workflow files are already configured in `.github/workflows/`:

- `ci.yml` - Runs tests and builds on every push/PR
- `deploy-preview.yml` - Deploys preview environments for PRs
- `ci.yml` - Deploys to production on main branch

## 3. Database Setup

### 1. Run Database Migrations

Execute the SQL commands from `supabase-setup.sql` in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-setup.sql
```

### 2. Configure Authentication

1. Go to Supabase Dashboard → Authentication → Settings
2. Add your production domain to "Site URL"
3. Add your domain to "Redirect URLs"

## 4. Domain Configuration

### 1. Custom Domain (Optional)

1. In Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` environment variable

### 2. Update Supabase Settings

1. Add your production domain to Supabase Auth settings
2. Update redirect URLs to include your production domain

## 5. Monitoring and Analytics

### 1. Vercel Analytics

Enable Vercel Analytics in your project dashboard for performance monitoring.

### 2. Error Tracking

Consider adding error tracking services like:

- Sentry
- LogRocket
- Bugsnag

### 3. Performance Monitoring

Monitor your application with:

- Vercel Speed Insights
- Google PageSpeed Insights
- Lighthouse CI

## 6. Production Checklist

Before going live, ensure:

- [ ] All environment variables are set
- [ ] Database is properly configured
- [ ] Authentication is working
- [ ] API keys are valid and have sufficient quotas
- [ ] Error handling is robust
- [ ] Rate limiting is configured
- [ ] Monitoring is set up
- [ ] Backup strategy is in place

## 7. Scaling Considerations

### Performance Optimization

- Enable Vercel Edge Functions for better performance
- Use CDN for static assets
- Implement proper caching strategies
- Optimize images and assets

### Cost Management

- Monitor API usage and costs
- Set up billing alerts
- Consider upgrading to paid plans for production
- Implement proper rate limiting

### Security

- Use HTTPS everywhere
- Implement proper CORS policies
- Validate all user inputs
- Keep dependencies updated
- Use environment variables for secrets

## 8. Troubleshooting

### Common Issues

1. **Build Failures**

   - Check environment variables
   - Verify API keys are valid
   - Check build logs in Vercel dashboard

2. **Authentication Issues**

   - Verify Supabase configuration
   - Check redirect URLs
   - Ensure domain is whitelisted

3. **API Errors**
   - Check API key quotas
   - Verify API endpoints
   - Check rate limiting

### Getting Help

- Check Vercel documentation
- Review Supabase guides
- Check GitHub Actions logs
- Review application logs

## 9. Maintenance

### Regular Tasks

- Update dependencies monthly
- Monitor API usage and costs
- Review and rotate API keys
- Backup database regularly
- Monitor application performance

### Updates

- Test updates in staging environment first
- Use feature flags for gradual rollouts
- Monitor error rates after deployments
- Have rollback plan ready

---

**Note**: Always test your deployment in a staging environment before deploying to production.
