# Deployment Guide - AI Math Tutor

This guide covers deploying the AI Math Tutor to Vercel with secure API key handling.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Deploying to Vercel](#deploying-to-vercel)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Cost Estimates](#cost-estimates)

---

## Architecture Overview

The application uses a **secure backend proxy architecture** to protect API keys:

```
┌─────────────────┐
│  Browser Client │
│   (React SPA)   │
└────────┬────────┘
         │ fetch('/api/chat')
         │ fetch('/api/parse-image')
         ↓
┌─────────────────────────┐
│ Vercel Serverless Fns   │
│  - api/chat.js          │
│  - api/parse-image.js   │
└────────┬────────────────┘
         │ OpenAI API calls
         │ (API key server-side)
         ↓
┌─────────────────┐
│  OpenAI API     │
│  - GPT-4o-mini  │
│  - Vision API   │
└─────────────────┘
```

**Key Security Features:**
- ✅ API keys stored as server-side environment variables only
- ✅ No `VITE_` prefix (prevents client-side exposure)
- ✅ CORS headers configured for API routes
- ✅ Rate limiting at backend level (future enhancement)

---

## Prerequisites

### Required

1. **Node.js 18+** and npm installed
2. **OpenAI API key** ([Get one here](https://platform.openai.com/api-keys))
3. **Vercel account** ([Sign up free](https://vercel.com/signup))
4. **Vercel CLI** installed globally:
   ```bash
   npm install -g vercel
   ```

### Optional

- Git installed for version control
- GitHub account for GitHub → Vercel auto-deploy

---

## Local Development

### Option 1: Vercel Dev (Recommended)

Test the full production environment locally, including serverless functions:

```bash
cd math-tutor
vercel dev
```

**Access at:** http://localhost:3000

**Benefits:**
- Tests API routes locally
- Matches production environment exactly
- Uses `.env` file automatically

### Option 2: Vite Dev Server (Legacy)

Use standard Vite dev server (requires modifying code to use client-side API):

```bash
npm run dev
```

**Access at:** http://localhost:5173

**Note:** This bypasses the serverless functions. Not recommended for production testing.

---

## Deploying to Vercel

### Method 1: CLI Deployment (Quick)

1. **Navigate to project directory:**
   ```bash
   cd math-tutor
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy to production:**
   ```bash
   vercel --prod --yes
   ```

4. **Copy the deployment URL** from terminal output

### Method 2: GitHub Integration (Auto-Deploy)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy math tutor"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure project:**
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Root Directory:** `math-tutor`

4. **Deploy!**
   - Vercel will auto-deploy on every push to main

---

## Environment Variables

### Required Variables

Add these in the Vercel dashboard:

#### 1. `OPENAI_API_KEY` (Required)

- **Value:** Your OpenAI API key (starts with `sk-proj-...`)
- **Where to get:** https://platform.openai.com/api-keys
- **Environments:** Production, Preview, Development (select all)

**⚠️ Important:** Do NOT use `VITE_` prefix. This keeps the key server-side only.

#### 2. `OPENAI_MODEL` (Optional)

- **Value:** `gpt-4o-mini`
- **Default:** `gpt-4o-mini` (if not set)
- **Environments:** Production, Preview, Development

#### 3. `OPENAI_VISION_MODEL` (Optional)

- **Value:** `gpt-4o-mini`
- **Default:** `gpt-4o-mini` (if not set)
- **Environments:** Production, Preview, Development

### How to Add Environment Variables

**Via Vercel Dashboard:**

1. Go to your project at vercel.com
2. Click "Settings" → "Environment Variables"
3. Click "Add New"
4. Enter:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Your actual API key
   - **Environments:** Check all three boxes
5. Click "Save"
6. Repeat for other variables

**Via CLI:**

```bash
vercel env add OPENAI_API_KEY production
# Paste your API key when prompted

vercel env add OPENAI_MODEL production
# Enter: gpt-4o-mini

vercel env add OPENAI_VISION_MODEL production
# Enter: gpt-4o-mini
```

### Redeploy After Adding Variables

Environment variable changes require a redeploy:

```bash
vercel --prod
```

---

## Troubleshooting

### Issue: "API key not defined" error

**Symptom:** Deployment succeeds but app shows API errors

**Solution:**
1. Verify environment variables are added in Vercel dashboard
2. Check variable names are EXACTLY: `OPENAI_API_KEY` (no `VITE_` prefix)
3. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```

### Issue: CORS errors in console

**Symptom:** "Access to fetch at ... has been blocked by CORS policy"

**Solution:**
- Verify `vercel.json` includes CORS headers (should be present)
- Check API routes return proper CORS headers
- Clear browser cache and retry

### Issue: API functions not found (404)

**Symptom:** `/api/chat` returns 404 Not Found

**Solution:**
1. Verify `api/` folder exists in project root
2. Check `vercel.json` includes functions configuration
3. Ensure files are named `chat.js` and `parse-image.js` (not `.ts`)
4. Redeploy:
   ```bash
   vercel --prod
   ```

### Issue: Slow cold starts

**Symptom:** First request takes 5-10 seconds

**Explanation:**
- Vercel serverless functions have "cold starts" when inactive
- First request wakes up the function
- Subsequent requests are fast

**Solutions:**
- Accept cold starts as normal serverless behavior
- Consider Vercel Pro for reduced cold starts
- Implement function warming (future enhancement)

### Issue: High OpenAI costs

**Symptom:** Unexpected API charges

**Solutions:**
1. **Set usage limits** in OpenAI dashboard:
   - Go to https://platform.openai.com/account/limits
   - Set monthly budget cap
2. **Monitor usage:**
   - Check OpenAI usage dashboard regularly
3. **Implement rate limiting** (future enhancement):
   - Add request limits per user/session
   - Track API call counts

---

## Cost Estimates

### Vercel Costs

**Free Tier includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function executions

**Likely costs:** $0/month for hobby projects

### OpenAI Costs

**GPT-4o-mini pricing** (as of 2025):
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

**Estimated per conversation:**
- Chat (5-10 exchanges): $0.002-0.005
- Image parsing: $0.001-0.002
- **Total per conversation:** ~$0.003-0.007

**Monthly estimates:**
- 100 conversations: ~$0.50
- 1,000 conversations: ~$5.00
- 10,000 conversations: ~$50.00

**To control costs:**
- Set OpenAI monthly limits
- Monitor usage dashboard
- Implement per-user rate limiting (future)

---

## Production Checklist

Before going live, ensure:

- [ ] Environment variables added in Vercel
- [ ] OpenAI API key has usage limits set
- [ ] `.env` file NOT committed to repo (check `.gitignore`)
- [ ] Deployment succeeded without errors
- [ ] Test chat functionality on production URL
- [ ] Test image upload on production URL
- [ ] Math rendering displays correctly
- [ ] API errors handled gracefully
- [ ] Mobile responsive design works
- [ ] Monitor OpenAI usage for first week

---

## Additional Resources

- **Vercel Docs:** https://vercel.com/docs
- **OpenAI API Docs:** https://platform.openai.com/docs
- **Project README:** [../math-tutor/README.md](../math-tutor/README.md)
- **Prompt Engineering:** [PROMPTS.md](PROMPTS.md)
- **Testing Results:** [TESTING-PR-009.md](TESTING-PR-009.md)

---

## Support

For deployment issues:
1. Check Vercel deployment logs: `vercel logs`
2. Review browser console for errors
3. Verify environment variables are set correctly
4. Contact: john.chen@superbuilders.school

**Last Updated:** PR-011 (2025-11-03)
