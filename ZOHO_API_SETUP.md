# Zoho Mail API Setup Guide

## 📧 Setting Up Zoho Mail API for Invoice Emails

Since Railway blocks SMTP connections, we'll use Zoho's HTTP API instead.

## 🔑 Step 1: Get Zoho OAuth Tokens

### 1.1 Create Zoho API Application

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click **"Add Client"** or **"Create App"**
3. Select **"Server-based Applications"**
4. Fill in:
   - **Client Name**: Shah Distributors Invoice Sender
   - **Homepage URL**: `https://shah-website-production.up.railway.app`
   - **Authorized Redirect URIs**: `https://shah-website-production.up.railway.app/auth/zoho/callback`
5. Click **"Create"**
6. **Save the Client ID and Client Secret**

### 1.2 Generate Access Token

1. In your Zoho API Console, find your app
2. Click **"Generate Code"**
3. You'll get an **Authorization Code**
4. Use this code to get an **Access Token** and **Refresh Token**

**Or use this URL** (replace YOUR_CLIENT_ID):
```
https://accounts.zoho.com/oauth/v2/auth?scope=ZohoMail.messages.CREATE&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=https://shah-website-production.up.railway.app/auth/zoho/callback
```

### 1.3 Get Your Account ID

1. Log into [Zoho Mail](https://mail.zoho.com)
2. Go to **Settings** → **Mail Accounts**
3. Find your account ID (usually your email address or a numeric ID)

## 🔧 Step 2: Add Variables to Railway

Go to Railway → Your Service → **Variables** tab and add:

```
ZOHO_ACCESS_TOKEN=your_access_token_here
ZOHO_ACCOUNT_ID=do_not_reply@sdworldwide.com
ZOHO_EMAIL=do_not_reply@sdworldwide.com
ZOHO_DATA_CENTER=com
```

**ZOHO_DATA_CENTER values:**
- `com` - United States (default)
- `eu` - Europe
- `in` - India
- `com.au` - Australia
- `jp` - Japan
- `zohocloud.ca` - Canada

## 📋 Step 3: Test the Configuration

After adding variables:
1. Railway will redeploy
2. Check logs for: `Zoho Mail API configured for do_not_reply@sdworldwide.com`
3. Place a test order
4. Check if invoice email is sent

## ⚠️ Important Notes

1. **Access Tokens Expire**: Zoho access tokens expire. You may need to:
   - Use refresh tokens to get new access tokens
   - Or regenerate tokens periodically

2. **PDF Attachments**: The current implementation sends the email. PDF attachment requires an additional API call (can be added if needed).

3. **Rate Limits**: Zoho has API rate limits. Check Zoho documentation for limits.

## 🔄 Alternative: Use Refresh Token

If you have a refresh token, we can add code to automatically refresh the access token when it expires.

## 📚 Zoho API Documentation

- [Zoho Mail API Getting Started](https://www.zoho.com/mail/help/api/getting-started-with-api.html)
- [Email Messages API](https://www.zoho.com/mail/help/api/email-api.html)

---

**Need help?** Share your Zoho API credentials (Client ID, Client Secret) and I can help you generate the access token.

