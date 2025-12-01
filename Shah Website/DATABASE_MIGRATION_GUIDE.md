# Database Migration Guide

## ✅ Yes, You Can Migrate After Going Live!

**Short answer**: Yes, absolutely! And it's actually a **smart strategy** to start simple and migrate when needed.

---

## 🎯 Migration Strategy

### Phase 1: Launch with File-Based Storage (Current)
- ✅ **Pros**: Simple, works immediately, no database setup needed
- ⚠️ **Cons**: Slower with many SKUs, not ideal for high traffic
- ✅ **When**: Perfect for launch and initial users

### Phase 2: Migrate to Database (When Needed)
- ✅ **When to migrate**: 
  - When you have 1000+ SKUs
  - When you have 100+ orders/month
  - When performance becomes an issue
  - When you need better reliability
- ✅ **Difficulty**: Moderate (2-4 hours of work)
- ✅ **Downtime**: Minimal (can be done with zero downtime)

---

## 📋 Migration Difficulty Assessment

### Difficulty: ⭐⭐ (Moderate - 2-4 hours)

**Why it's manageable**:
- ✅ Your data structure is simple (JSON files)
- ✅ Clear migration path
- ✅ Can be done incrementally
- ✅ No complex relationships

**What makes it easier**:
- ✅ Well-structured data (products, orders, users)
- ✅ No complex queries needed
- ✅ Can migrate one table at a time
- ✅ Can test in parallel

---

## 🔄 Migration Process Overview

### Step 1: Set Up Database (30 minutes)
1. Choose database (PostgreSQL recommended)
2. Set up database on hosting platform
3. Create tables/schema
4. Test connection

### Step 2: Create Migration Script (1-2 hours)
1. Read data from JSON files
2. Transform to database format
3. Insert into database
4. Verify data integrity

### Step 3: Update Server Code (1-2 hours)
1. Replace file reads with database queries
2. Replace file writes with database inserts/updates
3. Update all endpoints
4. Test thoroughly

### Step 4: Deploy & Verify (30 minutes)
1. Deploy updated code
2. Run migration script
3. Verify data migrated correctly
4. Monitor for issues

**Total Time**: 2-4 hours

---

## 🛠️ Detailed Migration Steps

### 1. Choose Database

**Recommended: PostgreSQL**
- ✅ Free tiers available (Railway, Render, Supabase)
- ✅ Reliable and fast
- ✅ Good for structured data
- ✅ Easy to set up

**Alternative: MongoDB**
- ✅ More flexible schema
- ✅ Good for JSON-like data
- ✅ Also has free tiers

### 2. Set Up Database

**Option A: Railway/Render Built-in Database**
- Easiest - just add database service
- Automatic connection
- Free tier available

**Option B: Supabase (PostgreSQL)**
- Free tier: 500 MB database
- Easy setup
- Good documentation

**Option C: MongoDB Atlas**
- Free tier: 512 MB
- Easy setup
- Good for JSON data

### 3. Create Database Schema

**Products Table**:
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(50) UNIQUE NOT NULL,
  sub_sku VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  is_clearance BOOLEAN DEFAULT FALSE,
  stock INTEGER,
  units_per_pack INTEGER DEFAULT 1,
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Orders Table**:
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  date TIMESTAMP NOT NULL,
  shipping_email VARCHAR(255) NOT NULL,
  shipping_address JSONB,
  shipping_method VARCHAR(50),
  shipping_cost DECIMAL(10, 2),
  subtotal DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  is_pickup BOOLEAN DEFAULT FALSE,
  fulfilled BOOLEAN DEFAULT FALSE,
  fulfilled_date TIMESTAMP,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Order Items Table**:
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50)
);
```

**Users Table**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash VARCHAR(255),
  tier VARCHAR(50) DEFAULT 'bronze',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Migration Script Example

```javascript
// migrate.js
const fs = require('fs');
const { Pool } = require('pg'); // For PostgreSQL

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrateProducts() {
  // Read JSON file
  const products = JSON.parse(fs.readFileSync('products.json', 'utf8'));
  
  // Insert into database
  for (const product of products) {
    await pool.query(`
      INSERT INTO products (id, sku, sub_sku, name, description, price, original_price, is_clearance, stock, units_per_pack, color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (id) DO UPDATE SET
        sku = EXCLUDED.sku,
        name = EXCLUDED.name,
        price = EXCLUDED.price
    `, [
      product.id,
      product.sku,
      product.subSku || null,
      product.name,
      product.description,
      product.price,
      product.originalPrice || null,
      product.isClearance || false,
      product.stock || null,
      product.unitsPerPack || 1,
      product.color || null
    ]);
  }
  
  console.log(`Migrated ${products.length} products`);
}

async function migrateOrders() {
  const orders = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
  const ordersArray = Object.values(orders);
  
  for (const order of ordersArray) {
    // Insert order
    const orderResult = await pool.query(`
      INSERT INTO orders (order_id, date, shipping_email, shipping_address, shipping_method, shipping_cost, subtotal, payment_method, is_pickup, fulfilled, fulfilled_date, email_sent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id
    `, [
      order.orderId,
      order.date,
      order.shippingEmail,
      JSON.stringify(order.shippingAddress),
      order.shippingMethod,
      order.shippingCost,
      order.subtotal,
      order.paymentMethod,
      order.isPickup || false,
      order.fulfilled || false,
      order.fulfilledDate || null,
      order.emailSent || false
    ]);
    
    const orderDbId = orderResult.rows[0].id;
    
    // Insert order items
    for (const item of order.items) {
      await pool.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price, name, sku)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        orderDbId,
        item.id,
        item.quantity,
        item.price,
        item.name,
        item.sku
      ]);
    }
  }
  
  console.log(`Migrated ${ordersArray.length} orders`);
}

async function migrateUsers() {
  const users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  const usersArray = Object.values(users);
  
  for (const user of usersArray) {
    await pool.query(`
      INSERT INTO users (email, name, password_hash, tier)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        password_hash = EXCLUDED.password_hash
    `, [
      user.email,
      user.name,
      user.password,
      user.tier || 'bronze'
    ]);
  }
  
  console.log(`Migrated ${usersArray.length} users`);
}

async function migrate() {
  try {
    await migrateProducts();
    await migrateOrders();
    await migrateUsers();
    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

### 5. Update Server Code

**Before (File-based)**:
```javascript
// Load products
const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));

// Save products
fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
```

**After (Database)**:
```javascript
// Load products
const result = await pool.query('SELECT * FROM products ORDER BY id');
const products = result.rows;

// Save product
await pool.query(
  'UPDATE products SET price = $1, stock = $2 WHERE id = $3',
  [price, stock, id]
);
```

---

## ⚠️ Migration Considerations

### Zero-Downtime Migration

**Strategy**:
1. Deploy new code that supports both file and database
2. Run migration script (reads files, writes to database)
3. Switch to database mode
4. Keep files as backup

**Code Example**:
```javascript
// Support both during migration
const USE_DATABASE = process.env.USE_DATABASE === 'true';

async function getProducts() {
  if (USE_DATABASE) {
    return await db.getProducts();
  } else {
    return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
  }
}
```

### Data Backup

**Before migration**:
1. ✅ Backup all JSON files
2. ✅ Export to separate location
3. ✅ Verify backups

**After migration**:
1. ✅ Verify data in database
2. ✅ Keep JSON files as backup
3. ✅ Test all functionality

---

## 📊 When to Migrate

### Migrate When:

1. **Performance Issues**
   - Loading products takes >1 second
   - Search is slow
   - Users complain about speed

2. **Scale**
   - 1000+ SKUs
   - 100+ orders/month
   - 500+ users

3. **Reliability Issues**
   - File conflicts
   - Data corruption
   - Concurrent access problems

4. **Features Needed**
   - Advanced search
   - Analytics
   - Reporting
   - Complex queries

### Don't Migrate If:

- ✅ Everything works fine
- ✅ Small number of SKUs (<500)
- ✅ Low traffic
- ✅ No performance issues

**Rule of thumb**: Migrate when you feel the pain, not before!

---

## 💰 Cost of Migration

### Database Hosting Costs:

**Free Tiers** (Perfect for starting):
- Railway: Free PostgreSQL (1 GB)
- Render: Free PostgreSQL (90 days, then $7/month)
- Supabase: Free PostgreSQL (500 MB)
- MongoDB Atlas: Free (512 MB)

**Paid** (When you outgrow free tier):
- $5-10/month for most platforms
- Still very affordable

**Migration Cost**: $0 (just your time: 2-4 hours)

---

## ✅ Migration Checklist

**Before Migration**:
- [ ] Backup all JSON files
- [ ] Set up database
- [ ] Create database schema
- [ ] Write migration script
- [ ] Test migration script on copy of data

**During Migration**:
- [ ] Run migration script
- [ ] Verify data integrity
- [ ] Update server code
- [ ] Test all endpoints
- [ ] Deploy updated code

**After Migration**:
- [ ] Monitor for errors
- [ ] Verify all functionality works
- [ ] Keep JSON files as backup
- [ ] Update documentation

---

## 🎯 Recommendation

**For Your Situation**:

1. **Launch with file-based storage** ✅
   - Works fine for initial launch
   - Simple and reliable for small scale
   - No database setup needed

2. **Monitor performance** 📊
   - Watch for slow loading
   - Track user complaints
   - Monitor order volume

3. **Migrate when needed** 🔄
   - When you hit 1000+ SKUs
   - When performance degrades
   - When you need better features

4. **Migration is manageable** ✅
   - 2-4 hours of work
   - Can be done incrementally
   - Zero downtime possible

---

## 📚 Resources

- **PostgreSQL Tutorial**: https://www.postgresql.org/docs/
- **Node.js PostgreSQL**: https://node-postgres.com/
- **Supabase** (Free PostgreSQL): https://supabase.com
- **Railway PostgreSQL**: https://docs.railway.app/databases/postgresql

---

## ✅ Bottom Line

**Yes, you can migrate after going live!**

- ✅ **Difficulty**: Moderate (2-4 hours)
- ✅ **Downtime**: Zero (if done correctly)
- ✅ **Risk**: Low (can test first)
- ✅ **Cost**: Free (database free tiers available)
- ✅ **Strategy**: Start simple, migrate when needed

**Don't worry about it now** - launch first, migrate later when you need it! 🚀

