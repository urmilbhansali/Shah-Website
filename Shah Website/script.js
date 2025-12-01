// API Base URL - automatically detects production or development
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : `https://${window.location.hostname}`;

// Product data - 55 SKUs with some having sub-SKUs
const products = [
    {
        id: 1,
        sku: 'GM-001',
        subSku: 'GM-001-A',
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium noise-cancelling wireless headphones with 30-hour battery life. Comfortable over-ear design.',
        price: 89.99,
        originalPrice: 129.99,
        isClearance: true,
        stock: 5,
        unitsPerPack: 1,
        color: 'Black'
    },
    {
        id: 2,
        sku: 'GM-002',
        name: 'Smartphone Case with Stand',
        description: 'Durable protective case with built-in kickstand. Compatible with most smartphones.',
        price: 24.99,
        unitsPerPack: 1,
        color: 'Clear'
    },
    {
        id: 3,
        sku: 'GM-003',
        subSku: 'GM-003-B',
        name: 'USB-C Charging Cable Set',
        description: 'Fast charging cable set with multiple lengths. Includes 3ft, 6ft, and 10ft cables.',
        price: 39.99,
        originalPrice: 54.99,
        isClearance: true,
        stock: 12,
        unitsPerPack: 3,
        color: 'White'
    },
    {
        id: 4,
        sku: 'GM-004',
        name: 'LED Desk Lamp',
        description: 'Adjustable LED desk lamp with 5 brightness levels and USB charging port.',
        price: 64.99
    },
    {
        id: 5,
        sku: 'GM-005',
        name: 'Air Purifier',
        description: 'HEPA air purifier that removes 99.97% of airborne particles. Quiet operation.',
        price: 19.99
    },
    {
        id: 6,
        sku: 'GM-006',
        subSku: 'GM-006-C',
        name: 'Wireless Mouse Set (2-pack)',
        description: 'Ergonomic wireless mouse with long battery life. Set of 2 in assorted colors.',
        price: 34.99,
        originalPrice: 49.99,
        isClearance: true,
        stock: 8,
        unitsPerPack: 2
    },
    {
        id: 7,
        sku: 'GM-007',
        name: 'Laptop Stand',
        description: 'Adjustable aluminum laptop stand for improved ergonomics and cooling.',
        price: 22.99
    },
    {
        id: 8,
        sku: 'GM-008',
        name: 'Screen Cleaning Kit',
        description: 'Complete screen cleaning kit with microfiber cloths and cleaning solution.',
        price: 8.99
    },
    {
        id: 9,
        sku: 'GM-009',
        subSku: 'GM-009-D',
        name: 'Portable Power Bank',
        description: 'High-capacity 20000mAh power bank with fast charging. Includes USB-C and USB-A ports.',
        price: 18.99,
        originalPrice: 28.99,
        isClearance: true,
        stock: 15
    },
    {
        id: 10,
        sku: 'GM-010',
        name: 'HDMI Cable (6ft)',
        description: 'High-speed HDMI cable supporting 4K resolution. Gold-plated connectors.',
        price: 12.99
    },
    {
        id: 11,
        sku: 'GM-011',
        name: 'Webcam with Microphone',
        description: '1080p HD webcam with built-in noise-cancelling microphone. Perfect for video calls.',
        price: 9.99
    },
    {
        id: 12,
        sku: 'GM-012',
        subSku: 'GM-012-E',
        name: 'Wireless Keyboard',
        description: 'Slim wireless keyboard with quiet keys and long battery life. Compatible with all devices.',
        price: 11.99
    },
    {
        id: 13,
        sku: 'GM-013',
        name: 'USB Hub (4-port)',
        description: 'USB 3.0 hub with 4 ports for expanding connectivity. Compact design.',
        price: 16.99
    },
    {
        id: 14,
        sku: 'GM-014',
        name: 'Cable Management Kit',
        description: 'Cable organizer kit with clips, ties, and sleeves for neat cable management.',
        price: 7.99
    },
    {
        id: 15,
        sku: 'GM-015',
        subSku: 'GM-015-F',
        name: 'External Hard Drive (1TB)',
        description: 'Portable 1TB external hard drive with USB 3.0. Fast data transfer speeds.',
        price: 28.99,
        originalPrice: 42.99,
        isClearance: true,
        stock: 3
    },
    {
        id: 16,
        sku: 'GM-016',
        name: 'SD Card (128GB)',
        description: 'High-speed 128GB SD card with Class 10 rating. Perfect for cameras and devices.',
        price: 45.99
    },
    {
        id: 17,
        sku: 'GM-017',
        name: 'Tablet Stand',
        description: 'Adjustable tablet stand with 360-degree rotation. Fits all tablet sizes.',
        price: 79.99
    },
    {
        id: 18,
        sku: 'GM-018',
        subSku: 'GM-018-G',
        name: 'Phone Mount for Car',
        description: 'Magnetic car phone mount with strong grip. Easy one-handed operation.',
        price: 14.99
    },
    {
        id: 19,
        sku: 'GM-019',
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with 12-hour battery life and waterproof design.',
        price: 6.99
    },
    {
        id: 20,
        sku: 'GM-020',
        name: 'Cable Organizer Box',
        description: 'Cable management box to hide and organize cables. Fits power strips and cables.',
        price: 9.99
    },
    {
        id: 21,
        sku: 'GM-021',
        subSku: 'GM-021-H',
        name: 'Monitor Stand with Storage',
        description: 'Ergonomic monitor stand with built-in storage compartments. Frees up desk space.',
        price: 19.99
    },
    {
        id: 22,
        sku: 'GM-022',
        name: 'Laptop Cooling Pad',
        description: 'USB-powered laptop cooling pad with adjustable fan speeds. Prevents overheating.',
        price: 19.99
    },
    {
        id: 23,
        sku: 'GM-023',
        name: 'Phone Ring Holder',
        description: 'Adhesive phone ring holder for better grip and stand functionality.',
        price: 12.99
    },
    {
        id: 24,
        sku: 'GM-024',
        subSku: 'GM-024-I',
        name: 'Smart Watch Band',
        description: 'Comfortable silicone watch band compatible with popular smartwatch models.',
        price: 89.99,
        originalPrice: 139.99,
        isClearance: true,
        stock: 2
    },
    {
        id: 25,
        sku: 'GM-025',
        name: 'Screen Protector (3-pack)',
        description: 'Tempered glass screen protectors. Set of 3 with installation kit included.',
        price: 8.99,
        unitsPerPack: 3
    },
    {
        id: 26,
        sku: 'GM-026',
        name: 'Wireless Charging Pad',
        description: 'Fast wireless charging pad compatible with Qi-enabled devices. LED indicator.',
        price: 54.99
    },
    {
        id: 27,
        sku: 'GM-027',
        subSku: 'GM-027-J',
        name: 'Gaming Mouse Pad',
        description: 'Large gaming mouse pad with smooth surface and stitched edges. 36x12 inches.',
        price: 69.99
    },
    {
        id: 28,
        sku: 'GM-028',
        name: 'Laptop Sleeve',
        description: 'Protective laptop sleeve with padding. Available in multiple sizes.',
        price: 34.99
    },
    {
        id: 29,
        sku: 'GM-029',
        name: 'Phone Grip Stand',
        description: 'PopSocket-style phone grip with collapsible stand. Multiple color options.',
        price: 18.99
    },
    {
        id: 30,
        sku: 'GM-030',
        subSku: 'GM-030-K',
        name: 'Mechanical Keyboard',
        description: 'RGB backlit mechanical keyboard with customizable keys. Perfect for gaming.',
        price: 42.99,
        originalPrice: 64.99,
        isClearance: true,
        stock: 7
    },
    {
        id: 31,
        sku: 'GM-031',
        name: 'USB Flash Drive (64GB)',
        description: 'High-speed USB 3.0 flash drive with 64GB storage. Compact and portable.',
        price: 24.99
    },
    {
        id: 32,
        sku: 'GM-032',
        name: 'Phone Case with Wallet',
        description: 'Leather phone case with card slots and cash pocket. Built-in stand.',
        price: 12.99
    },
    {
        id: 33,
        sku: 'GM-033',
        subSku: 'GM-033-L',
        name: 'Earbuds with Case',
        description: 'Wireless earbuds with charging case. 20-hour total battery life.',
        price: 39.99,
        unitsPerPack: 1
    },
    {
        id: 34,
        sku: 'GM-034',
        name: 'Monitor Arm Mount',
        description: 'Adjustable monitor arm mount with gas spring. Supports up to 27 inches.',
        price: 129.99
    },
    {
        id: 35,
        sku: 'GM-035',
        name: 'Laptop Bag',
        description: 'Professional laptop bag with padded compartment and multiple pockets.',
        price: 99.99
    },
    {
        id: 36,
        sku: 'GM-036',
        subSku: 'GM-036-M',
        name: 'Smart Home Hub',
        description: 'Central hub for controlling smart home devices. Voice assistant compatible.',
        price: 119.99,
        originalPrice: 179.99,
        isClearance: true,
        stock: 4
    },
    {
        id: 37,
        sku: 'GM-037',
        name: 'Phone Camera Lens Kit',
        description: 'Universal phone camera lens kit with wide-angle, macro, and fisheye lenses.',
        price: 7.99
    },
    {
        id: 38,
        sku: 'GM-038',
        name: 'Cable Ties (100-pack)',
        description: 'Reusable cable ties for organizing cables. Set of 100 in assorted colors.',
        price: 6.99,
        unitsPerPack: 100
    },
    {
        id: 39,
        sku: 'GM-039',
        subSku: 'GM-039-N',
        name: 'USB Extension Cable',
        description: 'USB 3.0 extension cable in 6ft length. Maintains high-speed data transfer.',
        price: 8.99
    },
    {
        id: 40,
        sku: 'GM-040',
        name: 'Phone Tripod Mount',
        description: 'Adjustable tripod mount for smartphones. Perfect for video recording.',
        price: 12.99
    },
    {
        id: 41,
        sku: 'GM-041',
        name: 'Laptop Lock Cable',
        description: 'Security cable lock for laptops. Combination lock included.',
        price: 4.99
    },
    {
        id: 42,
        sku: 'GM-042',
        subSku: 'GM-042-O',
        name: 'Phone Car Mount (Vent)',
        description: 'Car vent phone mount with adjustable grip. One-handed operation.',
        price: 4.99
    },
    {
        id: 43,
        sku: 'GM-043',
        name: 'USB Wall Charger (Dual)',
        description: 'Fast charging dual USB wall charger with 2.4A output per port.',
        price: 4.99
    },
    {
        id: 44,
        sku: 'GM-044',
        name: 'Laptop Privacy Screen',
        description: 'Privacy screen filter for laptops. Reduces screen visibility from side angles.',
        price: 14.99
    },
    {
        id: 45,
        sku: 'GM-045',
        subSku: 'GM-045-P',
        name: 'Wireless Earbuds Pro',
        description: 'Premium wireless earbuds with active noise cancellation and transparency mode.',
        price: 89.99,
        originalPrice: 129.99,
        isClearance: true,
        stock: 6
    },
    {
        id: 46,
        sku: 'GM-046',
        name: 'Phone Battery Case',
        description: 'Battery case that doubles phone battery life. Built-in charging port.',
        price: 64.99
    },
    {
        id: 47,
        sku: 'GM-047',
        name: 'Tablet Keyboard Case',
        description: 'Protective keyboard case for tablets. Detachable keyboard with backlight.',
        price: 49.99
    },
    {
        id: 48,
        sku: 'GM-048',
        subSku: 'GM-048-Q',
        name: 'USB-C to HDMI Adapter',
        description: 'USB-C to HDMI adapter supporting 4K resolution. Compact design.',
        price: 16.99
    },
    {
        id: 49,
        sku: 'GM-049',
        name: 'Phone Screen Magnifier',
        description: 'Portable phone screen magnifier for better viewing. Fits all phone sizes.',
        price: 3.99
    },
    {
        id: 50,
        sku: 'GM-050',
        name: 'Laptop Sticker Set',
        description: 'Decorative laptop sticker set with 50+ unique designs. Easy to remove.',
        price: 14.99
    },
    {
        id: 51,
        sku: 'GM-051',
        subSku: 'GM-051-R',
        name: 'Gaming Headset',
        description: 'Surround sound gaming headset with noise-cancelling microphone and RGB lighting.',
        price: 39.99,
        originalPrice: 59.99,
        isClearance: true,
        stock: 9
    },
    {
        id: 52,
        sku: 'GM-052',
        name: 'Phone Selfie Ring Light',
        description: 'LED ring light for phone with adjustable brightness. Perfect for selfies and videos.',
        price: 79.99
    },
    {
        id: 53,
        sku: 'GM-053',
        name: 'Laptop Stand with Fan',
        description: 'Cooling laptop stand with built-in fans and adjustable height.',
        price: 24.99
    },
    {
        id: 54,
        sku: 'GM-054',
        subSku: 'GM-054-S',
        name: 'Smartphone Gimbal',
        description: '3-axis smartphone gimbal for smooth video recording. App-controlled features.',
        price: 29.99
    },
    {
        id: 55,
        sku: 'GM-055',
        name: 'Wireless Charging Stand',
        description: 'Adjustable wireless charging stand for phones and earbuds. Fast charging support.',
        price: 49.99
    }
];

// Cart state
let cart = [];

// Quantity state for each product (for table display)
let productQuantities = {};

// User state
let currentUser = null;
let userPriceList = null; // User-specific price list

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize quantities to 0 first
    products.forEach(product => {
        productQuantities[product.id] = 0;
    });
    
    // Load cart (which will sync quantities)
    loadCart();
    
    // Check if user is already logged in
    checkUserSession();
    
    // Initialize Google Sign-In (wait for script to load)
    if (typeof google !== 'undefined' && google.accounts) {
        initializeGoogleSignIn();
    } else {
        // Wait for Google script to load
        window.addEventListener('load', () => {
            setTimeout(initializeGoogleSignIn, 500);
        });
    }
    
    // Then render products (which will show correct quantities)
    renderProducts();
    
    // Initialize shipping fields visibility
    toggleShippingFields();
});

// Initialize Google Sign-In
async function initializeGoogleSignIn() {
    try {
        // Wait for Google Sign-In script to load
        if (typeof google === 'undefined' || !google.accounts) {
            console.warn('Google Sign-In script not loaded');
            document.getElementById('googleSignIn').innerHTML = '<p style="color: white; font-size: 11px; padding: 5px;">Google Sign-In not available</p>';
            return;
        }
        
        // Fetch Google Client ID from server
        let clientId = '';
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/config`);
            if (response.ok) {
                const data = await response.json();
                clientId = data.googleClientId || '';
            }
        } catch (error) {
            console.log('Could not fetch client ID from server:', error);
        }
        
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID' || clientId === 'your_google_client_id_here') {
            console.warn('Google Client ID not configured. Please set GOOGLE_CLIENT_ID in your .env file');
            document.getElementById('googleSignIn').innerHTML = '<div style="color: white; font-size: 11px; padding: 5px; text-align: center;"><p>Google Sign-In</p><p style="font-size: 9px; color: #ccc;">Not configured</p></div>';
            return;
        }
        
        // Initialize Google Sign-In
        google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
            auto_select: false,
        });
        
        // Render the button
        google.accounts.id.renderButton(
            document.getElementById('googleSignIn'),
            { 
                theme: 'outline', 
                size: 'medium',
                text: 'signin_with',
                width: 200
            }
        );
    } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
        document.getElementById('googleSignIn').innerHTML = '<p style="color: white; font-size: 11px; padding: 5px;">Sign-In Error</p>';
    }
}

// Handle Google Sign-In callback
async function handleGoogleSignIn(response) {
    try {
        // Send the credential to backend for verification
        const result = await fetch(`${API_BASE_URL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ credential: response.credential }),
        });
        
        const data = await result.json();
        
        if (data.success) {
            currentUser = data.user;
            userPriceList = data.priceList || {};
            
            // Store user session
            localStorage.setItem('user', JSON.stringify(currentUser));
            localStorage.setItem('userPriceList', JSON.stringify(userPriceList));
            
            // Update UI
            updateUserUI();
            
            // Reload products with user-specific prices
            renderProducts();
            
            const tierName = data.tier ? data.tier.charAt(0).toUpperCase() + data.tier.slice(1) : '';
            alert(`Welcome, ${currentUser.name}!${tierName ? ' You are a ' + tierName + ' tier customer.' : ''}`);
        } else {
            alert('Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('Error during login. Please try again.');
    }
}

// Check if user is authenticated (login requirement paused)
function checkUserSession() {
    const savedUser = localStorage.getItem('user');
    // Login requirement paused - no redirect
    // if (!savedUser) {
    //     // User not logged in, redirect to login page
    //     window.location.href = 'login.html';
    //     return false;
    // }
    
    if (savedUser) {
        const savedPriceList = localStorage.getItem('userPriceList');
        currentUser = JSON.parse(savedUser);
        if (savedPriceList) {
            userPriceList = JSON.parse(savedPriceList);
        }
        updateUserUI();
        
        // Fetch latest price list from server
        fetchUserPriceList();
        return true;
    }
    
    // User not logged in, but continue without authentication
    updateUserUI();
    return false;
}

// Fetch user price list from server
async function fetchUserPriceList() {
    if (!currentUser) return;
    
    try {
        // Re-authenticate to get updated tier-based pricing
        // For now, we'll use the stored price list, but in production you'd refresh from server
        // The price list is already calculated based on tier when user logs in
        renderProducts(); // Re-render with current prices
    } catch (error) {
        console.error('Error fetching price list:', error);
    }
}

// Update user UI
function updateUserUI() {
    const userInfo = document.getElementById('userInfo');
    const googleSignIn = document.getElementById('googleSignIn');
    const userName = document.getElementById('userName');
    const adminLink = document.getElementById('adminLink');
    
    if (currentUser) {
        userInfo.style.display = 'flex';
        googleSignIn.style.display = 'none';
        const tierName = currentUser.tier ? currentUser.tier.charAt(0).toUpperCase() + currentUser.tier.slice(1) : '';
        userName.textContent = `${currentUser.name}${tierName ? ' (' + tierName + ')' : ''}`;
        
        // Show admin link only if user is admin
        if (adminLink) {
            const ADMIN_EMAIL = 'urmilbhansali@gmail.com';
            if (currentUser.email && currentUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
                adminLink.style.display = 'inline-block';
            } else {
                adminLink.style.display = 'none';
            }
        }
    } else {
        userInfo.style.display = 'none';
        googleSignIn.style.display = 'block';
        
        // Hide admin link if user is not logged in
        if (adminLink) {
            adminLink.style.display = 'none';
        }
    }
}

// Logout function
function logout() {
    currentUser = null;
    userPriceList = null;
    localStorage.removeItem('user');
    localStorage.removeItem('userPriceList');
    // Redirect to login page
    window.location.href = 'login.html';
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Store order ID for invoice download
let currentOrderId = null;

// Show thank you modal
function showThankYou(orderId, orderDetails) {
    currentOrderId = orderId;
    const thankYouModal = document.getElementById('thankYouModal');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    thankYouMessage.innerHTML = `
        <p>Your order #${orderId} has been placed successfully.</p>
        <p style="font-size: 14px; color: #666; margin-top: 10px;">
            A confirmation email with your invoice has been sent to your email address.
        </p>
    `;
    
    thankYouModal.classList.add('active');
    closeCheckout();
}

// Download invoice PDF
async function downloadInvoice() {
    if (!currentOrderId) {
        alert('No order ID available');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/invoice/${currentOrderId}`, {
            method: 'GET',
        });
        
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${currentOrderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert('Error downloading invoice. Please try again.');
        }
    } catch (error) {
        console.error('Error downloading invoice:', error);
        alert('Error downloading invoice. Please try again.');
    }
}

// Continue shopping after thank you
function continueShopping() {
    const thankYouModal = document.getElementById('thankYouModal');
    thankYouModal.classList.remove('active');
    
    // Clear cart
    cart = [];
    productQuantities = {};
    updateCart();
    saveCart();
    renderProducts();
    
    // Reset form
    document.getElementById('cartShippingEmail').value = '';
    document.getElementById('cartShippingName').value = '';
    document.getElementById('cartShippingAddress').value = '';
    document.getElementById('cartShippingCity').value = '';
    document.getElementById('cartShippingState').value = '';
    document.getElementById('cartShippingZip').value = '';
}

// Get price for a product (user-specific or default)
function getProductPrice(product) {
    if (userPriceList && userPriceList[product.id]) {
        return userPriceList[product.id].price;
    }
    return product.price;
}

// Get original price for a product (user-specific or default)
function getProductOriginalPrice(product) {
    if (userPriceList && userPriceList[product.id]) {
        return userPriceList[product.id].originalPrice || product.originalPrice;
    }
    return product.originalPrice;
}

// Render products on the page
function renderProducts(filterText = '') {
    const productsTableBody = document.getElementById('productsTableBody');
    productsTableBody.innerHTML = '';

    // Filter products based on search text
    const filteredProducts = products.filter(product => {
        if (!filterText) return true;
        
        const searchLower = filterText.toLowerCase();
        const skuMatch = product.sku.toLowerCase().includes(searchLower);
        const subSkuMatch = product.subSku ? product.subSku.toLowerCase().includes(searchLower) : false;
        const nameMatch = product.name.toLowerCase().includes(searchLower);
        const descMatch = product.description.toLowerCase().includes(searchLower);
        
        return skuMatch || subSkuMatch || nameMatch || descMatch;
    });

    if (filteredProducts.length === 0) {
        productsTableBody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 20px; color: #999;">No products found matching your search.</td></tr>';
        return;
    }

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        const subSkuDisplay = product.subSku ? `<div class="product-subsku">Sub-SKU: ${product.subSku}</div>` : '';
        const quantity = productQuantities[product.id] || 0;
        
        // Get user-specific prices
        const productPrice = getProductPrice(product);
        const productOriginalPrice = getProductOriginalPrice(product);
        const isOnClearance = product.isClearance || (userPriceList && userPriceList[product.id] && userPriceList[product.id].isClearance);
        
        const total = (productPrice * quantity).toFixed(2);
        
        // Clearance sticker (inline with product name)
        const clearanceSticker = isOnClearance ? '<span class="clearance-sticker">CLEARANCE</span>' : '';
        
        // Price display with original price if on clearance
        let priceDisplay = `$${productPrice.toFixed(2)}`;
        if (isOnClearance && productOriginalPrice) {
            const discountPercent = Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100);
            priceDisplay = `
                <div class="price-container">
                    <div class="price-line">
                        <span class="original-price">$${productOriginalPrice.toFixed(2)}</span>
                        <span class="sale-price">$${productPrice.toFixed(2)}</span>
                    </div>
                    <span class="discount-percent">-${discountPercent}%</span>
                </div>
            `;
        }
        
        // Stock display
        const stockDisplay = product.stock !== undefined ? `<div class="stock-info">${product.stock} remaining</div>` : '';
        
        // Units per pack display
        const unitsPerPackDisplay = product.unitsPerPack ? `${product.unitsPerPack}` : '1';
        
        // Color display
        const colorDisplay = product.color || 'N/A';
        
        // Check if product is in cart (quantity > 0)
        const isInCart = quantity > 0;
        const totalClass = isInCart ? 'product-total in-cart' : 'product-total';
        
        row.innerHTML = `
            <td class="product-sku">${product.sku}${subSkuDisplay}</td>
            <td class="product-name">${product.name} ${clearanceSticker}</td>
            <td class="product-description">${product.description}${stockDisplay}</td>
            <td class="product-color">${colorDisplay}</td>
            <td class="product-price">${priceDisplay}</td>
            <td class="units-per-pack">${unitsPerPackDisplay}</td>
            <td class="quantity-controls">
                <button class="qty-btn qty-minus" onclick="updateProductQuantity(${product.id}, -1)" ${product.stock !== undefined && product.stock === 0 ? 'disabled' : ''}>-</button>
                <input type="number" class="qty-input" id="qty-${product.id}" value="${quantity}" min="0" ${product.stock !== undefined ? `max="${product.stock}"` : ''} onchange="updateProductQuantityManual(${product.id})" onkeypress="if(event.key==='Enter'){updateProductQuantityManual(${product.id})}" />
                <button class="qty-btn qty-plus" onclick="updateProductQuantity(${product.id}, 1)" ${product.stock !== undefined && product.stock === 0 ? 'disabled' : ''}>+</button>
            </td>
            <td class="${totalClass}" id="total-${product.id}">$${total}</td>
        `;
        productsTableBody.appendChild(row);
    });
}

// Filter products based on search input
function filterProducts() {
    const searchInput = document.getElementById('searchInput');
    const filterText = searchInput.value.trim();
    renderProducts(filterText);
}

// Update product quantity manually (from input field)
function updateProductQuantityManual(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const qtyInput = document.getElementById(`qty-${productId}`);
    if (!qtyInput) return;
    
    let newQuantity = parseInt(qtyInput.value) || 0;
    
    // Don't allow negative quantities
    if (newQuantity < 0) {
        newQuantity = 0;
    }
    
    // Don't allow more than stock
    if (product.stock !== undefined && newQuantity > product.stock) {
        newQuantity = product.stock;
    }
    
    // Update the input value in case it was corrected
    qtyInput.value = newQuantity;
    
    // Set the quantity
    productQuantities[productId] = newQuantity;
    
    // Get user-specific price
    const productPrice = getProductPrice(product);
    
    // Update the total display
    const totalDisplay = document.getElementById(`total-${productId}`);
    if (totalDisplay) {
        const total = (productPrice * newQuantity).toFixed(2);
        totalDisplay.textContent = `$${total}`;
        
        // Update green highlight based on cart status
        if (newQuantity > 0) {
            totalDisplay.classList.add('in-cart');
        } else {
            totalDisplay.classList.remove('in-cart');
        }
    }
    
    // Automatically update cart based on quantity change
    if (newQuantity > 0) {
        // Add or update item in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            cart.push({
                ...product,
                quantity: newQuantity
            });
        }
    } else {
        // Remove item from cart if quantity is 0
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
    saveCart();
}

// Update product quantity in table
function updateProductQuantity(productId, change) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Check stock availability
    if (product.stock !== undefined && change > 0) {
        const currentQty = productQuantities[productId] || 0;
        if (currentQty >= product.stock) {
            return; // Can't add more than available stock
        }
    }
    
    if (!productQuantities[productId]) {
        productQuantities[productId] = 0;
    }
    
    const oldQuantity = productQuantities[productId];
    productQuantities[productId] += change;
    
    // Don't allow negative quantities
    if (productQuantities[productId] < 0) {
        productQuantities[productId] = 0;
    }
    
    // Don't allow more than stock
    if (product.stock !== undefined && productQuantities[productId] > product.stock) {
        productQuantities[productId] = product.stock;
    }
    
    const newQuantity = productQuantities[productId];
    
    // Update the display
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    const totalDisplay = document.getElementById(`total-${productId}`);
    
    if (qtyDisplay && totalDisplay) {
        qtyDisplay.value = newQuantity;
        const productPrice = getProductPrice(product);
        const total = (productPrice * newQuantity).toFixed(2);
        totalDisplay.textContent = `$${total}`;
        
        // Update green highlight based on cart status
        if (newQuantity > 0) {
            totalDisplay.classList.add('in-cart');
        } else {
            totalDisplay.classList.remove('in-cart');
        }
    }
    
    // Automatically update cart based on quantity change
    if (newQuantity > 0) {
        // Add or update item in cart
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            cart.push({
                ...product,
                quantity: newQuantity
            });
        }
    } else {
        // Remove item from cart if quantity is 0
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
    saveCart();
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let quantityToAdd = productQuantities[productId] || 0;
    
    if (quantityToAdd === 0) {
        // If quantity is 0, add 1 by default
        quantityToAdd = 1;
        productQuantities[productId] = 1;
        const qtyDisplay = document.getElementById(`qty-${productId}`);
        const totalDisplay = document.getElementById(`total-${productId}`);
        if (qtyDisplay && totalDisplay) {
            qtyDisplay.value = 1;
            const productPrice = getProductPrice(product);
            const total = productPrice.toFixed(2);
            totalDisplay.textContent = `$${total}`;
            totalDisplay.classList.add('in-cart'); // Highlight when added to cart
        }
    }

    // Get user-specific price
    const productPrice = getProductPrice(product);
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantityToAdd;
        existingItem.price = productPrice; // Update price
    } else {
        cart.push({
            ...product,
            price: productPrice, // Use user-specific price
            quantity: quantityToAdd
        });
    }

    updateCart();
    saveCart();
    
    // Show visual feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '#ff6600';
    }, 1000);
}

// Remove product from cart (also syncs with main list)
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    
    // Sync with main list - set quantity to 0
    productQuantities[productId] = 0;
    
    // Update main list display
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    const totalDisplay = document.getElementById(`total-${productId}`);
    if (qtyDisplay && totalDisplay) {
        qtyDisplay.value = 0;
        totalDisplay.textContent = '$0.00';
        totalDisplay.classList.remove('in-cart'); // Remove highlight when removed from cart
    }
    
    updateCart();
    saveCart();
}

// Update quantity in cart (also syncs with main list)
function updateQuantity(productId, change) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    // Check stock availability
    if (product.stock !== undefined && change > 0) {
        const currentQty = item.quantity;
        if (currentQty >= product.stock) {
            return; // Can't add more than available stock
        }
    }

    item.quantity += change;
    
    // Don't allow negative quantities
    if (item.quantity < 0) {
        item.quantity = 0;
    }
    
    // Don't allow more than stock
    if (product.stock !== undefined && item.quantity > product.stock) {
        item.quantity = product.stock;
    }
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        // Sync with main list quantity
        productQuantities[productId] = item.quantity;
        
        // Update main list display
        const qtyDisplay = document.getElementById(`qty-${productId}`);
        const totalDisplay = document.getElementById(`total-${productId}`);
        if (qtyDisplay && totalDisplay) {
            qtyDisplay.value = item.quantity;
            const total = (product.price * item.quantity).toFixed(2);
            totalDisplay.textContent = `$${total}`;
            
            // Update green highlight based on cart status
            if (item.quantity > 0) {
                totalDisplay.classList.add('in-cart');
            } else {
                totalDisplay.classList.remove('in-cart');
            }
        }
        
        updateCart();
        saveCart();
    }
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Live cart elements
    const liveCartItems = document.getElementById('liveCartItems');
    const cartCountLive = document.getElementById('cartCountLive');
    const liveCartTotal = document.getElementById('liveCartTotal');

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
    if (cartCountLive) cartCountLive.textContent = totalItems;

    // Update cart items (sidebar)
    if (cart.length === 0) {
        if (cartItems) cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        if (liveCartItems) liveCartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        // Update sidebar cart
        if (cartItems) {
            cartItems.innerHTML = cart.map(item => {
                const subSkuText = item.subSku ? ` / ${item.subSku}` : '';
                const itemTotal = (item.price * item.quantity).toFixed(2);
                return `
                <div class="cart-item">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-sku">SKU: ${item.sku}${subSkuText}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity-display">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                        <div class="cart-item-total">Total: $${itemTotal}</div>
                    </div>
                </div>
            `;
            }).join('');
        }
        
        // Update live cart panel
        if (liveCartItems) {
            liveCartItems.innerHTML = cart.map(item => {
                const itemTotal = (item.price * item.quantity).toFixed(2);
                return `
                <div class="live-cart-item">
                    <div class="live-cart-item-name">${item.name}</div>
                    <div class="live-cart-item-right">
                        <div class="live-cart-item-controls">
                            <button class="qty-btn qty-minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="live-cart-item-qty">${item.quantity}</span>
                            <button class="qty-btn qty-plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <div class="live-cart-item-price">$${itemTotal}</div>
                    </div>
                </div>
            `;
            }).join('');
        }
    }

    // Update total with shipping
    updateCartShipping();
}

// Update shipping cost in cart (called from updateCart and when shipping method changes)
function updateCartShipping() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingMethod = document.getElementById('cartShippingMethod')?.value || 'standard';
    const shipping = calculateShipping(subtotal, shippingMethod);
    const total = subtotal + shipping;
    
    const cartTotal = document.getElementById('cartTotal');
    const liveCartTotal = document.getElementById('liveCartTotal');
    const cartShippingCost = document.getElementById('cartShippingCost');
    
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    if (liveCartTotal) liveCartTotal.textContent = total.toFixed(2);
    if (cartShippingCost) cartShippingCost.textContent = shipping.toFixed(2);
    
    // Update shipping method options if subtotal >= 100
    const shippingSelect = document.getElementById('cartShippingMethod');
    if (shippingSelect && subtotal >= 100 && shippingMethod !== 'pickup') {
        const currentMethod = shippingSelect.value;
        if (currentMethod !== 'pickup') {
            shippingSelect.innerHTML = `
                <option value="pickup">Pick Up (Free)</option>
                <option value="standard" selected>Free Shipping (5-7 business days)</option>
            `;
            if (cartShippingCost) cartShippingCost.textContent = '0.00';
            if (liveCartTotal) liveCartTotal.textContent = subtotal.toFixed(2);
            toggleShippingFields();
        }
    } else if (shippingSelect && subtotal < 100) {
        // Restore options if subtotal drops below $100 and not pickup
        if (shippingSelect.value !== 'pickup' && shippingSelect.children.length <= 2) {
            shippingSelect.innerHTML = `
                <option value="pickup">Pick Up (Free)</option>
                <option value="standard">Standard Shipping (5-7 days) - $5.99</option>
                <option value="express">Express Shipping (2-3 days) - $12.99</option>
                <option value="overnight">Overnight Shipping (Next day) - $24.99</option>
            `;
            toggleShippingFields();
        }
    }
}


// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}


// Calculate shipping cost
function calculateShipping(subtotal, shippingMethod = 'standard') {
    // Pickup is always free
    if (shippingMethod === 'pickup') {
        return 0;
    }
    
    // Free shipping for orders over $100
    if (subtotal >= 100) {
        return 0;
    }
    
    // Shipping rates based on method
    const shippingRates = {
        'standard': 5.99,
        'express': 12.99,
        'overnight': 24.99
    };
    
    return shippingRates[shippingMethod] || shippingRates['standard'];
}

// Toggle shipping address fields based on delivery method
function toggleShippingFields() {
    const shippingMethod = document.getElementById('cartShippingMethod')?.value;
    const shippingFields = document.getElementById('shippingAddressFields');
    const pickupInfo = document.getElementById('pickupInfo');
    
    if (shippingMethod === 'pickup') {
        if (shippingFields) shippingFields.style.display = 'none';
        if (pickupInfo) pickupInfo.style.display = 'block';
    } else {
        if (shippingFields) shippingFields.style.display = 'block';
        if (pickupInfo) pickupInfo.style.display = 'none';
    }
}

// Analyze cart history to find frequently bought items
function getFrequentlyBoughtItems() {
    try {
        const cartHistory = JSON.parse(localStorage.getItem('cartHistory') || '[]');
        const currentCartIds = new Set(cart.map(item => item.id));
        
        if (cartHistory.length === 0) {
            return [];
        }
        
        // Count item frequencies across all cart history
        const itemFrequency = {};
        const itemCoOccurrence = {}; // Items bought together with current cart items
        
        cartHistory.forEach(historyCart => {
            const historyItemIds = historyCart.items.map(item => item.id);
            
            // Count individual item frequencies
            historyItemIds.forEach(itemId => {
                if (!currentCartIds.has(itemId)) {
                    itemFrequency[itemId] = (itemFrequency[itemId] || 0) + 1;
                }
            });
            
            // Count co-occurrence with current cart items
            historyItemIds.forEach(historyItemId => {
                if (!currentCartIds.has(historyItemId)) {
                    historyItemIds.forEach(otherItemId => {
                        if (currentCartIds.has(otherItemId)) {
                            itemCoOccurrence[historyItemId] = (itemCoOccurrence[historyItemId] || 0) + 1;
                        }
                    });
                }
            });
        });
        
        // Combine scores (prioritize co-occurrence, then frequency)
        const scoredItems = Object.keys(itemFrequency).map(itemId => {
            const product = products.find(p => p.id === parseInt(itemId));
            if (!product) return null;
            
            const frequency = itemFrequency[itemId] || 0;
            const coOccurrence = itemCoOccurrence[itemId] || 0;
            const score = (coOccurrence * 2) + frequency; // Co-occurrence weighted more
            
            return {
                product: product,
                score: score,
                frequency: frequency,
                coOccurrence: coOccurrence
            };
        }).filter(item => item !== null);
        
        // Sort by score and return top 3
        scoredItems.sort((a, b) => b.score - a.score);
        return scoredItems.slice(0, 3).map(item => item.product);
    } catch (error) {
        console.error('Error analyzing cart history:', error);
        return [];
    }
}

// Get clearance items user may have purchased
function getClearanceUpsells() {
    try {
        const cartHistory = JSON.parse(localStorage.getItem('cartHistory') || '[]');
        const currentCartIds = new Set(cart.map(item => item.id));
        
        // Get all clearance items
        const clearanceItems = products.filter(p => p.isClearance && !currentCartIds.has(p.id));
        
        if (clearanceItems.length === 0) {
            return [];
        }
        
        // Check if user has purchased any of these items before
        const purchasedItemIds = new Set();
        cartHistory.forEach(historyCart => {
            historyCart.items.forEach(item => {
                purchasedItemIds.add(item.id);
            });
        });
        
        // Prioritize clearance items user has purchased before
        const scoredItems = clearanceItems.map(product => {
            const hasPurchased = purchasedItemIds.has(product.id);
            return {
                product: product,
                score: hasPurchased ? 2 : 1, // Higher score if purchased before
                hasPurchased: hasPurchased
            };
        });
        
        // Sort by score (purchased items first), then by price
        scoredItems.sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            return a.product.price - b.product.price;
        });
        
        return scoredItems.slice(0, 5).map(item => item.product);
    } catch (error) {
        console.error('Error getting clearance upsells:', error);
        return [];
    }
}

// Show upsell modals
function showUpsells() {
    const frequentlyBought = getFrequentlyBoughtItems();
    const clearanceUpsells = getClearanceUpsells();
    
    // Show frequently bought items first if available
    if (frequentlyBought.length > 0) {
        showFrequentlyBoughtUpsell(frequentlyBought);
    } else if (clearanceUpsells.length > 0) {
        // Skip to clearance if no frequently bought items
        showClearanceUpsell(clearanceUpsells);
    } else {
        // No upsells, proceed directly to checkout
        proceedToCheckout();
    }
}

// Show frequently bought items upsell
function showFrequentlyBoughtUpsell(items) {
    const modal = document.getElementById('frequentlyBoughtModal');
    const body = document.getElementById('frequentlyBoughtBody');
    
    body.innerHTML = items.map(product => {
        const productPrice = getProductPrice(product);
        const productOriginalPrice = getProductOriginalPrice(product);
        const isOnClearance = product.isClearance || (userPriceList && userPriceList[product.id] && userPriceList[product.id].isClearance);
        
        let priceDisplay = `$${productPrice.toFixed(2)}`;
        if (isOnClearance && productOriginalPrice) {
            const discountPercent = Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100);
            priceDisplay = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="text-decoration: line-through; color: #999; font-size: 12px;">$${productOriginalPrice.toFixed(2)}</span>
                    <span style="color: #ff6600; font-weight: bold;">$${productPrice.toFixed(2)}</span>
                    <span style="background: #ff6600; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">-${discountPercent}%</span>
                </div>
            `;
        }
        
        return `
            <div class="upsell-item" data-product-id="${product.id}">
                <div class="upsell-item-info">
                    <h4>${product.name}${isOnClearance ? ' <span style="background: #ff6600; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">CLEARANCE</span>' : ''}</h4>
                    <p class="upsell-item-description">${product.description}</p>
                    <div class="upsell-item-price">${priceDisplay}</div>
                </div>
                <div class="upsell-item-controls">
                    <div class="upsell-quantity-controls">
                        <button class="qty-btn qty-minus" onclick="updateUpsellQuantity('frequentlyBought', ${product.id}, -1)">-</button>
                        <input type="number" class="qty-input" id="upsell-qty-fb-${product.id}" value="0" min="0" onchange="updateUpsellQuantityManual('frequentlyBought', ${product.id})">
                        <button class="qty-btn qty-plus" onclick="updateUpsellQuantity('frequentlyBought', ${product.id}, 1)">+</button>
                    </div>
                    <button class="add-to-cart-upsell-btn" onclick="addUpsellToCart('frequentlyBought', ${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
    }).join('');
    
    modal.classList.add('active');
}

// Show clearance items upsell
function showClearanceUpsell(items) {
    const modal = document.getElementById('clearanceUpsellModal');
    const body = document.getElementById('clearanceUpsellBody');
    
    body.innerHTML = items.map(product => {
        const productPrice = getProductPrice(product);
        const productOriginalPrice = getProductOriginalPrice(product);
        const discountPercent = productOriginalPrice ? Math.round(((productOriginalPrice - productPrice) / productOriginalPrice) * 100) : 0;
        
        return `
            <div class="upsell-item" data-product-id="${product.id}">
                <div class="upsell-item-info">
                    <h4>${product.name} <span style="background: #ff6600; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">CLEARANCE</span></h4>
                    <p class="upsell-item-description">${product.description}</p>
                    <div class="upsell-item-price">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="text-decoration: line-through; color: #999; font-size: 12px;">$${productOriginalPrice ? productOriginalPrice.toFixed(2) : productPrice.toFixed(2)}</span>
                            <span style="color: #ff6600; font-weight: bold;">$${productPrice.toFixed(2)}</span>
                            <span style="background: #ff6600; color: white; padding: 2px 6px; border-radius: 3px; font-size: 10px;">-${discountPercent}%</span>
                        </div>
                    </div>
                </div>
                <div class="upsell-item-controls">
                    <div class="upsell-quantity-controls">
                        <button class="qty-btn qty-minus" onclick="updateUpsellQuantity('clearance', ${product.id}, -1)">-</button>
                        <input type="number" class="qty-input" id="upsell-qty-cl-${product.id}" value="0" min="0" onchange="updateUpsellQuantityManual('clearance', ${product.id})">
                        <button class="qty-btn qty-plus" onclick="updateUpsellQuantity('clearance', ${product.id}, 1)">+</button>
                    </div>
                    <button class="add-to-cart-upsell-btn" onclick="addUpsellToCart('clearance', ${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
    }).join('');
    
    modal.classList.add('active');
}

// Update upsell quantity
function updateUpsellQuantity(type, productId, change) {
    const inputId = `upsell-qty-${type === 'frequentlyBought' ? 'fb' : 'cl'}-${productId}`;
    const input = document.getElementById(inputId);
    if (!input) return;
    
    let currentValue = parseInt(input.value) || 0;
    let newQuantity = currentValue + change;
    
    // Allow going down to 0
    if (newQuantity < 0) {
        newQuantity = 0;
    }
    
    input.value = newQuantity;
}

// Update upsell quantity manually
function updateUpsellQuantityManual(type, productId) {
    const inputId = `upsell-qty-${type === 'frequentlyBought' ? 'fb' : 'cl'}-${productId}`;
    const input = document.getElementById(inputId);
    if (!input) return;
    
    let newQuantity = parseInt(input.value);
    if (isNaN(newQuantity) || newQuantity < 0) {
        input.value = 0;
        newQuantity = 0;
    }
}

// Add upsell item to cart
function addUpsellToCart(type, productId) {
    const inputId = `upsell-qty-${type === 'frequentlyBought' ? 'fb' : 'cl'}-${productId}`;
    const input = document.getElementById(inputId);
    const quantity = parseInt(input.value) || 0;
    
    // Don't add if quantity is 0
    if (quantity <= 0) {
        alert('Please select a quantity greater than 0 to add to cart.');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productPrice = getProductPrice(product);
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: productPrice,
            quantity: quantity,
            sku: product.sku || '',
            description: product.description || ''
        });
    }
    
    // Update product quantities
    productQuantities[productId] = (productQuantities[productId] || 0) + quantity;
    
    // Reset quantity to 0 after adding
    input.value = 0;
    
    // Update UI
    updateCart();
    saveCart();
    renderProducts();
    
    // Show confirmation
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.style.background = '#4CAF50';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1000);
}

// Keep main screen buttons as "Proceed to Checkout" (no changes needed)
// The checkout modal will show "Confirm Order" in green

// Skip frequently bought upsell
function skipFrequentlyBought() {
    const modal = document.getElementById('frequentlyBoughtModal');
    modal.classList.remove('active');
    
    // Show clearance upsell if available
    const clearanceUpsells = getClearanceUpsells();
    if (clearanceUpsells.length > 0) {
        showClearanceUpsell(clearanceUpsells);
    } else {
        proceedToCheckout();
    }
}

// Continue to clearance upsell
function continueToClearanceUpsell() {
    const modal = document.getElementById('frequentlyBoughtModal');
    modal.classList.remove('active');
    
    const clearanceUpsells = getClearanceUpsells();
    if (clearanceUpsells.length > 0) {
        showClearanceUpsell(clearanceUpsells);
    } else {
        proceedToCheckout();
    }
}

// Skip clearance upsell
function skipClearanceUpsell() {
    const modal = document.getElementById('clearanceUpsellModal');
    modal.classList.remove('active');
    
    proceedToCheckout();
}

// Show checkout modal
function showCheckoutModal(shippingMethod, shippingEmail, shippingName, shippingAddress, shippingCity, shippingState, shippingZip, subtotal, shippingCost) {
    const total = subtotal + shippingCost;
    const checkoutBody = document.getElementById('checkoutBody');
    const checkoutModal = document.getElementById('checkoutModal');
    
    checkoutBody.innerHTML = `
        <div class="checkout-section">
            <h3>Order Summary</h3>
            <div class="order-items">
                ${cart.map(item => `
                    <div class="checkout-item">
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-totals">
                <div class="order-line">
                    <span>Subtotal:</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="order-line">
                    <span>Shipping:</span>
                    <span>$${shippingCost.toFixed(2)}</span>
                </div>
                <div class="order-line order-total">
                    <span>Total:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="checkout-section">
            <h3>${shippingMethod === 'pickup' ? 'Pickup Information' : 'Shipping Address'}</h3>
            <div class="shipping-summary">
                ${shippingMethod === 'pickup' ? `
                    <p><strong>Pickup Order</strong></p>
                    <p>You will pick up your order at our location:</p>
                    <p>47 Roselle St<br>Mineola, NY 11501</p>
                ` : `
                    <p><strong>${shippingName}</strong></p>
                    <p>${shippingAddress}</p>
                    <p>${shippingCity}, ${shippingState} ${shippingZip}</p>
                    <p>Shipping: ${shippingMethod.charAt(0).toUpperCase() + shippingMethod.slice(1)}</p>
                `}
            </div>
        </div>
        
        <div class="checkout-section">
            <h3>Payment Method</h3>
            <div class="payment-options">
                <label class="payment-option">
                    <input type="radio" name="paymentMethod" value="card" checked>
                    <span>Credit/Debit Card</span>
                </label>
                <label class="payment-option">
                    <input type="radio" name="paymentMethod" value="cash">
                    <span>Cash on Delivery</span>
                </label>
            </div>
            <div id="cardDetails" class="card-details">
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" id="cardNumber" class="form-input" placeholder="1234 5678 9012 3456" maxlength="19">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiry Date</label>
                        <input type="text" id="cardExpiry" class="form-input" placeholder="MM/YY" maxlength="5">
                    </div>
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="text" id="cardCVV" class="form-input" placeholder="123" maxlength="3">
                    </div>
                </div>
            </div>
        </div>
        
        <div class="checkout-actions">
            <button class="cancel-btn" onclick="closeCheckout()">Cancel</button>
            <button class="submit-order-btn confirm-order-btn" onclick="submitOrder()">Confirm Order</button>
        </div>
    `;
    
    // Setup payment method toggle
    setupPaymentToggle();
    
    checkoutModal.classList.add('active');
}

// Proceed to checkout (original checkout flow)
function proceedToCheckout() {
    // Close any open upsell modals
    document.getElementById('frequentlyBoughtModal')?.classList.remove('active');
    document.getElementById('clearanceUpsellModal')?.classList.remove('active');
    
    // Continue with original checkout flow
    const shippingMethod = document.getElementById('cartShippingMethod')?.value || 'standard';
    const shippingEmail = document.getElementById('cartShippingEmail')?.value || '';
    const shippingName = document.getElementById('cartShippingName')?.value;
    const shippingAddress = document.getElementById('cartShippingAddress')?.value;
    const shippingCity = document.getElementById('cartShippingCity')?.value;
    const shippingState = document.getElementById('cartShippingState')?.value;
    const shippingZip = document.getElementById('cartShippingZip')?.value;
    
    // Validate email (always required)
    if (!shippingEmail || !isValidEmail(shippingEmail)) {
        alert('Please enter a valid email address.');
        document.getElementById('cartShippingEmail')?.focus();
        return;
    }
    
    // Basic validation (only required if not pickup)
    if (shippingMethod !== 'pickup') {
        if (!shippingName || !shippingAddress || !shippingCity || !shippingState || !shippingZip) {
            alert('Please fill in all shipping address fields in the cart.');
            return;
        }
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = calculateShipping(subtotal, shippingMethod);
    
    // Show checkout modal
    showCheckoutModal(shippingMethod, shippingEmail, shippingName, shippingAddress, shippingCity, shippingState, shippingZip, subtotal, shippingCost);
}

// Checkout function (now just triggers upsells)
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Show upsells before checkout
    showUpsells();
}

// Toggle card details based on payment method
function setupPaymentToggle() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const cardDetails = document.getElementById('cardDetails');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
}

// Close checkout modal
function closeCheckout() {
    const checkoutModal = document.getElementById('checkoutModal');
    checkoutModal.classList.remove('active');
}

// Submit order
async function submitOrder() {
    // Get shipping info from cart panel
    const shippingMethod = document.getElementById('cartShippingMethod')?.value || 'standard';
    const shippingEmail = document.getElementById('cartShippingEmail')?.value || '';
    const shippingName = document.getElementById('cartShippingName')?.value;
    const shippingAddress = document.getElementById('cartShippingAddress')?.value;
    const shippingCity = document.getElementById('cartShippingCity')?.value;
    const shippingState = document.getElementById('cartShippingState')?.value;
    const shippingZip = document.getElementById('cartShippingZip')?.value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    
    // Validate email (always required)
    if (!shippingEmail || !isValidEmail(shippingEmail)) {
        alert('Please enter a valid email address.');
        document.getElementById('cartShippingEmail')?.focus();
        return;
    }
    
    // Basic validation (only required if not pickup)
    if (shippingMethod !== 'pickup') {
        if (!shippingName || !shippingAddress || !shippingCity || !shippingState || !shippingZip) {
            alert('Please fill in all shipping address fields in the cart.');
            return;
        }
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = calculateShipping(subtotal, shippingMethod);
    
    // Handle Cash on Delivery
    if (paymentMethod === 'cash') {
        const submitBtn = document.querySelector('.submit-order-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: cart,
                    shippingEmail: shippingEmail,
                    shippingAddress: shippingMethod === 'pickup' ? null : {
                        name: shippingName,
                        address: shippingAddress,
                        city: shippingCity,
                        state: shippingState,
                        zip: shippingZip,
                    },
                    shippingMethod: shippingMethod,
                    shippingCost: shippingCost,
                    subtotal: subtotal,
                    paymentMethod: 'cash',
                    isPickup: shippingMethod === 'pickup',
                }),
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Save cart to history before clearing
                saveCartToHistory();
                // Show thank you page
                showThankYou(data.orderId, data);
            } else {
                throw new Error(data.error || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Error placing order: ' + error.message);
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
        return;
    }
    
    // Handle Stripe payment for card payments
    const submitBtn = document.querySelector('.submit-order-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                items: cart,
                shippingEmail: shippingEmail,
                shippingAddress: shippingMethod === 'pickup' ? null : {
                    name: shippingName,
                    address: shippingAddress,
                    city: shippingCity,
                    state: shippingState,
                    zip: shippingZip,
                },
                shippingMethod: shippingMethod,
                shippingCost: shippingCost,
                isPickup: shippingMethod === 'pickup',
            }),
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Store order info for after Stripe payment
        if (data.orderId) {
            localStorage.setItem('pendingOrderId', data.orderId);
            localStorage.setItem('pendingOrderEmail', shippingEmail);
            // Save cart to history before redirecting to Stripe
            saveCartToHistory();
        }
        
        // Redirect to Stripe Checkout
        window.location.href = data.url;
    } catch (error) {
        console.error('Error processing payment:', error);
        alert('Error processing payment: ' + error.message);
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Save cart to localStorage (persists across sessions)
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Note: Cart history is only saved when orders are placed, not on every cart update
}

// Save current cart to history
function saveCartToHistory() {
    try {
        const cartHistory = JSON.parse(localStorage.getItem('cartHistory') || '[]');
        
        // Create cart snapshot
        const cartSnapshot = {
            date: new Date().toISOString(),
            items: JSON.parse(JSON.stringify(cart)), // Deep copy
        };
        
        // Add to history
        cartHistory.push(cartSnapshot);
        
        // Keep only last 10 carts
        if (cartHistory.length > 10) {
            cartHistory.shift();
        }
        
        localStorage.setItem('cartHistory', JSON.stringify(cartHistory));
    } catch (error) {
        console.error('Error saving cart to history:', error);
    }
}

// Load cart from localStorage
function loadCart() {
    // Check if there's a reorder request from profile page
    const reorderCart = localStorage.getItem('reorderCart');
    const reorderQuantities = localStorage.getItem('reorderProductQuantities');
    
    if (reorderCart && reorderQuantities) {
        // Load reorder cart
        const reorderItems = JSON.parse(reorderCart);
        const reorderQty = JSON.parse(reorderQuantities);
        
        // Clear existing cart
        cart = [];
        productQuantities = {};
        
        // Populate cart with reorder items
        reorderItems.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                // Use current product price (may have changed)
                const currentPrice = getProductPrice(product);
                cart.push({
                    id: item.id,
                    name: item.name,
                    price: currentPrice,
                    quantity: item.quantity,
                    sku: product.sku || '',
                    description: product.description || ''
                });
                productQuantities[item.id] = item.quantity;
            }
        });
        
        // Clear reorder flags
        localStorage.removeItem('reorderCart');
        localStorage.removeItem('reorderProductQuantities');
        
        updateCart();
        saveCart();
        renderProducts(); // Re-render to show updated quantities
    } else {
        // Normal cart load
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            
            // Update prices with user-specific prices if available
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    item.price = getProductPrice(product); // Update to current user price
                }
                productQuantities[item.id] = item.quantity;
            });
            
            updateCart();
            saveCart(); // Save updated prices
        }
    }
}
