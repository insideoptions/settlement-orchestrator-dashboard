# Settlement Orchestrator Dashboard

Beautiful Next.js dashboard for monitoring SPX and RUT iron condor trades from the Settlement Orchestrator Lambda.

## Features

- 📊 Real-time trade monitoring for SPX and RUT
- 💰 P&L tracking and statistics
- 📈 Win rate and performance metrics
- ⚙️ Bot configuration display
- 🔄 Auto-refresh every 30 seconds
- 🎨 Modern, responsive UI with Tailwind CSS

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
DATABASE_URL=postgresql://postgres:password@settlement-orchestrator-prod.csnioseu276v.us-east-1.rds.amazonaws.com:5432/postgres
```

4. Run development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploy to AWS Amplify

1. Push code to GitHub
2. Go to AWS Amplify Console
3. Connect your GitHub repository
4. Add environment variable: `DATABASE_URL`
5. Deploy!

The `amplify.yml` file is already configured for deployment.

## API Routes

- `GET /api/config/spx` - Get SPX bot configuration
- `GET /api/config/rut` - Get RUT bot configuration
- `GET /api/trades/spx` - Get SPX trades
- `GET /api/trades/rut` - Get RUT trades
- `GET /api/stats/spx` - Get SPX statistics
- `GET /api/stats/rut` - Get RUT statistics

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- PostgreSQL
- Lucide React Icons
