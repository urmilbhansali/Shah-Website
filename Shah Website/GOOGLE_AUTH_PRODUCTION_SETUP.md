# Google OAuth Production Setup Guide

This guide will walk you through setting up Google OAuth for production deployment.

## 📋 Prerequisites

- Google Cloud Platform (GCP) account
- Your production domain (e.g., `https://yourdomain.com`)
- HTTPS enabled on your production server (required for Google OAuth)

---

## 🔧 Step 1: Configure Google Cloud Console

### 1.1 Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Select your project (or create a new one)

### 1.2 Enable Required APIs

1. Navigate to **APIs & Services** > **Library**
2. Search for and enable:
   - **Google+ API** (if not already enabled)
   - **Google Identity Services API** (recommended)

### 1.3 Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: `Shah Distributors Worldwide`
   - **User support email**: Your email (e.g., `urmilbhansali@gmail.com`)
   - **App logo**: (Optional) Upload your logo
   - **Application home page**: `https://yourdomain.com`
   - **Application privacy policy link**: `https://yourdomain.com/privacy` (if you have one)
   - **Application terms of service link**: `https://yourdomain.com/terms` (if you have one)
   - **Authorized domains**: Add your domain (e.g., `yourdomain.com`)
   - **Developer contact information**: Your email
4. Click **Save and Continue**

### 1.4 Configure Scopes

1. On the **Scopes** screen, click **Add or Remove Scopes**
2. Select the following scopes:
   - `openid`
   - `email`
   - `profile`
3. Click **Update** then **Save and Continue**

### 1.5 Add Test Users (If App is in Testing)

If your app is still in testing mode:
1. Add test users (emails that can sign in)
2. Add `urmilbhansali@gmail.com` and any other test emails
3. Click **Save and Continue**

### 1.6 Review and Submit

1. Review all settings
2. Click **Back to Dashboard**

---

## 🔑 Step 2: Create OAuth 2.0 Client ID

### 2.1 Create Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **OAuth client ID**

### 2.2 Configure OAuth Client

1. **Application type**: Select **Web application**
2. **Name**: `Shah Distributors Worldwide - Production`

### 2.3 Add Authorized JavaScript Origins

Add your production domains (one per line):
```
https://yourdomain.com
https://www.yourdomain.com
```

**Important**: 
- Must use `https://` (not `http://`)
- No trailing slashes
- Include both `www` and non-`www` versions if you use both

### 2.4 Add Authorized Redirect URIs

Add your production domains (one per line):
```
https://yourdomain.com
https://www.yourdomain.com
```

**Note**: For Google Sign-In with One Tap, you typically don't need redirect URIs, but add them for compatibility.

### 2.5 Create and Copy Client ID

1. Click **CREATE**
2. **Copy the Client ID** (starts with something like `123456789-abc...`)
3. **DO NOT copy the Client Secret** - you don't need it for this implementation

---

## 🔐 Step 3: Update Environment Variables

### 3.1 Create or Update `.env` File

1. If you don't have a `.env` file, copy from template:
   ```bash
   cp env.template .env
   ```

2. Open `.env` file and update:
   ```env
   GOOGLE_CLIENT_ID=your_production_client_id_here
   ```

   Replace `your_production_client_id_here` with the Client ID you copied.

### 3.2 Verify Configuration

Your `.env` file should have:
```env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```

---

## 🌐 Step 4: Update Frontend Code (If Needed)

The code already fetches the Google Client ID from the server, so it should work automatically. However, make sure:

1. **API endpoint URLs are updated** to use production domain (not `localhost:3000`)
2. **HTTPS is enabled** on your production server

---

## ✅ Step 5: Test Production Setup

### 5.1 Test Checklist

- [ ] Google Sign-In button appears on your production site
- [ ] Clicking the button opens Google sign-in popup
- [ ] After signing in, user is authenticated
- [ ] User information is stored correctly
- [ ] No console errors related to Google OAuth

### 5.2 Common Issues

**Issue**: "Error 400: redirect_uri_mismatch"
- **Solution**: Make sure your production domain is added to "Authorized JavaScript origins" in Google Cloud Console

**Issue**: "This app isn't verified"
- **Solution**: This is normal for apps in testing. Users will see a warning but can proceed. To remove the warning, you need to verify your app with Google (requires verification process).

**Issue**: "Google Sign-In not configured"
- **Solution**: Check that `GOOGLE_CLIENT_ID` is set in your `.env` file and the server is reading it correctly

**Issue**: Button doesn't appear
- **Solution**: 
  1. Check browser console for errors
  2. Verify Google Sign-In script is loaded: `<script src="https://accounts.google.com/gsi/client" async defer></script>`
  3. Verify Client ID is being fetched from `/api/config` endpoint

---

## 🔄 Step 6: Using Both Development and Production

### Option A: Separate OAuth Clients (Recommended)

Create **two separate OAuth clients**:
1. **Development Client**:
   - Name: `Shah Distributors Worldwide - Development`
   - Authorized origins: `http://localhost:3000`
   - Use in local `.env` file

2. **Production Client**:
   - Name: `Shah Distributors Worldwide - Production`
   - Authorized origins: `https://yourdomain.com`
   - Use in production `.env` file

### Option B: Single Client with Multiple Origins

Add both development and production origins to the same client:
- `http://localhost:3000`
- `https://yourdomain.com`

**Note**: This works but is less secure. Separate clients are recommended.

---

## 📝 Production Checklist

Before going live, verify:

- [ ] OAuth consent screen is configured
- [ ] Production Client ID is created
- [ ] Production domain added to "Authorized JavaScript origins"
- [ ] Production domain added to "Authorized redirect URIs"
- [ ] `GOOGLE_CLIENT_ID` is set in production `.env` file
- [ ] HTTPS is enabled on production server
- [ ] Tested Google Sign-In on production domain
- [ ] No console errors

---

## 🚨 Important Notes

1. **HTTPS is REQUIRED**: Google OAuth will NOT work on HTTP in production. You must have HTTPS enabled.

2. **Domain Verification**: Make sure your domain is verified in Google Cloud Console if required.

3. **App Verification**: For production apps with many users, Google may require app verification. This is a separate process.

4. **Rate Limits**: Google OAuth has rate limits. For high-traffic sites, monitor usage.

5. **Security**: Never commit your `.env` file to version control. It should be in `.gitignore`.

---

## 🆘 Troubleshooting

### Check Server Logs

Look for errors in your server logs:
```bash
# If using PM2
pm2 logs

# If running directly
# Check console output
```

### Verify Environment Variable

Test that the server is reading the Client ID:
```bash
curl https://yourdomain.com/api/config
```

Should return:
```json
{
  "googleClientId": "123456789-..."
}
```

### Browser Console

Check browser console (F12) for:
- CORS errors
- Google Sign-In script loading errors
- Client ID fetch errors

---

## 📚 Additional Resources

- [Google Identity Services Documentation](https://developers.google.com/identity/gsi/web)
- [Google OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [OAuth Consent Screen](https://support.google.com/cloud/answer/10311615)

---

## ✅ Next Steps

After setting up Google OAuth:

1. ✅ Update frontend API URLs to production
2. ✅ Set up HTTPS/SSL certificate
3. ✅ Configure Stripe for production
4. ✅ Test all authentication flows
5. ✅ Deploy to production

---

**Need Help?** Check the main `PRODUCTION_CHECKLIST.md` for other production setup items.

