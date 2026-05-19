# Deployment Guide - WhatsApp Manager

Complete guide for deploying the WhatsApp Manager to production.

## 📋 Pre-Deployment Checklist

### Backend Requirements
- [ ] Backend API is deployed and accessible
- [ ] All required endpoints are implemented:
  - `POST /messages/send`
  - `GET /messages`
  - `GET /stats`
  - `POST /webhook`
- [ ] WhatsApp Business Account is verified
- [ ] Phone number is registered with WhatsApp
- [ ] Webhook is configured in Meta dashboard
- [ ] Database is set up and accessible

### Frontend Requirements
- [ ] All environment variables are configured
- [ ] Supabase project is created
- [ ] Authentication is tested
- [ ] Build succeeds locally (`npm run build`)
- [ ] All features tested in development

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
cd whatsapp
vercel
```

#### Step 4: Configure Environment Variables
In Vercel dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add:
   ```
   NEXT_PUBLIC_API_BASE=https://api.unifesto.app
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

#### Step 5: Redeploy
```bash
vercel --prod
```

---

### Option 2: Docker

Deploy using Docker containers.

#### Create Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Create docker-compose.yml
```yaml
version: '3.8'

services:
  whatsapp-manager:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE=https://api.unifesto.app
      - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    restart: unless-stopped
```

#### Build and Run
```bash
docker-compose up -d
```

---

### Option 3: Traditional Server (PM2)

Deploy on a traditional server using PM2.

#### Step 1: Install Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Step 2: Install PM2
```bash
npm install -g pm2
```

#### Step 3: Build Application
```bash
cd whatsapp
npm install
npm run build
```

#### Step 4: Create ecosystem.config.js
```javascript
module.exports = {
  apps: [{
    name: 'whatsapp-manager',
    script: 'npm',
    args: 'start',
    cwd: '/path/to/whatsapp',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_API_BASE: 'https://api.unifesto.app',
      NEXT_PUBLIC_SUPABASE_URL: 'your_supabase_url',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your_supabase_anon_key'
    }
  }]
};
```

#### Step 5: Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

### Option 4: AWS (Amplify)

Deploy using AWS Amplify.

#### Step 1: Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
```

#### Step 2: Initialize Amplify
```bash
amplify init
```

#### Step 3: Add Hosting
```bash
amplify add hosting
```

#### Step 4: Configure Build Settings
Create `amplify.yml`:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

#### Step 5: Deploy
```bash
amplify publish
```

---

## 🔐 Environment Variables

### Production Environment Variables

Create `.env.production`:
```env
# Backend API
NEXT_PUBLIC_API_BASE=https://api.unifesto.app

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

### Security Notes
- Never commit `.env.production` to version control
- Use different Supabase projects for dev/prod
- Rotate keys regularly
- Use environment-specific API endpoints

---

## 🌐 Domain Configuration

### Custom Domain Setup

#### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: whatsapp (or @)
   Value: cname.vercel-dns.com
   ```

#### Cloudflare
1. Add A record pointing to your server IP
2. Enable SSL/TLS (Full mode)
3. Configure caching rules

---

## 🔒 SSL/HTTPS

### Let's Encrypt (Nginx)

#### Install Certbot
```bash
sudo apt-get install certbot python3-certbot-nginx
```

#### Obtain Certificate
```bash
sudo certbot --nginx -d whatsapp.unifesto.app
```

#### Auto-Renewal
```bash
sudo certbot renew --dry-run
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name whatsapp.unifesto.app;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name whatsapp.unifesto.app;

    ssl_certificate /etc/letsencrypt/live/whatsapp.unifesto.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/whatsapp.unifesto.app/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Monitoring

### Vercel Analytics
Enable in Vercel dashboard:
1. Go to Analytics tab
2. Enable Web Analytics
3. View real-time metrics

### Custom Monitoring

#### Install Sentry
```bash
npm install @sentry/nextjs
```

#### Configure Sentry
Create `sentry.client.config.js`:
```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        working-directory: ./whatsapp
        
      - name: Build
        run: npm run build
        working-directory: ./whatsapp
        env:
          NEXT_PUBLIC_API_BASE: ${{ secrets.API_BASE }}
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./whatsapp
```

---

## 🧪 Testing Before Deployment

### 1. Build Test
```bash
npm run build
```

### 2. Production Test
```bash
npm start
```

### 3. Lighthouse Audit
```bash
npm install -g lighthouse
lighthouse http://localhost:3000 --view
```

### 4. Load Testing
```bash
npm install -g artillery
artillery quick --count 10 --num 100 http://localhost:3000
```

---

## 📈 Performance Optimization

### 1. Enable Compression
In `next.config.ts`:
```typescript
const nextConfig = {
  compress: true,
  // ... other config
};
```

### 2. Image Optimization
Already configured with Next.js Image component.

### 3. Code Splitting
Automatic with Next.js App Router.

### 4. Caching Headers
Configure in Vercel or Nginx.

---

## 🔧 Post-Deployment

### 1. Verify Deployment
- [ ] Visit production URL
- [ ] Test login
- [ ] Send test message
- [ ] Check inbox
- [ ] View logs
- [ ] Check settings

### 2. Monitor Logs
```bash
# Vercel
vercel logs

# PM2
pm2 logs whatsapp-manager

# Docker
docker logs whatsapp-manager
```

### 3. Set Up Alerts
Configure alerts for:
- Server downtime
- High error rates
- Slow response times
- Failed deployments

---

## 🚨 Rollback Plan

### Vercel
```bash
vercel rollback
```

### PM2
```bash
pm2 stop whatsapp-manager
# Deploy previous version
pm2 start whatsapp-manager
```

### Docker
```bash
docker-compose down
# Switch to previous image
docker-compose up -d
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Environment variables configured
- [ ] Backend API accessible
- [ ] Supabase configured
- [ ] Domain configured
- [ ] SSL certificate obtained

### Deployment
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Test all features
- [ ] Check error logs
- [ ] Monitor performance

### Post-Deployment
- [ ] Update DNS if needed
- [ ] Configure monitoring
- [ ] Set up alerts
- [ ] Document deployment
- [ ] Notify team

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working
- Check variable names (must start with `NEXT_PUBLIC_`)
- Verify values are correct
- Restart server after changes

### 404 Errors
- Check routing configuration
- Verify middleware is working
- Check Vercel/server logs

### API Calls Failing
- Verify `NEXT_PUBLIC_API_BASE` is correct
- Check CORS configuration on backend
- Verify backend is accessible

---

## 📞 Support

For deployment issues:
1. Check deployment logs
2. Review error messages
3. Verify environment variables
4. Test backend connectivity
5. Check DNS configuration

---

## 🎉 Success!

Your WhatsApp Manager is now deployed and ready to use!

**Next Steps:**
1. Share URL with team
2. Create user accounts in Supabase
3. Test with real WhatsApp numbers
4. Monitor usage and performance
5. Gather feedback for improvements
