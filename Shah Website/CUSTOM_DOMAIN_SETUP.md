# Custom Domain Setup Guide

Yes! You can absolutely use your own domain with Railway (or any hosting platform). Your site will be accessible at `yourdomain.com` instead of `yourapp.railway.app`.

---

## 🎯 What You Need

- ✅ Your own domain (e.g., `shahdistributors.com`)
- ✅ Access to your domain's DNS settings
- ✅ Railway account (or other hosting platform)

---

## 🚀 Step-by-Step: Setting Up Custom Domain on Railway

### Step 1: Deploy Your App to Railway

1. Deploy your app to Railway first (get it working on the Railway subdomain)
2. Once deployed, you'll have a URL like `yourapp.railway.app`

### Step 2: Add Custom Domain in Railway

1. Go to your Railway project
2. Click on **"Settings"** tab
3. Scroll to **"Domains"** section
4. Click **"Add Domain"** or **"Custom Domain"**
5. Enter your domain (e.g., `shahdistributors.com`)
6. Railway will show you DNS records you need to add

### Step 3: Configure DNS Records

You need to add DNS records at your domain registrar (where you bought the domain). Railway will show you exactly what to add.

**Common DNS Records:**

#### Option A: CNAME Record (Recommended)
```
Type: CNAME
Name: @ (or leave blank, or "www")
Value: your-app.railway.app
TTL: 3600 (or default)
```

#### Option B: A Record (If CNAME doesn't work)
Railway will provide you with IP addresses to use.

**For both www and non-www:**
```
Type: CNAME
Name: www
Value: your-app.railway.app
```

```
Type: CNAME
Name: @
Value: your-app.railway.app
```

### Step 4: Wait for DNS Propagation

- DNS changes can take **5 minutes to 48 hours** to propagate
- Usually takes **15-30 minutes**
- Railway will show status: "Pending" → "Active"

### Step 5: SSL Certificate (Automatic!)

- Railway automatically provisions SSL certificates for custom domains
- Once DNS propagates, HTTPS will be enabled automatically
- No additional setup needed!

---

## 📝 Where to Add DNS Records

### Common Domain Registrars:

**GoDaddy:**
1. Log in → My Products → DNS
2. Add CNAME record

**Namecheap:**
1. Domain List → Manage → Advanced DNS
2. Add CNAME record

**Google Domains:**
1. My Domains → DNS → Custom Records
2. Add CNAME record

**Cloudflare:**
1. Select domain → DNS → Records
2. Add CNAME record

**Other registrars:**
- Look for "DNS Management", "DNS Settings", or "DNS Records"
- Add the CNAME record Railway provides

---

## ✅ Verification Checklist

After setup:
- [ ] DNS records added at domain registrar
- [ ] Railway shows domain as "Active" (not "Pending")
- [ ] Can access site at `https://yourdomain.com`
- [ ] HTTPS works (SSL certificate active)
- [ ] Both `www.yourdomain.com` and `yourdomain.com` work (if configured)

---

## 🔧 Update Google OAuth

Once your custom domain is working:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client ID
3. Update **"Authorized JavaScript origins"**:
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```
4. Update **"Authorized redirect URIs"**:
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```

---

## 🔧 Update Frontend API URLs

You'll need to update all `localhost:3000` references to use your custom domain. I can help you create a script to do this automatically!

---

## ⚠️ Important Notes

1. **HTTPS Required**: Make sure your domain uses HTTPS (Railway does this automatically)
2. **Both www and non-www**: Configure both if you want both to work
3. **DNS Propagation**: Be patient - it can take time
4. **SSL Certificate**: Railway provisions this automatically (free!)

---

## 🆘 Troubleshooting

### Domain Not Working

1. **Check DNS propagation**: Use [whatsmydns.net](https://www.whatsmydns.net) to see if DNS has propagated
2. **Verify DNS records**: Make sure CNAME points to correct Railway URL
3. **Check Railway status**: Make sure domain shows "Active" in Railway
4. **Wait longer**: DNS can take up to 48 hours (usually much faster)

### SSL Certificate Not Working

1. **Wait**: SSL provisioning can take a few minutes after DNS propagates
2. **Check Railway**: Look for SSL status in Railway dashboard
3. **Verify HTTPS**: Make sure you're accessing via `https://` not `http://`

### www vs non-www

- Configure both in DNS if you want both to work
- Or set up redirect (Railway can help with this)
- Update Google OAuth for both versions

---

## 💡 Pro Tips

1. **Start with Railway subdomain**: Get everything working first, then add custom domain
2. **Test on subdomain first**: Make sure all features work before switching
3. **Keep subdomain**: You can keep both - subdomain will still work
4. **Redirect www to non-www** (or vice versa): Configure in Railway or DNS

---

## 📋 Quick Reference

**What you'll have:**
- ✅ `https://yourdomain.com` (your custom domain)
- ✅ `https://www.yourdomain.com` (if configured)
- ✅ Automatic HTTPS/SSL
- ✅ No "railway.app" in URL

**What Railway provides:**
- ✅ Free SSL certificate
- ✅ Automatic HTTPS redirect
- ✅ DNS management
- ✅ Both www and non-www support

---

## ✅ You're All Set!

Once DNS propagates and Railway shows your domain as "Active", your site will be live at your custom domain!

**Next Steps:**
1. Add DNS records
2. Wait for propagation
3. Update Google OAuth with your domain
4. Update frontend API URLs
5. Test everything!

---

**Need help with DNS setup?** Let me know your domain registrar and I can give you specific instructions!

