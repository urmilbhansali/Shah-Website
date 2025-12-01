# Railway SMTP Connection Timeout - Solutions

## 🔴 Problem

Railway is timing out when trying to connect to Zoho's SMTP server. This is likely because Railway blocks outbound SMTP connections on ports 465 and 587.

## ✅ Solution Options

### Option 1: Try Different Zoho SMTP Host

Try using `smtp.zoho.com` instead of `smtppro.zoho.com`:

**In Railway Variables:**
```
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=do_not_reply@sdworldwide.com
SMTP_PASS=BhansaliShahPatel@123
SMTP_FROM=Shah Distributors Worldwide <do_not_reply@sdworldwide.com>
```

### Option 2: Use Email API Service (Recommended)

Railway often blocks SMTP, so use an email API service instead:

#### A. Resend (Easiest - Free tier available)
- Sign up: https://resend.com
- Get API key
- Update code to use Resend API instead of SMTP

#### B. SendGrid (Free tier: 100 emails/day)
- Sign up: https://sendgrid.com
- Get API key
- Use SendGrid API

#### C. Mailgun (Free tier: 5,000 emails/month)
- Sign up: https://mailgun.com
- Get API key
- Use Mailgun API

### Option 3: Use Railway's Email Service (If Available)

Check if Railway offers an email service or addon.

### Option 4: Use Zoho API (If Available)

Check if Zoho has an API for sending emails instead of SMTP.

## 🔧 Quick Fix: Try smtp.zoho.com

Update Railway variable:
- Change `SMTP_HOST` from `smtppro.zoho.com` to `smtp.zoho.com`
- Keep port `587`
- Redeploy and test

## 📋 If SMTP Still Doesn't Work

If Railway continues to block SMTP, you'll need to use an email API service. I can help you integrate:
- Resend (recommended - easiest)
- SendGrid
- Mailgun

These services work through HTTP APIs, which Railway doesn't block.

---

**Next Step**: Try `smtp.zoho.com` first. If that doesn't work, we'll switch to an email API service.

