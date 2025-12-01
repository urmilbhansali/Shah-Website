# Custom Domain HTTPS Fix Guide

If HTTPS works on `shah-website-production.up.railway.app` but not on your custom domain, follow these steps:

## 🔍 Common Issues & Solutions

### Issue 1: SSL Certificate Not Yet Provisioned

**Symptom**: Custom domain shows "Not Secure" or certificate errors

**Solution**:
1. Go to Railway Dashboard → Your Service → Settings → Domains
2. Check your custom domain status:
   - **"Pending"** = SSL certificate is being provisioned (wait 5-30 minutes)
   - **"Active"** = Should work, but may need DNS propagation
   - **"Error"** = DNS configuration issue

3. **Wait Time**: Railway automatically provisions SSL certificates, but it can take:
   - 5-30 minutes after DNS is correctly configured
   - Up to 48 hours if DNS hasn't fully propagated

---

### Issue 2: DNS Not Fully Propagated

**Symptom**: Domain doesn't resolve or shows wrong certificate

**Check DNS Propagation**:
1. Use [whatsmydns.net](https://www.whatsmydns.net) to check if your DNS records have propagated globally
2. Enter your domain and check CNAME/A records
3. All locations should show the Railway domain/IP

**Solution**: Wait for DNS propagation (can take up to 48 hours, usually 15-30 minutes)

---

### Issue 3: Incorrect DNS Configuration

**Symptom**: Domain doesn't point to Railway

**Verify DNS Records**:

1. **Go to Railway Dashboard**:
   - Your Service → Settings → Domains
   - Click on your custom domain
   - Railway will show you the exact DNS records needed

2. **Check Your Domain Registrar**:
   - Log into where you bought your domain (GoDaddy, Namecheap, etc.)
   - Go to DNS Management
   - Verify the records match what Railway shows

**Common DNS Record Types**:

#### For Root Domain (yourdomain.com):
```
Type: CNAME
Name: @ (or leave blank, or "apex")
Value: shah-website-production.up.railway.app
TTL: 3600 (or default)
```

#### For www Subdomain (www.yourdomain.com):
```
Type: CNAME
Name: www
Value: shah-website-production.up.railway.app
TTL: 3600 (or default)
```

**Note**: Some registrars don't support CNAME for root domain. In that case, Railway will provide A records with IP addresses.

---

### Issue 4: Certificate Still Provisioning

**Symptom**: Domain works but shows "Not Secure"

**Solution**:
1. Railway automatically provisions SSL certificates via Let's Encrypt
2. This happens automatically after DNS is correctly configured
3. **Check Status**: Railway Dashboard → Settings → Domains → Your Domain
4. Status should change from "Pending" to "Active"

**If stuck on "Pending"**:
- Verify DNS records are correct
- Wait up to 1 hour
- Try removing and re-adding the domain in Railway

---

### Issue 5: Browser Cache/Certificate Cache

**Symptom**: Certificate errors even though Railway shows "Active"

**Solution**:
1. **Clear Browser Cache**:
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Firefox: Settings → Privacy → Clear Data → Cached Web Content
   - Safari: Develop → Empty Caches

2. **Try Incognito/Private Mode**:
   - This bypasses cache
   - If it works in incognito, it's a cache issue

3. **Clear SSL State** (Windows):
   - Internet Options → Content → Clear SSL state

---

## ✅ Step-by-Step Fix Process

### Step 1: Verify Domain in Railway

1. Go to Railway Dashboard
2. Your Service → Settings → Domains
3. Your custom domain should be listed
4. Check the status:
   - ✅ **Active** = Should work
   - ⏳ **Pending** = Wait for SSL provisioning
   - ❌ **Error** = DNS issue

### Step 2: Verify DNS Records

1. **Get DNS Records from Railway**:
   - Click on your domain in Railway
   - Copy the exact DNS records shown

2. **Check at Your Domain Registrar**:
   - Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
   - Go to DNS Management
   - Verify records match exactly

3. **Test DNS Propagation**:
   - Visit [whatsmydns.net](https://www.whatsmydns.net)
   - Enter your domain
   - Check if CNAME/A records point to Railway

### Step 3: Wait for SSL Certificate

1. After DNS is correct, Railway automatically provisions SSL
2. This usually takes **5-30 minutes**
3. Check status in Railway dashboard
4. Status will change from "Pending" → "Active"

### Step 4: Test HTTPS

1. Visit `https://yourdomain.com` (with https://)
2. Check for padlock icon 🔒
3. If still not working, wait another 15-30 minutes

---

## 🔧 Advanced Troubleshooting

### Check Certificate Details

1. Visit your custom domain with `https://`
2. Click the padlock icon in browser
3. View certificate details
4. Should show:
   - **Issued by**: Let's Encrypt (or Railway)
   - **Valid for**: yourdomain.com
   - **Expires**: Future date

### Force Certificate Renewal

If certificate is stuck:
1. Railway Dashboard → Settings → Domains
2. Remove your custom domain
3. Wait 5 minutes
4. Re-add the domain
5. Wait for SSL to provision again

### Check Railway Logs

1. Railway Dashboard → Your Service → Deployments
2. Check recent deployment logs
3. Look for SSL/certificate errors
4. Common errors:
   - DNS not configured
   - Domain not pointing to Railway
   - Certificate provisioning failed

---

## 📋 Quick Checklist

- [ ] Custom domain added in Railway Dashboard
- [ ] DNS records configured correctly at registrar
- [ ] DNS propagated (check with whatsmydns.net)
- [ ] Railway shows domain status as "Active" (not "Pending")
- [ ] Accessing site with `https://` (not `http://`)
- [ ] Cleared browser cache
- [ ] Tried incognito/private mode
- [ ] Waited at least 30 minutes after DNS setup

---

## 🆘 Still Not Working?

### Contact Railway Support

1. Railway Dashboard → Help → Support
2. Include:
   - Your Railway domain
   - Your custom domain
   - Screenshot of DNS records
   - Screenshot of Railway domain status

### Common Registrar-Specific Issues

**GoDaddy**:
- Make sure you're editing DNS in "DNS Management", not "Domain Settings"
- Use CNAME for www, A records for root domain (if Railway provides IPs)

**Namecheap**:
- Use "Advanced DNS" section
- Make sure records are saved

**Cloudflare**:
- Set SSL/TLS mode to "Full" or "Full (strict)"
- Disable "Always Use HTTPS" initially (Railway handles this)
- Make sure proxy is enabled (orange cloud)

---

## 🎯 Expected Timeline

- **DNS Propagation**: 15 minutes - 48 hours (usually 15-30 min)
- **SSL Certificate Provisioning**: 5-30 minutes after DNS is correct
- **Total**: Usually 20-60 minutes from DNS setup to working HTTPS

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Padlock icon 🔒 appears in browser
- ✅ No "Not Secure" warnings
- ✅ Certificate shows as valid
- ✅ Railway dashboard shows domain as "Active"
- ✅ Both `yourdomain.com` and `www.yourdomain.com` work with HTTPS

---

**Remember**: Railway automatically handles SSL certificates - you just need to:
1. Add domain in Railway
2. Configure DNS correctly
3. Wait for provisioning

No manual certificate installation needed! 🎉

