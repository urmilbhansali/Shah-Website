# Railway Deployment Guide

Railway is one of the easiest platforms to deploy your Node.js app. This guide will walk you through it.

## 🎯 What You'll Get

- **Domain**: `your-app-name.railway.app` (or custom domain)
- **HTTPS**: Automatic SSL certificate
- **Auto-deploy**: Deploys when you push to GitHub
- **Environment variables**: Easy .env management

---

## 📋 Prerequisites

- GitHub account
- Railway account (free signup)
- Your code pushed to GitHub

---

## 🚀 Step-by-Step Deployment

### Step 1: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/shah-website.git
git branch -M main
git push -u origin main
```

### Step 2: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with GitHub (easiest option)
4. Authorize Railway to access your GitHub

### Step 3: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository (`shah-website` or whatever you named it)
4. Railway will detect it's a Node.js app

### Step 4: Configure Environment Variables

1. Click on your project
2. Go to **"Variables"** tab
3. Add all your environment variables:

```
GOOGLE_CLIENT_ID=your_google_client_id
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Shah Distributors Worldwide <your_email@gmail.com>
PORT=3000
```

**Note**: Railway will automatically set `PORT`, but you can override it.

### Step 5: Get Your Domain

1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Click **"Generate Domain"**
4. Copy your domain (e.g., `shah-distributors-production.up.railway.app`)

### Step 6: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Add your Railway domain to **"Authorized JavaScript origins"**:
   ```
   https://shah-distributors-production.up.railway.app
   ```
4. Add to **"Authorized redirect URIs"**:
   ```
   https://shah-distributors-production.up.railway.app
   ```

### Step 7: Update Frontend API URLs

You'll need to replace `localhost:3000` with your Railway domain. I can help you create a script to do this automatically, or you can do it manually.

### Step 8: Deploy!

Railway will automatically:
1. Detect your Node.js app
2. Install dependencies (`npm install`)
3. Run `npm start`
4. Deploy your app

You can watch the deployment logs in real-time!

---

## 🔧 Configuration

### Build Settings (Usually Auto-detected)

Railway should auto-detect:
- **Build Command**: `npm install`
- **Start Command**: `npm start`

If not, you can set them manually in **Settings** > **Build & Deploy**.

### Health Check

Railway will automatically check if your app is running on the configured PORT.

---

## 📝 Important Files

Make sure these are in your repository:
- ✅ `package.json` (with `start` script)
- ✅ `server.js` (your main server file)
- ✅ `.gitignore` (should include `.env`, `node_modules`)

**Don't commit**:
- ❌ `.env` file (use Railway's Variables instead)
- ❌ `node_modules/`
- ❌ `*.log` files

---

## 🔄 Auto-Deploy

Railway automatically deploys when you:
- Push to your main branch
- Merge a pull request

You can disable this in **Settings** > **Deploy**.

---

## 💰 Pricing

**Free Tier**:
- 500 hours/month
- $5 credit/month
- Perfect for testing

**After Free Tier**:
- ~$5-10/month depending on usage
- Pay only for what you use

---

## 🐛 Troubleshooting

### App Not Starting

1. Check **Logs** tab for errors
2. Verify environment variables are set
3. Check that `PORT` is set (Railway sets this automatically)

### Build Fails

1. Check that `package.json` has correct `start` script
2. Verify all dependencies are in `package.json`
3. Check build logs for specific errors

### Domain Not Working

1. Wait a few minutes for DNS propagation
2. Check that HTTPS is enabled (should be automatic)
3. Verify domain in Railway settings

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project created and connected to GitHub
- [ ] Environment variables configured
- [ ] Domain generated
- [ ] Google OAuth updated with Railway domain
- [ ] Frontend API URLs updated
- [ ] App deployed successfully
- [ ] Tested on production domain

---

## 🎉 You're Live!

Once deployed, your site will be available at:
`https://your-app-name.railway.app`

**Next Steps**:
1. Test Google OAuth
2. Test Stripe payments (use test mode first!)
3. Test all functionality
4. Add custom domain (optional)

---

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway) (for support)

---

**Need help?** I can assist with any step! 🚀

