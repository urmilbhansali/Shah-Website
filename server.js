const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-memory storage for user price lists (in production, use a database)
let userPriceLists = {};
const PRICE_LIST_FILE = path.join(__dirname, 'user_price_lists.json');

// In-memory storage for orders (in production, use a database)
let orders = {};
const ORDERS_FILE = path.join(__dirname, 'orders.json');

// Load orders from file if it exists
if (fs.existsSync(ORDERS_FILE)) {
    try {
        orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    } catch (error) {
        console.error('Error loading orders:', error);
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

// Initialize email transporter
let transporter = null;
if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
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

// Save user price lists to file
function savePriceLists() {
    try {
        fs.writeFileSync(PRICE_LIST_FILE, JSON.stringify(userPriceLists, null, 2));
    } catch (error) {
        console.error('Error saving price lists:', error);
    }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

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

// Google OAuth verification endpoint
app.post('/auth/google', async (req, res) => {
    try {
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

        // Get or create user price list
        if (!userPriceLists[userId]) {
            // Create default price list (same as base prices for now)
            // In production, you'd fetch this from a database
            userPriceLists[userId] = {};
        }

        res.json({
            success: true,
            user: user,
            priceList: userPriceLists[userId],
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
                doc.text('Pickup Location: 123 Main Street, City, State 12345', 50, yPos);
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
                        ? '<p><strong>Pickup Location:</strong> 123 Main Street, City, State 12345</p>'
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
