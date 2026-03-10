# BdFlow - Backend API

Backend server for BdFlow application with MongoDB and Cloudinary integration.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bdflow?retryWrites=true&w=majority

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development

# Price Request Mailer
PRICE_REQUEST_MAIL_HOST=smtp.office365.com
PRICE_REQUEST_MAIL_PORT=587
PRICE_REQUEST_MAIL_USER=notifications@yourdomain.com
PRICE_REQUEST_MAIL_PASS=your_smtp_password
PRICE_REQUEST_MAIL_TO=admin@yourdomain.com
# Optional custom sender, defaults to PRICE_REQUEST_MAIL_USER
# PRICE_REQUEST_MAIL_FROM=bdflow@yourdomain.com

> The price request mailer settings are used when visitors send their quote cart via the new `/api/price-requests` endpoint. Configure these with any SMTP provider (Office365, Gmail, SendGrid, etc.).

# Price Request Mailer
PRICE_REQUEST_MAIL_HOST=smtp.office365.com
PRICE_REQUEST_MAIL_PORT=587
PRICE_REQUEST_MAIL_USER=notifications@yourdomain.com
PRICE_REQUEST_MAIL_PASS=your_smtp_password
PRICE_REQUEST_MAIL_TO=admin@yourdomain.com
# Optional custom sender, defaults to PRICE_REQUEST_MAIL_USER
# PRICE_REQUEST_MAIL_FROM=bdflow@yourdomain.com
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (Free tier - 512MB)
4. Create a database user
5. Whitelist your IP (or use 0.0.0.0/0 for development)
6. Get your connection string and update `MONGODB_URI`

### 4. Cloudinary Setup

1. Go to [Cloudinary](https://cloudinary.com/)
2. Create a free account (10GB storage)
3. Get your credentials from the dashboard
4. Update the `.env` file with your Cloudinary credentials

### 5. Start the Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Upload
- `POST /api/images/upload` - Upload image to Cloudinary
- `DELETE /api/images/:publicId` - Delete image from Cloudinary

### Price Requests
- `POST /api/price-requests` - Send the visitor's quote cart to the configured admin mailbox

### Health Check
- `GET /api/health` - Server health status

## Initial Data Migration

To migrate your existing products to MongoDB, run:

```bash
node scripts/seedProducts.js
```

## Production Deployment

### Environment Variables
Update `.env` for production:
- Set `NODE_ENV=production`
- Update `MONGODB_URI` with production database
- Ensure Cloudinary credentials are correct

### Deploy Options
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Free tier available
- **Render**: Good MongoDB integration
- **Vercel/Netlify**: Serverless functions (requires slight modifications)

## Notes
- Images are automatically optimized to 800x800px
- File size limit: 5MB per image
- Supported formats: jpg, jpeg, png, webp
