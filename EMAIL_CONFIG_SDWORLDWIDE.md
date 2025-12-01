# Email Configuration for do_not_reply@sdworldwide.com

## 📧 Setting Up Invoice Emails

You want to use `do_not_reply@sdworldwide.com` to send invoice emails. Here's how to configure it in Railway.

## 🔧 Step 1: Find Your Email Provider's SMTP Settings

Since `sdworldwide.com` is a custom domain, you need to know who hosts your email. Common providers:

### Google Workspace (G Suite)
If your domain email is hosted by Google:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=do_not_reply@sdworldwide.com
SMTP_PASS=your_app_password
SMTP_FROM=Shah Distributors Worldwide <do_not_reply@sdworldwide.com>
```

### Microsoft 365 / Outlook
If your domain email is hosted by Microsoft:
```
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=do_not_reply@sdworldwide.com
SMTP_PASS=your_password
SMTP_FROM=Shah Distributors Worldwide <do_not_reply@sdworldwide.com>
```

### cPanel / Hosting Provider
If your email is hosted by your web hosting provider:
```
SMTP_HOST=mail.sdworldwide.com (or smtp.sdworldwide.com)
SMTP_PORT=587
SMTP_USER=do_not_reply@sdworldwide.com
SMTP_PASS=your_email_password
SMTP_FROM=Shah Distributors Worldwide <do_not_reply@sdworldwide.com>
```

### Zoho Mail
If using Zoho:
```
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=do_not_reply@sdworldwide.com
SMTP_PASS=your_app_password
SMTP_FROM=Shah Distributors Worldwide <do_not_reply@sdworldwide.com>
```

## 🔍 How to Find Your SMTP Settings

1. **Check your email hosting provider**:
   - Where did you set up `sdworldwide.com` email?
   - Check your hosting control panel (cPanel, Plesk, etc.)
   - Check your domain registrar's email settings

2. **Common SMTP servers**:
   - Google Workspace: `smtp.gmail.com`
   - Microsoft 365: `smtp.office365.com`
   - cPanel: `mail.yourdomain.com` or `smtp.yourdomain.com`
   - Zoho: `smtp.zoho.com`

3. **Check your email client settings**:
   - If you've set up this email in Outlook/Thunderbird/etc.
   - Check the SMTP settings there

## 📋 Step 2: Add Variables in Railway

Once you know your SMTP settings:

1. Go to Railway → Your Service → **Variables** tab
2. Add these variables:

```
SMTP_HOST=your_smtp_server_here
SMTP_PORT=587
SMTP_USER=do_not_reply@sdworldwide.com
SMTP_PASS=your_email_password_here
SMTP_FROM=Shah Distributors Worldwide <do_not_reply@sdworldwide.com>
```

## 🔑 Important Notes

1. **Email Account Must Exist**: Make sure `do_not_reply@sdworldwide.com` is a real email account that exists
2. **Password**: Use the password for this email account (or app password if using Google/Microsoft)
3. **Port**: Usually 587 (TLS) or 465 (SSL)
4. **Test First**: Send a test email to yourself to verify it works

## 🧪 Testing

After adding variables in Railway:

1. Railway will redeploy automatically
2. Check logs - should not see "Email not configured" warning
3. Place a test order to verify invoice email is sent
4. Check spam folder if email doesn't arrive

## ❓ Don't Know Your SMTP Settings?

If you're not sure who hosts your email:

1. **Check your domain registrar** (where you bought sdworldwide.com)
2. **Check your hosting provider** (if you have web hosting)
3. **Check DNS records** - MX records show email provider
4. **Contact your IT/admin** - They should know the email setup

## 📧 Alternative: Create the Email Account

If `do_not_reply@sdworldwide.com` doesn't exist yet:

1. Log into your email hosting control panel
2. Create a new email account: `do_not_reply@sdworldwide.com`
3. Set a secure password
4. Use those credentials in Railway

---

**Need help finding your SMTP settings?** Let me know who hosts your email or where you manage your domain, and I can help you find the right settings!

