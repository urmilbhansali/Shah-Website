const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe (only if key is provided)
let stripe = null;
if (process.env.STRIPE_SECRET_KEY) {
    try {
        stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    } catch (error) {
        console.warn('Stripe initialization failed:', error.message);
    }
} else {
    console.warn('STRIPE_SECRET_KEY not set. Stripe features will be disabled.');
}

// Initialize Google OAuth client (only if client ID is provided)
let client = null;
if (process.env.GOOGLE_CLIENT_ID) {
    try {
        client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    } catch (error) {
        console.warn('Google OAuth initialization failed:', error.message);
    }
} else {
    console.warn('GOOGLE_CLIENT_ID not set. Google OAuth features will be disabled.');
}

// In-memory storage for user price lists (in production, use a database)
let userPriceLists = {};
const PRICE_LIST_FILE = path.join(__dirname, 'user_price_lists.json');

// Tier-based pricing system with product-specific markups
let tierConfig = {
    bronze: { markups: {}, customers: {} }, // markups: { productId: markup% }
    silver: { markups: {}, customers: {} },
    gold: { markups: {}, customers: {} }
};
const TIER_CONFIG_FILE = path.join(__dirname, 'tier_config.json');

// In-memory storage for orders (in production, use a database)
let orders = {};
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// In-memory storage for products/inventory
let products = [];
const PRODUCTS_FILE = path.join(__dirname, 'products.json');

// In-memory storage for email-based users
let users = {};
const USERS_FILE = path.join(__dirname, 'users.json');

// Load users from file if it exists
if (fs.existsSync(USERS_FILE)) {
    try {
        users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Save users to file
function saveUsers() {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error saving users:', error);
    }
}

// Load orders from file if it exists
if (fs.existsSync(ORDERS_FILE)) {
    try {
        orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    } catch (error) {
        console.error('Error loading orders:', error);
    }
}

// Load products from file if it exists
if (fs.existsSync(PRODUCTS_FILE)) {
    try {
        products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    } catch (error) {
        console.error('Error loading products:', error);
        // If file doesn't exist or is invalid, products will be empty array
    }
}

// Save orders to file
function saveOrders() {
    try {
        fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    } catch (error) {
        console.error('Error saving orders:', error);
    }
}

// Save products to file
function saveProducts() {
    try {
        fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    } catch (error) {
        console.error('Error saving products:', error);
    }
}

// Initialize email transporter
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465, // SSL for port 465, TLS for port 587
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 30000, // 30 seconds
        greetingTimeout: 30000,
        socketTimeout: 30000,
        tls: {
            rejectUnauthorized: false, // Allow self-signed certificates if needed
            ciphers: 'SSLv3'
        },
        debug: true, // Enable debug logging
        logger: true
    });
    console.log(`Email transporter configured for ${process.env.SMTP_USER} via ${process.env.SMTP_HOST}:${smtpPort}`);
} else {
    console.warn('Email not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env to enable email sending.');
}

// Load user price lists from file if it exists
if (fs.existsSync(PRICE_LIST_FILE)) {
    try {
        userPriceLists = JSON.parse(fs.readFileSync(PRICE_LIST_FILE, 'utf8'));
    } catch (error) {
        console.error('Error loading price lists:', error);
    }
}

// Load tier configuration from file if it exists
if (fs.existsSync(TIER_CONFIG_FILE)) {
    try {
        tierConfig = JSON.parse(fs.readFileSync(TIER_CONFIG_FILE, 'utf8'));
    } catch (error) {
        console.error('Error loading tier config:', error);
    }
}

// Save user price lists to file
function savePriceLists() {
    try {
        fs.writeFileSync(PRICE_LIST_FILE, JSON.stringify(userPriceLists, null, 2));
    } catch (error) {
        console.error('Error saving price lists:', error);
    }
}

// Save tier configuration to file
function saveTierConfig() {
    try {
        fs.writeFileSync(TIER_CONFIG_FILE, JSON.stringify(tierConfig, null, 2));
    } catch (error) {
        console.error('Error saving tier config:', error);
    }
}

// Get customer tier based on email
function getCustomerTier(email) {
    if (tierConfig.gold.customers[email]) return 'gold';
    if (tierConfig.silver.customers[email]) return 'silver';
    if (tierConfig.bronze.customers[email]) return 'bronze';
    return 'bronze'; // Default to bronze
}

// Calculate price based on original cost and tier markup (product-specific)
function calculateTierPrice(originalCost, tier, productId) {
    if (!originalCost || originalCost <= 0) return null;
    // Get product-specific markup, or default to 0 if not set
    const markup = tierConfig[tier]?.markups?.[productId] || 0;
    return originalCost * (1 + markup / 100);
}

// Admin email - only this email can access admin endpoints
const ADMIN_EMAIL = 'urmilbhansali@gmail.com';

// Admin authentication middleware
function requireAdmin(req, res, next) {
    // Get user email from request header
    const userEmail = req.headers['x-user-email'];
    
    if (!userEmail) {
        return res.status(401).json({ 
            success: false, 
            error: 'Authentication required. Please log in.' 
        });
    }
    
    // Check if user is admin
    if (userEmail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        return res.status(403).json({ 
            success: false, 
            error: 'Access denied. Admin privileges required.' 
        });
    }
    
    // User is admin, proceed
    next();
}

// Middleware
app.use(cors());
app.use(express.json());

// Serve index.html as default landing page (login requirement paused)
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'login.html'));
// });

app.use(express.static('.'));

// Health check endpoint for Railway
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get config endpoint (for Google Client ID)
app.get('/api/config', (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID || '';
    
    // Only return client ID if it's properly configured
    if (clientId && clientId !== 'YOUR_GOOGLE_CLIENT_ID' && clientId !== 'your_google_client_id_here') {
        res.json({
            googleClientId: clientId,
        });
    } else {
        res.json({
            googleClientId: '',
        });
    }
});

// Email signup endpoint
app.post('/auth/email/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
        }
        
        // Check if user already exists
        if (users[email]) {
            return res.status(400).json({ success: false, error: 'Email already registered. Please sign in instead.' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const userId = 'email_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        users[email] = {
            id: userId,
            email: email,
            name: name,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        };
        
        saveUsers();
        
        // Get customer tier based on email
        const customerTier = getCustomerTier(email);
        
        // Calculate tier-based price list for this user
        const tierPriceList = {};
        products.forEach(product => {
            const originalCost = product.originalCost || product.price;
            const tierPrice = calculateTierPrice(originalCost, customerTier, product.id);
            if (tierPrice) {
                tierPriceList[product.id] = {
                    price: tierPrice,
                    originalPrice: product.originalPrice || originalCost,
                    isClearance: product.isClearance || false,
                };
            }
        });
        
        // Create user object for response (without password)
        const user = {
            id: userId,
            email: email,
            name: name,
            tier: customerTier,
        };
        
        res.json({
            success: true,
            user: user,
            priceList: tierPriceList,
            tier: customerTier,
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, error: 'Server error during signup' });
    }
});

// Email login endpoint
app.post('/auth/email/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }
        
        // Check if user exists
        const user = users[email];
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        
        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, error: 'Invalid email or password' });
        }
        
        // Get customer tier based on email
        const customerTier = getCustomerTier(email);
        
        // Calculate tier-based price list for this user
        const tierPriceList = {};
        products.forEach(product => {
            const originalCost = product.originalCost || product.price;
            const tierPrice = calculateTierPrice(originalCost, customerTier, product.id);
            if (tierPrice) {
                tierPriceList[product.id] = {
                    price: tierPrice,
                    originalPrice: product.originalPrice || originalCost,
                    isClearance: product.isClearance || false,
                };
            }
        });
        
        // Create user object for response (without password)
        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
            tier: customerTier,
        };
        
        res.json({
            success: true,
            user: userResponse,
            priceList: tierPriceList,
            tier: customerTier,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, error: 'Server error during login' });
    }
});

// Google OAuth verification endpoint
app.post('/auth/google', async (req, res) => {
    try {
        if (!client) {
            return res.status(500).json({ 
                success: false, 
                error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID environment variable.' 
            });
        }
        
        const { credential } = req.body;
        
        if (!credential) {
            return res.status(400).json({ success: false, error: 'No credential provided' });
        }

        // Check if Google Client ID is configured
        const clientId = process.env.GOOGLE_CLIENT_ID;
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID' || clientId === 'your_google_client_id_here') {
            return res.status(500).json({ 
                success: false, 
                error: 'Google OAuth not configured. Please set GOOGLE_CLIENT_ID in .env file' 
            });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: clientId,
        });

        const payload = ticket.getPayload();
        const userId = payload.sub;
        const userEmail = payload.email;
        const userName = payload.name;

        // Create or get user
        const user = {
            id: userId,
            email: userEmail,
            name: userName,
            token: credential, // In production, generate a proper JWT token
        };

        // Get customer tier based on email
        const customerTier = getCustomerTier(userEmail);
        
        // Calculate tier-based price list for this user
        const tierPriceList = {};
        products.forEach(product => {
            const originalCost = product.originalCost || product.price; // Use originalCost if available, fallback to price
            const tierPrice = calculateTierPrice(originalCost, customerTier, product.id);
            if (tierPrice) {
                tierPriceList[product.id] = {
                    price: tierPrice,
                    originalPrice: product.originalPrice || originalCost,
                    isClearance: product.isClearance || false,
                };
            }
        });

        // Store user tier assignment
        user.tier = customerTier;

        res.json({
            success: true,
            user: user,
            priceList: tierPriceList,
            tier: customerTier,
        });
    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(401).json({ success: false, error: 'Invalid token' });
    }
});

// Get user price list endpoint
app.get('/api/user/:userId/pricelist', (req, res) => {
    try {
        const { userId } = req.params;
        const priceList = userPriceLists[userId] || {};
        
        res.json({
            success: true,
            priceList: priceList,
        });
    } catch (error) {
        console.error('Error fetching price list:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Update user price list endpoint (for admin use)
app.post('/api/user/:userId/pricelist', (req, res) => {
    try {
        const { userId } = req.params;
        const { priceList } = req.body;
        
        if (!priceList) {
            return res.status(400).json({ success: false, error: 'Price list required' });
        }

        userPriceLists[userId] = priceList;
        savePriceLists();
        
        res.json({
            success: true,
            message: 'Price list updated',
        });
    } catch (error) {
        console.error('Error updating price list:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Stripe Checkout Session endpoint
app.post('/create-checkout-session', async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({ 
                error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.' 
            });
        }
        
        const { items, shippingAddress, shippingMethod, shippingCost } = req.body;

        // Create line items for Stripe
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.description || `SKU: ${item.sku}`,
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Add shipping as a line item if applicable
        if (shippingCost > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Shipping - ${shippingMethod}`,
                    },
                    unit_amount: Math.round(shippingCost * 100),
                },
                quantity: 1,
            });
        }

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/index.html`,
            customer_email: shippingAddress?.email || undefined,
            shipping_address_collection: shippingMethod !== 'pickup' ? {
                allowed_countries: ['US', 'CA'],
            } : undefined,
            metadata: {
                shipping_method: shippingMethod,
                order_items: JSON.stringify(items),
            },
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify payment session endpoint
app.get('/verify-session/:sessionId', async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({ 
                error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.' 
            });
        }
        
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
        
        // If payment is complete and order exists, send email
        if (session.payment_status === 'paid' && session.metadata?.order_id) {
            const orderId = session.metadata.order_id;
            const order = orders[orderId];
            
            if (order && !order.emailSent) {
                try {
                    const pdfBuffer = await generateInvoicePDF(order);
                    await sendInvoiceEmail(order, pdfBuffer);
                    order.emailSent = true;
                    saveOrders();
                } catch (emailError) {
                    console.error('Error sending email after payment:', emailError);
                }
            }
        }
        
        res.json({ 
            status: session.payment_status,
            customer: session.customer_details,
            amount_total: session.amount_total / 100,
        });
    } catch (error) {
        console.error('Error verifying session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Generate order ID
function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Generate PDF invoice
function generateInvoicePDF(order) {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];
            
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });
            doc.on('error', reject);
            
            // Header
            doc.fontSize(20).text('Shah Distributors Worldwide', { align: 'center' });
            doc.moveDown();
            doc.fontSize(16).text('INVOICE', { align: 'center' });
            doc.moveDown(2);
            
            // Order details
            doc.fontSize(12);
            doc.text(`Order ID: ${order.orderId}`, { align: 'left' });
            doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, { align: 'left' });
            doc.moveDown();
            
            // Customer info
            if (order.shippingAddress) {
                doc.text(`Bill To:`, { align: 'left' });
                doc.text(order.shippingAddress.name || '');
                doc.text(order.shippingAddress.address || '');
                doc.text(`${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zip || ''}`);
            }
            doc.moveDown();
            
            // Items table
            doc.fontSize(10);
            let yPos = doc.y;
            doc.text('Item', 50, yPos);
            doc.text('Qty', 300, yPos);
            doc.text('Price', 350, yPos);
            doc.text('Total', 450, yPos);
            
            yPos += 20;
            doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
            yPos += 10;
            
            order.items.forEach(item => {
                doc.text(item.name.substring(0, 40), 50, yPos);
                doc.text(item.quantity.toString(), 300, yPos);
                doc.text(`$${item.price.toFixed(2)}`, 350, yPos);
                doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 450, yPos);
                yPos += 20;
            });
            
            yPos += 10;
            doc.moveTo(50, yPos).lineTo(550, yPos).stroke();
            yPos += 20;
            
            // Totals
            doc.fontSize(12);
            doc.text(`Subtotal:`, 350, yPos);
            doc.text(`$${order.subtotal.toFixed(2)}`, 450, yPos);
            yPos += 20;
            
            doc.text(`Shipping (${order.shippingMethod}):`, 350, yPos);
            doc.text(`$${order.shippingCost.toFixed(2)}`, 450, yPos);
            yPos += 20;
            
            doc.fontSize(14);
            doc.font('Helvetica-Bold');
            doc.text(`Total:`, 350, yPos);
            doc.text(`$${(order.subtotal + order.shippingCost).toFixed(2)}`, 450, yPos);
            doc.font('Helvetica');
            yPos += 30;
            
            // Payment method
            doc.fontSize(10);
            doc.text(`Payment Method: ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}`, 50, yPos);
            yPos += 20;
            
            if (order.shippingMethod === 'pickup') {
                doc.text('Pickup Location: 47 Roselle St, Mineola, NY 11501', 50, yPos);
            }
            
            // Footer
            doc.fontSize(8);
            doc.text('Thank you for your business!', 50, doc.page.height - 100, { align: 'center' });
            
            doc.end();
        } catch (error) {
            reject(error);
        }
    });
}

// Send email with invoice
async function sendInvoiceEmail(order, pdfBuffer) {
    if (!transporter) {
        console.warn('Email not configured, skipping email send');
        return;
    }
    
    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: order.shippingEmail,
            subject: `Order Confirmation - ${order.orderId} - Shah Distributors Worldwide`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #ff6600;">Thank You for Your Order!</h2>
                    <p>Dear ${order.shippingAddress?.name || 'Customer'},</p>
                    <p>We have received your order and are processing it now.</p>
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
                    <p><strong>Total Amount:</strong> $${(order.subtotal + order.shippingCost).toFixed(2)}</p>
                    <p><strong>Payment Method:</strong> ${order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}</p>
                    ${order.shippingMethod === 'pickup' 
                        ? '<p><strong>Pickup Location:</strong> 47 Roselle St, Mineola, NY 11501</p>'
                        : `<p><strong>Shipping Address:</strong><br>${order.shippingAddress?.name || ''}<br>${order.shippingAddress?.address || ''}<br>${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} ${order.shippingAddress?.zip || ''}</p>`
                    }
                    <p>Please find your invoice attached to this email.</p>
                    <p>If you have any questions, please contact us.</p>
                    <p>Best regards,<br>Shah Distributors Worldwide</p>
                </div>
            `,
            attachments: [
                {
                    filename: `invoice-${order.orderId}.pdf`,
                    content: pdfBuffer,
                },
            ],
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`Invoice email sent to ${order.shippingEmail}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

// Create order endpoint
app.post('/api/order', async (req, res) => {
    try {
        const { items, shippingEmail, shippingAddress, shippingMethod, shippingCost, subtotal, paymentMethod, isPickup } = req.body;
        
        if (!shippingEmail) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }
        
        const orderId = generateOrderId();
        const order = {
            orderId,
            date: new Date().toISOString(),
            items,
            shippingEmail,
            shippingAddress,
            shippingMethod,
            shippingCost,
            subtotal,
            paymentMethod,
            isPickup,
        };
        
        // Store order
        orders[orderId] = order;
        saveOrders();
        
        // Generate PDF
        const pdfBuffer = await generateInvoicePDF(order);
        
        // Send email with PDF
        try {
            await sendInvoiceEmail(order, pdfBuffer);
        } catch (emailError) {
            console.error('Email sending failed, but order was created:', emailError);
            // Continue even if email fails
        }
        
        res.json({
            success: true,
            orderId: orderId,
            message: 'Order created successfully',
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Download invoice endpoint
app.get('/api/invoice/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = orders[orderId];
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        const pdfBuffer = await generateInvoicePDF(order);
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${orderId}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating invoice:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update Stripe checkout to create order after payment
app.post('/create-checkout-session', async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({ 
                error: 'Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.' 
            });
        }
        
        const { items, shippingAddress, shippingMethod, shippingCost, shippingEmail } = req.body;

        // Create line items for Stripe
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.name,
                    description: item.description || `SKU: ${item.sku}`,
                },
                unit_amount: Math.round(item.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Add shipping as a line item if applicable
        if (shippingCost > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Shipping - ${shippingMethod}`,
                    },
                    unit_amount: Math.round(shippingCost * 100),
                },
                quantity: 1,
            });
        }

        // Calculate subtotal
        const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order before Stripe session (for tracking)
        const orderId = generateOrderId();
        const order = {
            orderId,
            date: new Date().toISOString(),
            items,
            shippingEmail: shippingEmail || shippingAddress?.email,
            shippingAddress,
            shippingMethod,
            shippingCost,
            subtotal,
            paymentMethod: 'card',
            isPickup: shippingMethod === 'pickup',
        };
        
        orders[orderId] = order;
        saveOrders();

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}`,
            cancel_url: `${req.headers.origin}/index.html`,
            customer_email: shippingEmail || shippingAddress?.email || undefined,
            shipping_address_collection: shippingMethod !== 'pickup' ? {
                allowed_countries: ['US', 'CA'],
            } : undefined,
            metadata: {
                order_id: orderId,
                shipping_method: shippingMethod,
                order_items: JSON.stringify(items),
            },
        });

        res.json({ sessionId: session.id, url: session.url, orderId: orderId });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user orders by email
app.get('/api/user/orders', (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }
        
        // Convert orders object to array and filter by email
        const ordersArray = Object.values(orders).filter(order => 
            order.shippingEmail && order.shippingEmail.toLowerCase() === email.toLowerCase()
        );
        
        res.json({
            success: true,
            orders: ordersArray,
            count: ordersArray.length,
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to get all orders
app.get('/api/admin/orders', requireAdmin, (req, res) => {
    try {
        // Convert orders object to array
        const ordersArray = Object.values(orders);
        
        res.json({
            success: true,
            orders: ordersArray,
            count: ordersArray.length,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to update order status (mark as fulfilled)
app.post('/api/admin/orders/:orderId/fulfill', requireAdmin, (req, res) => {
    try {
        const { orderId } = req.params;
        
        if (!orders[orderId]) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        
        orders[orderId].fulfilled = true;
        orders[orderId].fulfilledDate = new Date().toISOString();
        saveOrders();
        
        res.json({
            success: true,
            message: 'Order marked as fulfilled',
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to get inventory
app.get('/api/admin/inventory', requireAdmin, (req, res) => {
    try {
        // Reload products from file to ensure latest data
        if (fs.existsSync(PRODUCTS_FILE)) {
            try {
                const fileData = fs.readFileSync(PRODUCTS_FILE, 'utf8');
                products = JSON.parse(fileData);
            } catch (error) {
                console.error('Error reloading products:', error);
            }
        }
        
        res.json({
            success: true,
            inventory: products || [],
            count: products ? products.length : 0,
        });
    } catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to update inventory
app.post('/api/admin/inventory', requireAdmin, (req, res) => {
    try {
        const { inventory } = req.body;
        
        if (!inventory || !Array.isArray(inventory)) {
            return res.status(400).json({ success: false, error: 'Invalid inventory data' });
        }

        products = inventory;
        saveProducts();
        
        res.json({
            success: true,
            message: 'Inventory updated successfully',
            count: products.length,
        });
    } catch (error) {
        console.error('Error updating inventory:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to export orders as Excel
app.get('/api/admin/orders/export/excel', requireAdmin, async (req, res) => {
    try {
        const XLSX = require('xlsx');
        const ordersArray = Object.values(orders);
        
        if (ordersArray.length === 0) {
            return res.status(404).json({ success: false, error: 'No orders to export' });
        }
        
        // Prepare data for Excel
        const excelData = ordersArray.map(order => {
            const itemsList = order.items.map(item => 
                `${item.name} (Qty: ${item.quantity}, Price: $${item.price.toFixed(2)})`
            ).join('; ');
            
            const shippingAddress = order.shippingAddress 
                ? `${order.shippingAddress.name}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`
                : 'Pickup';
            
            return {
                'Order ID': order.orderId,
                'Date': new Date(order.date).toLocaleString(),
                'Customer Email': order.shippingEmail,
                'Items': itemsList,
                'Subtotal': order.subtotal,
                'Shipping Cost': order.shippingCost,
                'Total': order.subtotal + order.shippingCost,
                'Payment Method': order.paymentMethod === 'card' ? 'Card' : 'Cash on Delivery',
                'Shipping Method': order.shippingMethod || 'N/A',
                'Shipping Address': shippingAddress,
                'Status': order.fulfilled ? 'Fulfilled' : (order.paymentMethod === 'cash' ? 'Pending' : 'Paid'),
                'Fulfilled': order.fulfilled ? 'Yes' : 'No',
            };
        });
        
        // Create workbook
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');
        
        // Generate buffer
        const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        // Set headers
        const filename = `orders_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.send(excelBuffer);
    } catch (error) {
        console.error('Error exporting orders:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to get tier configuration
app.get('/api/admin/pricelist/tiers', requireAdmin, (req, res) => {
    try {
        // Only return customer info, not full markups (markups are large and not needed for customer list)
        const tiers = {
            bronze: {
                markups: {}, // Don't send markups - they're large and not needed for customer display
                customers: Object.values(tierConfig.bronze.customers || {})
            },
            silver: {
                markups: {},
                customers: Object.values(tierConfig.silver.customers || {})
            },
            gold: {
                markups: {},
                customers: Object.values(tierConfig.gold.customers || {})
            }
        };
        
        res.json({
            success: true,
            tiers: tiers,
        });
    } catch (error) {
        console.error('Error fetching tier config:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to export tier price list to Excel
app.get('/api/admin/pricelist/tiers/:tier/export', requireAdmin, async (req, res) => {
    try {
        const { tier } = req.params;
        
        if (!['bronze', 'silver', 'gold'].includes(tier)) {
            return res.status(400).json({ success: false, error: 'Invalid tier' });
        }

        const XLSX = require('xlsx');
        const markups = tierConfig[tier]?.markups || {};
        
        // Prepare data for Excel
        const excelData = products.map(product => {
            const productMarkup = markups[product.id] || 0;
            const originalCost = product.originalCost || product.price || 0;
            const customerPrice = calculateTierPrice(originalCost, tier, product.id) || originalCost;
            
            return {
                'ID': product.id,
                'SKU': product.sku,
                'Sub-SKU': product.subSku || '',
                'Product Name': product.name,
                'Original Cost': originalCost,
                'Markup %': productMarkup,
                'Customer Price': customerPrice,
            };
        });
        
        // Create workbook
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `${tier.charAt(0).toUpperCase() + tier.slice(1)} Tier`);
        
        // Generate buffer
        const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
        
        // Set headers
        const filename = `${tier}_tier_pricelist_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        res.send(excelBuffer);
    } catch (error) {
        console.error('Error exporting tier price list:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to import tier price list from Excel
app.post('/api/admin/pricelist/tiers/:tier/import', requireAdmin, (req, res) => {
    try {
        const { tier } = req.params;
        const { markups } = req.body; // Array of { productId, markup }
        
        if (!['bronze', 'silver', 'gold'].includes(tier)) {
            return res.status(400).json({ success: false, error: 'Invalid tier' });
        }
        
        if (!markups || !Array.isArray(markups)) {
            return res.status(400).json({ success: false, error: 'Invalid markups data' });
        }

        // Update markups for this tier
        tierConfig[tier].markups = {};
        markups.forEach(item => {
            if (item.productId && item.markup !== undefined) {
                tierConfig[tier].markups[item.productId] = parseFloat(item.markup) || 0;
            }
        });
        
        saveTierConfig();
        
        res.json({
            success: true,
            message: `${tier} tier price list updated`,
            count: Object.keys(tierConfig[tier].markups).length,
        });
    } catch (error) {
        console.error('Error importing tier price list:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to add customer to tier
app.post('/api/admin/pricelist/tiers/:tier/customers', requireAdmin, async (req, res) => {
    try {
        const { tier } = req.params;
        const { email } = req.body;
        
        if (!['bronze', 'silver', 'gold'].includes(tier)) {
            return res.status(400).json({ success: false, error: 'Invalid tier' });
        }
        
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email required' });
        }

        // Remove customer from other tiers first
        Object.keys(tierConfig).forEach(t => {
            if (tierConfig[t].customers[email]) {
                delete tierConfig[t].customers[email];
            }
        });

        // Add to specified tier
        // Try to get customer name from existing user data if available
        let customerName = email.split('@')[0]; // Default to email username
        tierConfig[tier].customers[email] = {
            email: email,
            name: customerName,
            addedDate: new Date().toISOString()
        };
        
        saveTierConfig();
        
        res.json({
            success: true,
            message: 'Customer added to tier',
        });
    } catch (error) {
        console.error('Error adding customer to tier:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin endpoint to remove customer from tier
app.delete('/api/admin/pricelist/tiers/:tier/customers', requireAdmin, (req, res) => {
    try {
        const { tier } = req.params;
        const { email } = req.body;
        
        if (!['bronze', 'silver', 'gold'].includes(tier)) {
            return res.status(400).json({ success: false, error: 'Invalid tier' });
        }
        
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email required' });
        }

        if (tierConfig[tier].customers[email]) {
            delete tierConfig[tier].customers[email];
            saveTierConfig();
            
            res.json({
                success: true,
                message: 'Customer removed from tier',
            });
        } else {
            res.status(404).json({ success: false, error: 'Customer not found in tier' });
        }
    } catch (error) {
        console.error('Error removing customer from tier:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`Health check available at http://0.0.0.0:${PORT}/health`);
});

// Handle process errors
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
