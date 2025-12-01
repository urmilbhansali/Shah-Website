# Stripe Test Mode Setup

This guide will help you set up Stripe in test/sandbox mode for testing payments.

## Test Keys Provided

**Publishable Key (Test):**
```
pk_test_51SZQQKRlR1CA94oNhy4dK4EkRzwJpeMY07WY8oXfxAGkTMigM506k0mVhMaefvslRSYp97Qg6B0fWxoFhG4oShiC00eJUfajr1
```

## Setup Steps

### 1. Get Your Stripe Test Secret Key

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test mode** (toggle in the top right)
3. Copy your **Secret key** (starts with `sk_test_`)

### 2. Configure Railway Environment Variables

Add these environment variables in Railway:

1. Go to your Railway project dashboard
2. Click on your service
3. Go to the **Variables** tab
4. Add the following variables:

```
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_51SZQQKRlR1CA94oNhy4dK4EkRzwJpeMY07WY8oXfxAGkTMigM506k0mVhMaefvslRSYp97Qg6B0fWxoFhG4oShiC00eJUfajr1
```

**Important:** Replace `sk_test_your_secret_key_here` with your actual test secret key from Stripe dashboard.

### 3. For Local Development

If testing locally, create a `.env` file in the project root:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_51SZQQKRlR1CA94oNhy4dK4EkRzwJpeMY07WY8oXfxAGkTMigM506k0mVhMaefvslRSYp97Qg6B0fWxoFhG4oShiC00eJUfajr1
PORT=3000
```

## Testing Payments

### Test Card Numbers

Use these test card numbers in Stripe Checkout:

**Successful Payment:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/34`)
- CVC: Any 3 digits (e.g., `123`)
- ZIP: Any 5 digits (e.g., `12345`)

**Declined Payment:**
- Card Number: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

**Requires Authentication (3D Secure):**
- Card Number: `4000 0025 0000 3155`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Testing Flow

1. Add items to cart
2. Fill in shipping information
3. Select "Credit/Debit Card" as payment method
4. Click "Place Order"
5. You'll be redirected to Stripe Checkout
6. Use one of the test card numbers above
7. Complete the payment
8. You'll be redirected back to the success page

## Verifying Setup

After setting up the environment variables:

1. **Check Server Logs**: The server should log:
   - `Stripe initialized successfully` (if secret key is set)
   - `STRIPE_SECRET_KEY not set. Stripe features will be disabled.` (if not set)

2. **Test the API Endpoint**: 
   - Visit: `https://your-railway-domain.up.railway.app/api/stripe-key`
   - Should return: `{"publishableKey":"pk_test_51SZQQKRlR1CA94oNhy4dK4EkRzwJpeMY07WY8oXfxAGkTMigM506k0mVhMaefvslRSYp97Qg6B0fWxoFhG4oShiC00eJUfajr1"}`

3. **Check Stripe Dashboard**: 
   - Go to [Stripe Dashboard > Payments](https://dashboard.stripe.com/test/payments)
   - Test payments should appear here

## Troubleshooting

### "Stripe is not configured" Error
- **Cause**: `STRIPE_SECRET_KEY` not set in Railway
- **Fix**: Add `STRIPE_SECRET_KEY` environment variable in Railway

### "Stripe Publishable Key not configured" Error
- **Cause**: `STRIPE_PUBLISHABLE_KEY` not set in Railway
- **Fix**: Add `STRIPE_PUBLISHABLE_KEY` environment variable in Railway

### Payment Not Processing
- **Cause**: Using real card numbers in test mode
- **Fix**: Use test card numbers listed above

### Redirect Not Working
- **Cause**: Success/Cancel URLs not matching your domain
- **Fix**: Check that your Railway domain matches the URLs in `server.js`

## Production Migration

When ready for production:

1. Switch to **Live mode** in Stripe Dashboard
2. Get your **live** API keys (start with `sk_live_` and `pk_live_`)
3. Update Railway environment variables with live keys
4. Test with real cards (start with small amounts)

**Important:** Never use live keys in test mode or test keys in production!

