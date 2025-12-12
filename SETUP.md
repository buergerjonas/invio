# Invio Platform Setup Guide

## Overview

Invio is a personal finance automation platform built with Next.js, Cloudflare Workers, and Cloudflare D1 database.

## Prerequisites

- Node.js 18+ installed
- Cloudflare account
- Wrangler CLI installed (`npm install -g wrangler`)

## Initial Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Cloudflare D1 Database

```bash
# Create a D1 database
wrangler d1 create invio-db

# This will output a database_id - copy it and update wrangler.jsonc
```

Update `wrangler.jsonc` with your database ID:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "invio-db",
    "database_id": "your-database-id-here"  // Replace with actual ID
  }
]
```

### 3. Initialize Database Schema

```bash
# Apply the schema
wrangler d1 execute invio-db --file=./db/schema.sql
```

### 4. Generate TypeScript Types

```bash
npm run cf-typegen
```

## Development

### Local Development

```bash
npm run dev
```

The app will run at http://localhost:3000

### Preview Cloudflare Build Locally

```bash
npm run preview
```

This builds and previews the app as it would run on Cloudflare Workers.

## Deployment

### Deploy to Cloudflare Workers

```bash
npm run deploy
```

## Database Management

### View Database in Local Development

```bash
wrangler d1 execute invio-db --local --command "SELECT * FROM users"
```

### Execute SQL Commands

```bash
# Production
wrangler d1 execute invio-db --command "YOUR SQL HERE"

# Local
wrangler d1 execute invio-db --local --command "YOUR SQL HERE"
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Authentication pages (login, register)
│   ├── api/             # API routes
│   ├── dashboard/       # Dashboard and feature modules
│   └── page.tsx         # Landing page
├── lib/
│   ├── auth.ts          # Authentication utilities
│   ├── db.ts            # Database connection
│   └── subscriptions.ts # Subscription management
db/
└── schema.sql           # Database schema
```

## Features Implemented

✅ Authentication (login/register)
✅ User management
✅ Subscription tiers (Free, Pro, Plus, Lifetime)
✅ Dashboard layout
✅ Investment Strategy Designer

## Features To Implement

- Account Setup Assistant
- Tax Optimizer
- Retirement Planner
- Portfolio Tracker
- AI Portfolio Assistant
- Scenario Engine
- Payment integration (Stripe/Paddle)

## Environment Variables

For production, set these in Cloudflare Workers:

- No environment variables needed for basic setup
- Add payment provider keys when implementing payments

## Troubleshooting

### Database Not Found

Make sure you've:
1. Created the D1 database
2. Updated `wrangler.jsonc` with the correct database ID
3. Run `npm run cf-typegen` to update types

### Authentication Issues

Check that:
- Database schema is applied correctly
- Session cookies are being set properly
- API routes are accessible

## Next Steps

1. Implement payment integration (Stripe or Paddle)
2. Add portfolio tracking with Plaid/Truelayer integration
3. Build AI assistant with Cloudflare AI or OpenAI
4. Add email notifications
5. Implement PDF report generation

