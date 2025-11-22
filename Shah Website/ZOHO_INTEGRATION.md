# Zoho Inventory Integration Guide

This guide explains how to integrate your Shah Distributors Worldwide e-commerce site with Zoho Inventory.

## Overview

Zoho Inventory can serve as your **source of truth** for:
- **Product/Inventory Management** - Sync products, stock levels, pricing
- **Order Management** - Push orders to Zoho, track fulfillment
- **Customer Management** - Sync customer data and tier assignments
- **Financial Tracking** - Automatic invoice generation and accounting

## Integration Approaches

### Option 1: Zoho Inventory API (Recommended)
Direct API integration for real-time sync and full control.

**Pros:**
- Real-time synchronization
- Full control over data mapping
- Custom business logic
- Works with your existing tier-based pricing

**Cons:**
- Requires development work
- Need to handle API rate limits
- Requires OAuth setup

### Option 2: Webhook-Based Sync
Zoho sends webhooks when inventory/orders change.

**Pros:**
- Real-time updates from Zoho
- Less polling needed
- Efficient

**Cons:**
- Requires webhook endpoint setup
- Need to handle webhook security

### Option 3: Scheduled Sync (Simplest)
Periodic sync (every 15-30 minutes) via cron job.

**Pros:**
- Simple to implement
- Less API calls
- Good for small-medium volume

**Cons:**
- Not real-time
- May have slight delays

## Recommended Architecture

```
Your E-commerce Site
    ↓
Zoho Inventory (Source of Truth)
    ↓
Sync: Products, Inventory, Orders, Customers
```

**Flow:**
1. **Products**: Sync from Zoho → Your site (stock, prices, descriptions)
2. **Orders**: Your site → Zoho (when order placed)
3. **Inventory**: Zoho → Your site (real-time stock updates)
4. **Customers**: Sync both ways (tier assignments, contact info)

## Implementation Steps

### Step 1: Set Up Zoho OAuth

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Create a new application
3. Get:
   - Client ID
   - Client Secret
   - Refresh Token (for server-to-server)

### Step 2: Install Zoho SDK

```bash
npm install zoho-inventory-api
# OR use axios for direct API calls
npm install axios
```

### Step 3: Add Environment Variables

Add to `.env`:
```
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_ORGANIZATION_ID=your_org_id
ZOHO_API_BASE_URL=https://inventory.zoho.com/api/v1
```

### Step 4: Key Integration Points

#### A. Sync Products from Zoho
- Pull products on startup
- Update stock levels periodically
- Map Zoho items to your product structure

#### B. Push Orders to Zoho
- When order is placed → Create Sales Order in Zoho
- Include customer, items, shipping, payment method
- Track order status

#### C. Sync Inventory Levels
- Real-time stock updates
- Prevent overselling
- Update your site when Zoho inventory changes

#### D. Customer Sync
- Create/update customers in Zoho
- Sync tier assignments
- Link customer emails

## Data Mapping

### Products Mapping
```
Your System          →  Zoho Inventory
─────────────────────────────────────
product.id          →  item_id
product.sku         →  sku
product.name        →  name
product.price       →  rate (with tier markup)
product.stock       →  quantity_on_hand
product.originalCost →  purchase_rate
```

### Orders Mapping
```
Your System          →  Zoho Inventory
─────────────────────────────────────
order.orderId       →  salesorder_number
order.items         →  line_items
order.shippingEmail →  customer.email
order.subtotal      →  subtotal
order.shippingCost  →  shipping_charge
order.paymentMethod →  payment_terms
```

### Customers Mapping
```
Your System          →  Zoho Inventory
─────────────────────────────────────
user.email          →  contact.email
user.name           →  contact.customer_name
user.tier           →  custom_field (tier)
```

## Best Practices

1. **Rate Limiting**: Zoho has API limits (varies by plan)
   - Implement retry logic with exponential backoff
   - Cache responses when possible
   - Batch operations when possible

2. **Error Handling**:
   - Log all API errors
   - Handle network timeouts
   - Validate data before syncing

3. **Data Consistency**:
   - Use Zoho as source of truth for inventory
   - Sync orders immediately after placement
   - Handle conflicts (e.g., item sold out)

4. **Security**:
   - Store OAuth tokens securely
   - Use HTTPS for all API calls
   - Rotate refresh tokens regularly

5. **Tier-Based Pricing**:
   - Keep your tier markup system
   - Calculate prices: Zoho base price + tier markup
   - Store markups in your system, not Zoho

## Integration Priority

**Phase 1 (Essential):**
- ✅ Sync products from Zoho
- ✅ Push orders to Zoho
- ✅ Sync inventory levels

**Phase 2 (Enhanced):**
- ✅ Customer sync
- ✅ Order status updates
- ✅ Invoice generation from Zoho

**Phase 3 (Advanced):**
- ✅ Real-time webhooks
- ✅ Multi-warehouse support
- ✅ Advanced reporting

## Next Steps

1. Set up Zoho API credentials
2. Create integration module in `server.js`
3. Test with a few products first
4. Gradually expand to full sync
5. Monitor API usage and optimize

Would you like me to create the actual integration code for your system?

