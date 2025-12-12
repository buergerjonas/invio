# Invio - Personal Finance Automation Platform

A comprehensive personal finance automation platform built with Next.js, Cloudflare Workers, and Cloudflare D1 database.

## 🎯 Vision

Invio is designed to be a complete personal finance automation platform that:
- Designs personalized investment strategies tailored to each user's context
- Manages account structure (401k/IRA/Roth/Taxable/etc.)
- Provides ongoing guidance, alerts, and optimization
- Visualizes paths to Coast FIRE/retirement
- Helps users stay disciplined with behavior nudges

Think of it as: **"Portfolio Visualizer" × "Empower" × "NewRetirement"** with simple, trustworthy education.

## 🚀 Features

### ✅ Implemented

- **Authentication System** - Email/password authentication with session management
- **User Management** - User accounts with profile information
- **Subscription Tiers** - Free, Pro, Plus, and Lifetime plans with feature gating
- **Dashboard** - Clean, modern dashboard with navigation
- **Investment Strategy Designer** - Questionnaire-based strategy generation with:
  - Investment ladder (priority order)
  - Account priorities
  - Asset allocation recommendations
  - Contribution suggestions
  - Timeline projections

### 🚧 Coming Soon

- **Account Setup Assistant** - Step-by-step guidance for opening and funding accounts
- **Tax Optimizer** - Asset location optimization to minimize taxes
- **Retirement Planner** - FIRE, Coast FIRE, and traditional retirement calculators
- **Portfolio Tracker** - Track investments and compare vs targets
- **AI Portfolio Assistant** - AI-powered portfolio explanations and optimizations
- **Scenario Engine** - "What if" simulations for major life events

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Runtime**: Cloudflare Workers
- **Database**: Cloudflare D1 (SQLite)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Deployment**: Cloudflare Workers via OpenNext

## 📦 Getting Started

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Start

```bash
# Install dependencies
npm install

# Set up D1 database (see SETUP.md for details)
wrangler d1 create invio-db

# Update wrangler.jsonc with your database ID
# Then initialize schema
wrangler d1 execute invio-db --file=./db/schema.sql

# Generate TypeScript types
npm run cf-typegen

# Run development server
npm run dev
```

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   └── strategy/        # Strategy generation
│   ├── dashboard/           # Dashboard and features
│   │   ├── strategy/        # Investment Strategy Designer
│   │   ├── accounts/        # Account Setup Assistant
│   │   ├── retirement/      # Retirement Planner
│   │   ├── portfolio/       # Portfolio Tracker
│   │   ├── tax/             # Tax Optimizer
│   │   ├── ai/              # AI Portfolio Assistant
│   │   ├── scenarios/       # Scenario Engine
│   │   └── settings/        # User settings
│   └── page.tsx             # Landing page
├── lib/
│   ├── auth.ts              # Authentication utilities
│   ├── db.ts                # Database connection
│   └── subscriptions.ts     # Subscription management
db/
└── schema.sql               # Database schema
```

## 💳 Subscription Tiers

### Free
- Basic calculators
- Light strategy preview
- Limited access

### Pro ($10/month)
- Full investment strategy plan
- Account setup assistant
- PRO calculators
- Step-by-step optimization

### Plus ($20/month)
- Everything in Pro
- Portfolio tracker
- AI Portfolio Advisor
- Tax optimizer
- Personalized alerts
- PDF reports

### Lifetime ($200 one-time)
- Everything in Plus
- Lifetime access
- All future features

## 🗄️ Database Schema

The platform uses Cloudflare D1 (SQLite) with the following main tables:
- `users` - User accounts
- `subscriptions` - Subscription management
- `investment_strategies` - Generated strategies
- `accounts` - Investment accounts
- `account_setup_steps` - Setup progress tracking
- `portfolios` - Portfolio tracking
- `retirement_plans` - Retirement projections
- `scenarios` - What-if simulations
- `tax_optimizations` - Tax optimization results
- `ai_conversations` - AI assistant conversations

See `db/schema.sql` for the complete schema.

## 🚢 Deployment

```bash
# Build and deploy to Cloudflare Workers
npm run deploy
```

## 📝 Development

```bash
# Run development server
npm run dev

# Preview Cloudflare build locally
npm run preview

# Type check
npm run check

# Lint
npm run lint
```

## 🔐 Authentication

The platform uses cookie-based session authentication. Sessions are stored in HTTP-only cookies for security.

## 📚 Next Steps

1. **Payment Integration** - Add Stripe or Paddle for subscription payments
2. **Portfolio Integration** - Connect with Plaid/Truelayer for account linking
3. **AI Integration** - Add Cloudflare AI or OpenAI for portfolio assistant
4. **Email Notifications** - Set up Cloudflare Email Workers for alerts
5. **PDF Generation** - Add PDF report generation for strategies
6. **Advanced Features** - Implement remaining modules

## 📄 License

Private - All rights reserved

## 🤝 Contributing

This is a private project. For questions or suggestions, please contact the maintainer.
