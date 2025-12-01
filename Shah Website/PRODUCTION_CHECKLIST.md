# Production Push Checklist

## ✅ COMPLETED

- [x] **Admin Authentication** - Only `urmilbhansali@gmail.com` can access admin endpoints
- [x] **Admin Link Hidden** - Admin link only visible to admin users in navigation

---

## 🔴 CRITICAL - Must Fix Before Production

### 1. **Environment Variables (.env file)** ⚠️
**Status**: ❌ Not configured
- **Action**: Create `.env` file from `env.template`
- **Required**:
  - `STRIPE_SECRET_KEY` - Must be LIVE key (starts with `sk_live_`, not `sk_test_`)
  - `STRIPE_PUBLISHABLE_KEY` - Must be LIVE key (starts with `pk_live_`)
  - `GOOGLE_CLIENT_ID` - Configured for production domain
  - `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` - For email invoices
  - `PORT` - Production port (usually 3000 or 80)
- **Time**: 15 minutes

### 2. **HTTPS/SSL Certificate** ⚠️
**Status**: ❌ Not configured
- **Why Critical**: 
  - Google OAuth REQUIRES HTTPS in production
  - Stripe REQUIRES HTTPS for payments
  - Without HTTPS, site won't work properly
- **Options**:
  - **Free**: Let's Encrypt (if you have a server)
  - **Easy**: Use hosting with built-in SSL (Heroku, Vercel, Railway, etc.)
  - **Cloudflare**: Free SSL proxy
- **Time**: 30 minutes - 2 hours (depending on method)

### 3. **Update Google OAuth Settings** ⚠️
**Status**: ❌ Needs configuration
- **Action**: Add production domain to Google Cloud Console
- **Steps**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  2. Edit your OAuth 2.0 Client ID
  3. Add production domain to "Authorized JavaScript origins"
  4. Add production domain to "Authorized redirect URIs"
- **Time**: 10 minutes

### 4. **Update Frontend API URLs** ⚠️
**Status**: ❌ Still using localhost
- **Issue**: All API calls use `http://localhost:3000`
- **Files to update**:
  - `script.js`
  - `admin.html`
  - `inventory.html`
  - `pricelist.html`
  - `profile.html`
  - `about.html`
  - `login.html`
- **Action**: Replace `http://localhost:3000` with production URL
- **Time**: 15 minutes

---

## 🟡 HIGH PRIORITY - Should Fix Soon

### 5. **Rate Limiting**
**Status**: ❌ Not implemented
- **Risk**: DDoS attacks, brute force on login
- **Fix**: Add `express-rate-limit` package
- **Time**: 30 minutes

### 6. **CORS Configuration**
**Status**: ❌ Open to all origins
- **Current**: `app.use(cors())` allows any website
- **Fix**: Configure CORS to only allow your domain
- **Time**: 10 minutes

### 7. **Security Headers**
**Status**: ❌ Not implemented
- **Fix**: Add `helmet` package for security headers
- **Time**: 15 minutes

### 8. **Input Validation**
**Status**: ❌ Not implemented
- **Risk**: Data corruption, crashes
- **Fix**: Add `express-validator` for input validation
- **Time**: 1-2 hours

---

## 🟢 MEDIUM PRIORITY - Can Do Later

### 9. **Database Migration**
**Status**: ⚠️ Using JSON files
- **Current**: File-based storage (orders.json, users.json, etc.)
- **Risk**: Data loss, not scalable
- **Fix**: Migrate to PostgreSQL/MongoDB
- **Time**: 1-2 days

### 10. **Error Logging**
**Status**: ⚠️ Only console.error
- **Fix**: Add Winston/Morgan for proper logging
- **Time**: 1-2 hours

### 11. **JWT Tokens**
**Status**: ⚠️ Using Google credential as token
- **Fix**: Implement proper JWT token generation
- **Time**: 2-3 hours

---

## 📋 MINIMUM VIABLE PRODUCTION (MVP) Checklist

To get the site live with basic security:

- [ ] **Create `.env` file** with production values
- [ ] **Set up HTTPS/SSL** (required for OAuth & Stripe)
- [ ] **Update Google OAuth** settings for production domain
- [ ] **Replace localhost URLs** with production URL in all frontend files
- [ ] **Verify Stripe LIVE keys** (not test keys)
- [ ] **Test payment flow** with real Stripe account
- [ ] **Test Google OAuth** on production domain
- [ ] **Test email sending** (if using email invoices)

**Estimated Time**: 2-4 hours

---

## 🚀 RECOMMENDED PRODUCTION SETUP

For a more secure and scalable setup, also add:

- [ ] **Rate limiting** (30 min)
- [ ] **CORS configuration** (10 min)
- [ ] **Security headers (helmet)** (15 min)
- [ ] **Input validation** (1-2 hours)
- [ ] **Database migration** (1-2 days)
- [ ] **Error logging** (1-2 hours)
- [ ] **Monitoring/Alerting** (2-4 hours)

**Estimated Time**: 1-2 weeks

---

## 🎯 QUICK WINS (Do These First)

1. ✅ Admin authentication - **DONE**
2. ✅ Admin link hidden - **DONE**
3. ⏳ Create `.env` file - **15 min**
4. ⏳ Add rate limiting - **30 min**
5. ⏳ Configure CORS - **10 min**
6. ⏳ Add security headers - **15 min**

**Total Quick Wins Time**: ~1 hour

---

## 📝 DEPLOYMENT OPTIONS

### Option 1: Simple Hosting (Easiest)
- **Heroku** - Free tier, easy deployment, built-in SSL
- **Railway** - Modern, easy, free tier
- **Vercel** - Great for static + serverless
- **Render** - Simple, free tier available

### Option 2: VPS/Server (More Control)
- **DigitalOcean** - $6/month droplet
- **AWS EC2** - Pay as you go
- **Linode** - Simple VPS
- **Requires**: Server setup, SSL certificate (Let's Encrypt), PM2 for process management

### Option 3: Container Platform
- **Docker** + **AWS ECS** / **Google Cloud Run**
- More complex but scalable

---

## ⚠️ CURRENT STATUS

**Status**: ⚠️ **NOT READY** - Missing critical configuration

**Blockers**:
1. No `.env` file
2. No HTTPS/SSL
3. Frontend still using localhost URLs
4. Google OAuth not configured for production

**Can Deploy After**: Fixing the 4 blockers above (2-4 hours)

---

## 🎯 NEXT STEPS

1. **Choose hosting platform** (Heroku, Railway, etc.)
2. **Create `.env` file** with production values
3. **Set up HTTPS/SSL** (usually automatic with hosting)
4. **Update Google OAuth** settings
5. **Replace localhost URLs** in frontend
6. **Deploy and test**

Would you like me to help implement any of these fixes?

