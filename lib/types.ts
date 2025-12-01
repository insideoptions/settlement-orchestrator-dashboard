export interface BotConfig {
  id: number;
  is_enabled: boolean;
  current_level: string;
  min_delta: number;
  max_delta: number;
  updated_at: string;
  created_at: string;
}

export interface TradeAlert {
  id: string;
  symbol: string;
  expiration: string;
  call_buy_strike: number;
  call_sell_strike: number;
  put_sell_strike: number;
  put_buy_strike: number;
  credit: number;
  max_risk: number;
  level: string;
  status: 'open' | 'closed';
  settlement_price?: number;
  pnl?: number;
  closed_at?: string;
  created_at: string;
}

export interface ExecutionLog {
  id: number;
  symbol: string;
  date: string;
  executed_at: string;
}

export interface DashboardStats {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  totalPnL: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
}
