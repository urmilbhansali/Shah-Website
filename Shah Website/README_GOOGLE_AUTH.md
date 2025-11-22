# Google Authentication Setup Guide

This guide will help you set up Google Sign-In for the Shah Distributors Worldwide e-commerce site.

## Prerequisites

- A Google Cloud Platform (GCP) account
- Node.js and npm installed

## Step 1: Create a Google OAuth 2.0 Client ID

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen:
     - Choose "External" user type
     - Fill in the required information (App name, User support email, etc.)
     - Add your email to test users
     - Save and continue through the scopes and test users screens
   - Application type: "Web application"
   - Name: "Shah Distributors Worldwide"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - Add your production domain when deploying
   - Authorized redirect URIs:
     - `http://localhost:3000`
     - Add your production domain when deploying
   - Click "Create"
5. Copy the **Client ID** (not the Client Secret - you don't need it for this implementation)

## Step 2: Configure Environment Variables

1. Copy the `.env.template` file to `.env` if you haven't already:
   ```bash
   cp env.template .env
   ```

2. Open the `.env` file and add your Google Client ID:
   ```
   GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

   Replace `your_google_client_id_here` with the Client ID you copied from Google Cloud Console.

## Step 3: Install Dependencies

If you haven't already installed the dependencies:
```bash
npm install
```

This will install the `google-auth-library` package along with other dependencies.

## Step 4: Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`.

## How It Works

1. **User Login**: Users click the "Sign in with Google" button in the header
2. **Authentication**: Google verifies the user's identity
3. **Backend Verification**: The backend verifies the Google token and creates/retrieves the user
4. **Price List**: Each user gets their own price list stored in `user_price_lists.json`
5. **Dynamic Pricing**: Products display user-specific prices based on their price list

## Managing User Price Lists

User price lists are stored in `user_price_lists.json`. The structure is:

```json
{
  "user_id_1": {
    "1": {
      "price": 79.99,
      "originalPrice": 129.99,
      "isClearance": true
    },
    "2": {
      "price": 19.99
    }
  },
  "user_id_2": {
    "1": {
      "price": 69.99
    }
  }
}
```

### Setting Custom Prices for Users

You can update a user's price list via the API:

```bash
curl -X POST http://localhost:3000/api/user/USER_ID/pricelist \
  -H "Content-Type: application/json" \
  -d '{
    "priceList": {
      "1": {"price": 79.99, "originalPrice": 129.99, "isClearance": true},
      "2": {"price": 19.99}
    }
  }'
```

Or manually edit the `user_price_lists.json` file (the server will need to be restarted to load changes).

## Production Considerations

1. **Database**: Replace the file-based storage with a proper database (MongoDB, PostgreSQL, etc.)
2. **JWT Tokens**: Generate proper JWT tokens instead of using the Google credential as a token
3. **HTTPS**: Use HTTPS in production (Google OAuth requires it for production)
4. **Environment Variables**: Use a secure environment variable management system
5. **Error Handling**: Add more robust error handling and logging
6. **Rate Limiting**: Add rate limiting to prevent abuse
7. **Session Management**: Implement proper session management with secure cookies

## Troubleshooting

- **"Google Sign-In not configured"**: Make sure you've set `GOOGLE_CLIENT_ID` in your `.env` file
- **"Invalid token"**: Check that your Google Client ID is correct and the OAuth consent screen is configured
- **CORS errors**: Make sure your authorized JavaScript origins include `http://localhost:3000`
- **Button not showing**: Check the browser console for errors and ensure the Google Sign-In script is loaded

