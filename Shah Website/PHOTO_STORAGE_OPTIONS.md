# Product Photo Storage Options

This document outlines different storage options for product photos (up to 3 photos per product, ~3000 SKUs).

## Storage Requirements

- **Total Products**: ~3,000 SKUs
- **Photos per Product**: Up to 3 photos
- **Total Photos**: ~9,000 photos maximum
- **Estimated Size per Photo**: 200-500 KB (optimized)
- **Total Storage Needed**: ~2-4 GB (with room for growth)

## Option 1: Local File System (Current Setup)

### Pros:
- ✅ Simple to implement
- ✅ No additional costs
- ✅ Fast access
- ✅ Works with current Railway deployment

### Cons:
- ❌ Limited by Railway's ephemeral storage (files may be lost on redeploy)
- ❌ Not ideal for production scaling
- ❌ No CDN benefits

### Implementation:
- Store images in `images/products/` directory
- Reference in products.json as: `"photos": ["product-123-1.jpg", "product-123-2.jpg"]`
- Server serves via: `/images/products/{filename}`

### Railway Considerations:
- Railway uses ephemeral storage - files may be lost on redeploy
- **Solution**: Use Railway's persistent volume or migrate to cloud storage

---

## Option 2: Railway Persistent Volume

### Pros:
- ✅ Persistent storage that survives redeploys
- ✅ No external service needed
- ✅ Fast access (same network)
- ✅ Easy to set up

### Cons:
- ❌ Railway-specific (vendor lock-in)
- ❌ Limited to Railway's storage limits
- ❌ No CDN (slower for global users)

### Implementation:
1. Add Railway Volume to your project
2. Mount volume to `/app/images` in Dockerfile
3. Store images in mounted volume
4. Same file structure as Option 1

### Cost:
- Railway volumes: ~$0.25/GB/month
- Estimated: $0.50-1.00/month for 2-4 GB

---

## Option 3: AWS S3 (Recommended for Production)

### Pros:
- ✅ Highly scalable
- ✅ 99.999999999% (11 9's) durability
- ✅ CDN integration (CloudFront)
- ✅ Industry standard
- ✅ Pay only for what you use
- ✅ Versioning and lifecycle policies

### Cons:
- ❌ Requires AWS account setup
- ❌ Slightly more complex implementation
- ❌ Additional service to manage

### Implementation:
1. Create S3 bucket (e.g., `shah-distributors-products`)
2. Set up IAM user with S3 access
3. Install AWS SDK: `npm install aws-sdk` or `@aws-sdk/client-s3`
4. Upload images via admin interface or script
5. Reference in products.json as: `"photos": ["s3://bucket/product-123-1.jpg"]` or use public URLs

### Cost:
- Storage: $0.023/GB/month (first 50 TB)
- PUT requests: $0.005 per 1,000 requests
- GET requests: $0.0004 per 1,000 requests
- **Estimated**: $0.05-0.10/month for storage + minimal request costs

### With CloudFront CDN:
- Faster global delivery
- Additional cost: ~$0.085/GB for data transfer (first 10 TB)

---

## Option 4: Cloudinary

### Pros:
- ✅ Built-in image optimization and transformations
- ✅ Automatic CDN
- ✅ Free tier available (25 GB storage, 25 GB bandwidth/month)
- ✅ Easy to use API
- ✅ Image transformations (resize, crop, format conversion)

### Cons:
- ❌ Free tier may not be enough for 3000 products
- ❌ Vendor lock-in
- ❌ Can get expensive at scale

### Implementation:
1. Sign up for Cloudinary account
2. Install: `npm install cloudinary`
3. Upload images via admin interface
4. Store Cloudinary URLs in products.json
5. Images automatically optimized and served via CDN

### Cost:
- Free tier: 25 GB storage, 25 GB bandwidth/month
- Paid: Starts at $89/month for 100 GB storage, 100 GB bandwidth
- **For 3000 products**: Likely need paid plan

---

## Option 5: Google Cloud Storage

### Pros:
- ✅ Similar to S3
- ✅ Good integration with other Google services
- ✅ Competitive pricing
- ✅ CDN via Cloud CDN

### Cons:
- ❌ Requires Google Cloud account
- ❌ Slightly different API than S3

### Implementation:
1. Create GCS bucket
2. Set up service account
3. Install: `npm install @google-cloud/storage`
4. Upload and serve images

### Cost:
- Storage: $0.020/GB/month (Standard storage)
- Network egress: $0.12/GB (first 10 TB)
- **Estimated**: Similar to S3

---

## Option 6: DigitalOcean Spaces

### Pros:
- ✅ S3-compatible API
- ✅ Simple pricing
- ✅ Includes CDN (free)
- ✅ Easy to use

### Cons:
- ❌ Smaller ecosystem than AWS
- ❌ Less enterprise features

### Implementation:
1. Create Space in DigitalOcean
2. Use S3-compatible SDK
3. Upload and serve images

### Cost:
- $5/month for 250 GB storage + 1 TB transfer
- **Perfect for your needs**: $5/month total

---

## Recommendation

### For Immediate Use (Development/Testing):
**Option 1: Local File System** - Quick to implement, works for now

### For Production:
**Option 2: Railway Persistent Volume** - If staying on Railway, easiest upgrade
**Option 6: DigitalOcean Spaces** - Best value ($5/month, includes CDN)
**Option 3: AWS S3** - Most scalable, industry standard

### Migration Path:
1. Start with local file system
2. When ready for production, migrate to Railway Volume or DigitalOcean Spaces
3. For larger scale, consider AWS S3 + CloudFront

---

## Implementation Steps (Any Option)

1. **Update Product Schema**: Add `photos` array to products.json
   ```json
   {
     "id": 1,
     "sku": "GM-001",
     "photos": ["gm-001-1.jpg", "gm-001-2.jpg", "gm-001-3.jpg"],
     ...
   }
   ```

2. **Create Admin Upload Interface**: Add image upload to admin.html

3. **Update Product Display**: Already implemented in script.js (photo column + lightbox)

4. **Image Optimization**: 
   - Resize to max 800x800px for thumbnails
   - Use WebP format for better compression
   - Compress JPEGs to 80% quality

5. **Naming Convention**: 
   - Use: `{sku}-{photo-number}.jpg`
   - Example: `GM-001-1.jpg`, `GM-001-2.jpg`

---

## Next Steps

1. Choose storage option based on budget and needs
2. Set up storage service
3. Create admin upload interface
4. Migrate existing photos (if any)
5. Test photo display and lightbox functionality

