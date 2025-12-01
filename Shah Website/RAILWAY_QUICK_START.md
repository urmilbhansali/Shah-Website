# Railway Quick Start Guide

## 🚀 Step-by-Step: Deploy from GitHub

### Step 1: Push Your Code to GitHub (If Not Already)

**Check if you have a GitHub repo**:
```bash
git status
```

**If you don't have a GitHub repo yet**:

1. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it: `shah-website` (or whatever you prefer)
   - Make it **Private** (recommended) or Public
   - Don't initialize with README (you already have files)

2. Push your code:
```bash
# If not already a git repo
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - ready for Railway deployment"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/shah-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If you already have a GitHub repo**:
```bash
# Just make sure everything is pushed
git add .
git commit -m "Ready for Railway deployment"
git push
```

---

### Step 2: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"** or **"Login"**
3. Choose **"Login with GitHub"** (easiest option)
4. Authorize Railway to access your GitHub account

---

### Step 3: Create New Project from GitHub

1. In Railway dashboard, click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. You'll see a list of your GitHub repositories
4. **Select your repository** (`shah-website` or whatever you named it)
5. Railway will automatically:
   - Detect it's a Node.js app
   - Start deploying

---

### Step 4: Wait for Initial Deploy

Railway will:
- ✅ Install dependencies (`npm install`)
- ✅ Build your app
- ✅ Start your server (`npm start`)

**Watch the logs** - you'll see the deployment progress in real-time!

**First deploy might fail** (that's okay - we need to set environment variables first)

---

### Step 5: Configure Environment Variables

1. Click on your project in Railway
2. Click on the **service** (your app)
3. Go to **"Variables"** tab
4. Click **"+ New Variable"**

**Add these variables** (one by one):

```
GOOGLE_CLIENT_ID=your_google_client_id_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=Shah Distributors Worldwide <your_email@gmail.com>
```

**Note**: 
- `PORT` is automatically set by Railway (don't add it manually)
- Start with **test** Stripe keys (you can switch to live later)
- For Google OAuth, you'll need to add your Railway domain later

---

### Step 6: Get Your Railway Domain

1. In your Railway project, go to **"Settings"** tab
2. Scroll to **"Domains"** section
3. Click **"Generate Domain"**
4. Copy your domain (e.g., `shah-distributors-production.up.railway.app`)

**This is your production URL!** 🎉

---

### Step 7: Redeploy

After adding environment variables:
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** (or push a new commit to GitHub)
3. Wait for deployment to complete

---

### Step 8: Test Your Site

1. Visit your Railway domain: `https://your-app.railway.app`
2. Test that the site loads
3. Check that API endpoints work

**Note**: Some features might not work yet (Google OAuth, Stripe) until you configure them with your Railway domain.

---

## ✅ Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project created from GitHub repo
- [ ] Environment variables added
- [ ] Domain generated
- [ ] App deployed successfully
- [ ] Site accessible at Railway domain

---

## 🐛 Common Issues

### Build Fails

**Error**: "Cannot find module"
- **Fix**: Make sure `package.json` has all dependencies listed

**Error**: "npm start failed"
- **Fix**: Check that `package.json` has `"start": "node server.js"`

### App Crashes

**Error**: "Port already in use"
- **Fix**: Railway sets PORT automatically - don't hardcode it

**Error**: "Environment variable not found"
- **Fix**: Make sure all variables are added in Railway Variables tab

### Domain Not Working

- **Wait**: DNS can take a few minutes
- **Check**: Make sure HTTPS is enabled (should be automatic)
- **Verify**: Domain shows "Active" in Railway settings

---

## 🎯 Next Steps After Deployment

1. **Update Google OAuth** with your Railway domain
2. **Update frontend API URLs** (replace `localhost:3000`)
3. **Test all features** on production domain
4. **Add custom domain** (if you have one)

---

## 💡 Pro Tips

1. **Auto-deploy**: Railway automatically deploys when you push to GitHub
2. **View logs**: Click on your service → "Deployments" → Click on a deployment → "View Logs"
3. **Redeploy**: If something breaks, you can redeploy from the "Deployments" tab
4. **Environment variables**: Keep them secure - never commit `.env` file to GitHub

---

## 📚 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway (great community support)

---

**Ready?** Let's get you deployed! 🚀

