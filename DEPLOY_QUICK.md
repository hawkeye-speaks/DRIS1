# DRIS1 - Quick Deployment Guide

## Prerequisites
- Railway account (https://railway.app) - Free tier available
- Vercel account (https://vercel.com) - Free tier available
- Domain names: dris1.com and dris1.app (already purchased)
- API keys for: OpenRouter (DeepSeek, GPT-4, Claude) and XAI (Grok)

## Quick Start (30 minutes)

### 1. Prepare for Deployment
```bash
cd /Users/admin/CENTROPY-PROJECT/centropic-frontend
./deploy-prep.sh
```

### 2. Deploy Backend to Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Note the URL (e.g., dris1-backend.up.railway.app)
```

### 3. Set Environment Variables in Railway Dashboard
Go to your Railway project → Variables:
- `OPENROUTER_KEY_DEEPSEEK` = your-key
- `OPENROUTER_KEY_GPT4` = your-key
- `OPENROUTER_KEY_CLAUDE` = your-key
- `XAI_KEY` = your-key
- `PORT` = 3001
- `NODE_ENV` = production

### 4. Deploy Frontend to Vercel
```bash
# Update backend URL
echo "VITE_BACKEND_URL=https://your-railway-url.up.railway.app" > .env.production

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 5. Add Custom Domains in Vercel
1. Go to Vercel dashboard → Your project → Settings → Domains
2. Add `dris1.com`
3. Add `dris1.app`
4. Follow DNS instructions

### 6. Update DNS Records
At your domain registrar (where you bought dris1.com and dris1.app):

**For both domains:**
- Type: CNAME
- Name: @ (or leave blank)
- Value: cname.vercel-dns.com

**For www subdomain:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

DNS propagation takes 24-48 hours max (usually much faster).

## Testing

1. **Check backend**: `curl https://your-railway-url.up.railway.app/api/sessions`
2. **Check frontend**: Visit https://dris1.com
3. **Test query**: Submit a health optimization query

## Cost
- Railway: $5/month (Hobby plan)
- Vercel: Free (or $20/month for Pro)
- Total: **$5-25/month**

## Support
See DEPLOYMENT.md for detailed troubleshooting and architecture details.
