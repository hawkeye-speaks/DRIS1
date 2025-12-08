# DRIS1 Production Deployment Guide

## Overview
- **Frontend**: Vercel (dris1.com, dris1.app)
- **Backend**: Railway (Node.js + HM6 binary)
- **Database**: Railway storage volume for sessions

## Step 1: Deploy Backend to Railway

1. **Install Railway CLI**:
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Create new project**:
```bash
cd /Users/admin/CENTROPY-PROJECT/centropic-frontend
railway init
```

4. **Copy HM6 binary into project**:
```bash
mkdir -p bin
cp ../centropic-core/bin/hm6 ./bin/hm6
chmod +x ./bin/hm6
```

5. **Add storage path to backend**:
```bash
mkdir -p storage
cp -r ../centropic-core/storage/* ./storage/ 2>/dev/null || echo "No existing sessions"
```

6. **Set environment variables in Railway dashboard**:
   - `OPENROUTER_KEY_DEEPSEEK` - Your DeepSeek key
   - `OPENROUTER_KEY_GPT4` - Your GPT-4 key  
   - `OPENROUTER_KEY_CLAUDE` - Your Claude key
   - `XAI_KEY` - Your Grok key
   - `PORT` - 3001
   - `NODE_ENV` - production

7. **Deploy**:
```bash
railway up
```

8. **Note the Railway URL** (e.g., `dris1-backend.up.railway.app`)

## Step 2: Deploy Frontend to Vercel

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Update .env.production** with Railway backend URL:
```bash
echo "VITE_BACKEND_URL=https://your-railway-url.up.railway.app" > .env.production
```

3. **Deploy to Vercel**:
```bash
cd /Users/admin/CENTROPY-PROJECT/centropic-frontend
vercel --prod
```

4. **Add custom domains in Vercel dashboard**:
   - Go to Project Settings → Domains
   - Add `dris1.com`
   - Add `dris1.app`
   - Update DNS records as instructed by Vercel

## Step 3: Configure DNS

### For dris1.com and dris1.app:

Add these records at your domain registrar:

**A Record** (if using A record):
- Type: A
- Name: @
- Value: 76.76.21.21 (Vercel IP)

**CNAME Record** (recommended):
- Type: CNAME
- Name: @
- Value: cname.vercel-dns.com

**WWW subdomain**:
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com

## Step 4: Test Production

1. **Check backend health**:
```bash
curl https://your-railway-url.up.railway.app/api/sessions
```

2. **Test frontend**:
   - Visit https://dris1.com
   - Submit a test query
   - Verify WebSocket connection in browser DevTools

## Troubleshooting

### Backend Issues
- Check Railway logs: `railway logs`
- Verify HM6 binary permissions: `chmod +x bin/hm6`
- Check environment variables are set

### Frontend Issues
- Check VITE_BACKEND_URL is correct in Vercel
- Verify CORS is enabled in backend
- Check browser console for WebSocket errors

### WebSocket Issues
- Railway automatically supports WebSockets
- Ensure backend is listening on correct port
- Check firewall/security group settings

## Cost Estimate

**Railway**:
- Hobby plan: $5/month (includes 500 hours)
- HM6 queries: ~$0.05-0.50 per query (API costs)

**Vercel**:
- Hobby plan: Free (100GB bandwidth)
- Pro plan: $20/month if you need more

**Total**: ~$5-25/month to start

## Security Notes

- API keys stored in Railway environment variables (not in code)
- Frontend has no access to keys
- Backend validates all requests
- WebSocket connections scoped to session IDs
- No sensitive data in frontend bundle

## Next Steps After Deployment

1. Set up monitoring (Railway has built-in metrics)
2. Configure backup for storage directory
3. Add rate limiting for API endpoints
4. Set up error tracking (Sentry, etc.)
5. Create health check endpoint for uptime monitoring
