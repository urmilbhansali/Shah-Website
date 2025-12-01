# HTTPS Setup Guide for Railway

Railway automatically provides HTTPS/SSL certificates for all deployments. However, if you're seeing "unsafe" warnings, follow these steps:

## ✅ Quick Fix: Ensure You're Using HTTPS

### Step 1: Check Your Railway Domain

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the **"Settings"** tab
4. Scroll to **"Domains"** section
5. Your domain should be something like: `shah-website-production.up.railway.app`

### Step 2: Access via HTTPS

**Always use `https://` (not `http://`) when accessing your site:**

✅ **Correct**: `https://shah-website-production.up.railway.app`
❌ **Wrong**: `http://shah-website-production.up.railway.app`

### Step 3: Verify HTTPS is Working

1. Visit your site with `https://` prefix
2. Look for the padlock icon 🔒 in your browser's address bar
3. Click the padlock to see certificate details

---

## 🔧 If HTTPS Still Shows as "Unsafe"

### Option 1: Force HTTPS Redirect (Already Implemented)

The code has been updated to automatically redirect HTTP to HTTPS in production. This should work automatically.

### Option 2: Check Railway SSL Status

1. Go to Railway dashboard → Your Service → Settings → Domains
2. Check if your domain shows "Active" status
3. If it shows "Pending", wait a few minutes for SSL certificate to provision

### Option 3: Clear Browser Cache

Sometimes browsers cache the "unsafe" warning:
1. Clear your browser cache
2. Try accessing the site in an incognito/private window
3. Try a different browser

### Option 4: Check for Mixed Content

Make sure all resources (images, scripts, etc.) use HTTPS:
- ✅ `https://accounts.google.com/gsi/client`
- ✅ `https://images.unsplash.com/...`
- ❌ `http://...` (any HTTP resources will cause warnings)

---

## 🌐 Using a Custom Domain

If you're using your own domain (e.g., `shahdistributors.com`):

### Step 1: Add Custom Domain in Railway

1. Go to Railway → Your Service → Settings → Domains
2. Click **"Add Domain"** or **"Custom Domain"**
3. Enter your domain (e.g., `shahdistributors.com`)
4. Railway will show you DNS records to add

### Step 2: Configure DNS

Add the DNS records Railway provides at your domain registrar:

**CNAME Record:**
```
Type: CNAME
Name: @ (or leave blank)
Value: your-app.railway.app
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: your-app.railway.app
TTL: 3600
```

### Step 3: Wait for SSL Certificate

- Railway automatically provisions SSL certificates for custom domains
- Usually takes **5-30 minutes** after DNS propagates
- Check status in Railway dashboard → Domains section

---

## 🔍 Troubleshooting

### Issue: "Your connection is not private" / "NET::ERR_CERT_AUTHORITY_INVALID"

**Solution**: This usually means:
1. SSL certificate is still provisioning (wait 5-30 minutes)
2. DNS hasn't fully propagated (can take up to 48 hours)
3. You're accessing via HTTP instead of HTTPS

### Issue: Mixed Content Warnings

**Solution**: Ensure all resources use HTTPS:
- Check browser console for mixed content errors
- Update any `http://` URLs to `https://`
- The code already uses HTTPS for Google OAuth and external images

### Issue: Redirect Loop

**Solution**: 
- Make sure `NODE_ENV=production` is set in Railway environment variables
- Check that Railway's proxy headers are being recognized

---

## ✅ Verification Checklist

- [ ] Accessing site with `https://` prefix
- [ ] Padlock icon 🔒 visible in browser
- [ ] No mixed content warnings in browser console
- [ ] Railway domain shows "Active" status
- [ ] SSL certificate valid (click padlock to verify)
- [ ] All external resources use HTTPS

---

## 📞 Still Having Issues?

If HTTPS still doesn't work after following these steps:

1. **Check Railway Status**: Visit [status.railway.app](https://status.railway.app)
2. **Railway Support**: Contact Railway support through their dashboard
3. **Verify Environment**: Make sure `NODE_ENV=production` is set in Railway variables

---

## 🎯 Quick Reference

**Railway Domain Format:**
- `https://your-app-name.up.railway.app`

**Custom Domain:**
- `https://yourdomain.com`
- Requires DNS configuration
- SSL certificate auto-provisioned by Railway

**Important**: Always use `https://` - never `http://` for production sites!

