# Shah Distributors Worldwide - E-Commerce Website

A comprehensive e-commerce website featuring 55 general merchandise products with full shopping cart functionality, Stripe payment integration, Google authentication, and user-specific price lists.

## Features

- **Product Catalog**: Display of 55 general merchandise products with descriptions, prices, and inventory
- **Google Authentication**: Users can sign in with their Google account
- **User-Specific Pricing**: Each user has their own custom price list
- **Shopping Cart**: Add/remove items, update quantities with live sync
- **Dynamic Search**: Real-time product filtering
- **Clearance Items**: Special pricing with discount badges and stock indicators
- **Quantity Controls**: Manual input and +/- buttons for quantity management
- **Live Cart Panel**: Real-time cart updates on the main screen
- **Checkout Process**: Shipping address, delivery methods (including pickup), and payment options
- **Stripe Integration**: Secure card payment processing
- **Cash on Delivery**: Option for cash payments
- **Persistent Cart**: Cart data is saved to browser localStorage
- **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

1. Copy `env.template` to `.env`:
   ```bash
   cp env.template .env
   ```

2. Add your API keys to `.env`:
   - **Stripe Keys**: Get from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - **Google Client ID**: Get from [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - See `README_GOOGLE_AUTH.md` for detailed Google OAuth setup

### 3. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3000`.

### 4. Open in Browser

Navigate to `http://localhost:3000` in your web browser.

## User Authentication

Users can sign in with their Google account. Each authenticated user gets:
- Personalized pricing based on their price list
- Session persistence (stays logged in across page refreshes)
- Secure token-based authentication

### Managing User Price Lists

User price lists are stored in `user_price_lists.json`. You can:
- Manually edit the file (restart server to load changes)
- Use the API endpoint: `POST /api/user/:userId/pricelist`

See `README_GOOGLE_AUTH.md` for detailed setup and management instructions.

## Product Features

- **55 SKUs**: General merchandise items
- **Sub-SKUs**: Some products have multiple variants
- **Clearance Items**: Special pricing with original/sale prices and discount percentages
- **Stock Management**: Real-time stock count for clearance items
- **Units per Pack**: Display of packaging information

## Shopping Cart Features

- **Live Updates**: Cart syncs automatically with product list
- **Quantity Controls**: Adjust quantities from main list or cart
- **Shipping Address**: Enter address directly in cart panel
- **Delivery Methods**:
  - Pick Up (Free)
  - Standard Shipping (5-7 days) - $5.99
  - Express Shipping (2-3 days) - $12.99
  - Overnight Shipping (Next day) - $24.99
- **Payment Options**: Card (via Stripe) or Cash on Delivery

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling and layout
- `script.js` - Product data, cart functionality, authentication, and interactions
- `server.js` - Node.js/Express backend for Stripe and Google OAuth
- `package.json` - Project dependencies
- `success.html` - Payment success page
- `user_price_lists.json` - User-specific price lists (auto-generated)
- `README_GOOGLE_AUTH.md` - Detailed Google OAuth setup guide
- `README_STRIPE.md` - Stripe integration guide

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Authentication**: Google OAuth 2.0
- **Payments**: Stripe Checkout
- **Storage**: LocalStorage (cart), JSON file (price lists)

## Admin Dashboard

Access the admin dashboard at `http://localhost:3000/admin.html` to:
- View all orders
- See order statistics (total orders, revenue, today's orders, pending orders)
- Export orders to Excel (.xlsx) format
- Export orders to CSV format
- Refresh order data in real-time

### Admin Features:
- **Order Management**: View all orders with details including customer info, items, totals, and payment status
- **Excel Export**: Download all orders as an Excel file for easy management in Excel/Google Sheets
- **CSV Export**: Download orders as CSV for compatibility with any spreadsheet software
- **Real-time Stats**: See total orders, revenue, today's orders, and pending orders at a glance

## API Endpoints

### Public Endpoints
- `POST /auth/google` - Authenticate with Google
- `GET /api/user/:userId/pricelist` - Get user price list
- `POST /api/user/:userId/pricelist` - Update user price list
- `GET /api/config` - Get configuration (Google Client ID)
- `POST /create-checkout-session` - Create Stripe checkout session
- `GET /verify-session/:sessionId` - Verify payment session
- `POST /api/order` - Create order (cash on delivery)
- `GET /api/invoice/:orderId` - Download invoice PDF

### Admin Endpoints
- `GET /api/admin/orders` - Get all orders (for admin dashboard)
- `POST /api/admin/orders/:orderId/fulfill` - Mark order as fulfilled
- `GET /api/admin/orders/export/excel` - Export all orders as Excel file

## Browser Compatibility

Works on all modern browsers (Chrome, Firefox, Safari, Edge).

## Production Considerations

- Replace file-based price list storage with a database
- Use HTTPS (required for Google OAuth in production)
- Implement proper JWT token generation
- Add rate limiting and security measures
- Set up proper session management
- Configure production domains in Google OAuth settings
