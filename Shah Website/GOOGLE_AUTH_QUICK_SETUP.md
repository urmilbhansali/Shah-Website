# Google OAuth Quick Setup Checklist

## 🎯 Quick Steps (5-10 minutes)

### 1. Google Cloud Console Setup

1. **Go to**: [Google Cloud Console](https://console.cloud.google.com/)
2. **Select/Create Project**
3. **Enable APIs**: 
   - APIs & Services > Library > Search "Google Identity Services" > Enable
4. **OAuth Consent Screen**:
   - APIs & Services > OAuth consent screen
   - App name: `Shah Distributors Worldwide`
   - User support email: `urmilbhansali@gmail.com`
   - Save and Continue through all steps
5. **Create OAuth Client**:
   - APIs & Services > Credentials > Create Credentials > OAuth client ID
   - Application type: **Web application**
   - Name: `Shah Distributors Worldwide - Production`
   - **Authorized JavaScript origins**: 
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - **Authorized redirect URIs**:
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```
   - Click **CREATE**
   - **Copy the Client ID** (you'll need this)

### 2. Update .env File

```bash
# Create .env file if it doesn't exist
cp env.template .env

# Edit .env file and add:
GOOGLE_CLIENT_ID=paste_your_client_id_here
```

### 3. Verify Setup

1. Restart your server
2. Visit your production site
3. Check that Google Sign-In button appears
4. Test signing in

---

## ⚠️ Important Notes

- **HTTPS Required**: Google OAuth only works with HTTPS in production
- **No Trailing Slashes**: Don't add `/` at the end of URLs in Google Console
- **Both www and non-www**: Add both if you use both versions of your domain

---

## 🔍 Quick Test

After setup, test the config endpoint:
```bash
curl https://yourdomain.com/api/config
```

Should return:
```json
{
  "googleClientId": "123456789-..."
}
```

---

## ❌ Common Mistakes

1. ❌ Using `http://` instead of `https://` in origins
2. ❌ Adding trailing slashes (`https://domain.com/`)
3. ❌ Forgetting to add both `www` and non-`www` versions
4. ❌ Not updating `.env` file after creating OAuth client
5. ❌ Not restarting server after updating `.env`

---

## ✅ Done!

Once you've:
- [x] Created OAuth client in Google Console
- [x] Added production domain to authorized origins
- [x] Updated `.env` file with Client ID
- [x] Restarted server
- [x] Tested on production domain

You're ready to go! 🎉

---

**Need detailed instructions?** See `GOOGLE_AUTH_PRODUCTION_SETUP.md`

