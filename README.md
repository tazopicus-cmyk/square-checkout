# Square Checkout Store

A simple shopping cart and checkout system using Square Orders API.

## Overview
- Product catalog with AI agents
- Shopping cart (client-side)
- Checkout creates Square order → redirects to payment

## Setup

### 1. Square Developer Account
1. Go to https://developer.squareup.com
2. Create a Square Developer account
3. Create an application
4. Get your **Access Token** (starts with `EAAA`)

### 2. Environment Variables
Create `.env.local`:
```
SQUARE_ACCESS_TOKEN=your_access_token_here
SQUARE_LOCATION_ID=your_location_id
SQUARE_ENVIRONMENT=sandbox  # or 'production'
```

### 3. Get Location ID
1. In Square Developer Dashboard → Locations
2. Copy your Location ID (starts with `L...`)

### 4. Run Locally
```bash
npm install
npm run dev
```

### 5. Deploy to Vercel
Set environment variables in Vercel project settings.

## Products (hardcoded for simplicity)
- Social Media Manager: $79
- Local SEO: $79
- Email Newsletter: $79
- Event Agent: $79
- Brewery Bundle: $199

## Security Notes
- Prices are calculated on SERVER, never trusted from client
- Only product IDs are sent from frontend
- Server validates price from hardcoded product list

## Files
- `src/app/page.tsx` - Product catalog + cart UI
- `src/app/api/checkout/route.ts` - Square order creation
- `src/lib/products.ts` - Product definitions

## License
MIT
