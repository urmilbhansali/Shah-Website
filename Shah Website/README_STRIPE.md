# Stripe Integration Setup Guide

This guide will help you set up Stripe payment processing for your e-commerce store.

## Prerequisites

- Node.js installed (v14 or higher)
- Stripe account (sign up at https://stripe.com)

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 3. Create Environment File

Create a `.env` file in the project root:

```bash
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
PORT=3000
```

**Important:** Never commit your `.env` file to version control. It's already in `.gitignore`.

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

### 5. Open the Website

Open `index.html` in your browser. The checkout will now use Stripe for card payments.

## How It Works

1. **Card Payments**: When a customer selects "Credit/Debit Card" and clicks "Place Order", they're redirected to Stripe Checkout
2. **Cash on Delivery**: Still works as before (no Stripe integration needed)
3. **Payment Processing**: Stripe handles all payment processing securely
4. **Success Page**: After successful payment, customers are redirected to `success.html`

## Testing

Use Stripe's test card numbers:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- Use any future expiry date (e.g., `12/34`)
- Use any 3-digit CVV

## Production Deployment

When ready for production:

1. Get your **live** API keys from Stripe dashboard
2. Update `.env` with live keys (remove `_test_` from key names)
3. Deploy your backend server (Heroku, AWS, etc.)
4. Update the API endpoint in `script.js` to point to your production server
5. Ensure your site uses HTTPS (required for Stripe)

## Security Notes

- API keys are stored server-side only
- Never expose secret keys in frontend code
- Use environment variables for all sensitive data
- Always use HTTPS in production

## Support

For Stripe API documentation, visit: https://stripe.com/docs/api

