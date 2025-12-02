'use client';

import { useState, useEffect } from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Stats {
  total_trades: number;
  open_trades: number;
  closed_trades: number;
  total_pnl: number;
  win_rate: number;
  avg_win: number;
  avg_loss: number;
}

interface Config {
  current_level: string;
  is_enabled: boolean;
  min_delta: number;
  max_delta: number;
}

interface Trade {
  id: string;
  symbol: string;
  expiration: string;
  call_sell_strike: number;
  call_buy_strike: number;
  put_sell_strike: number;
  put_buy_strike: number;
  credit: number;
  max_risk: number;
  level: string;
  status: string;
  pnl?: number;
  settlement_price?: number;
  created_at: string;
  call_delta?: number;
  put_delta?: number;
  entry_price?: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'spx' | 'rut'>('spx');
  const [stats, setStats] = useState<Stats | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const [statsRes, configRes, tradesRes] = await Promise.all([
        fetch(`/api/stats/${activeTab}`),
        fetch(`/api/config/${activeTab}`),
        fetch(`/api/trades/${activeTab}?limit=10`)
      ]);

      if (!statsRes.ok || !configRes.ok || !tradesRes.ok) {
        console.error('API Error:', {
          stats: statsRes.status,
          config: configRes.status,
          trades: tradesRes.status
        });
        setStats({ total_trades: 0, open_trades: 0, closed_trades: 0, total_pnl: 0, win_rate: 0, avg_win: 0, avg_loss: 0 });
        setConfig({ current_level: 'N/A', is_enabled: false, min_delta: 0, max_delta: 0 });
        setTrades([]);
        setLoading(false);
        return;
      }

      const [statsData, configData, tradesData] = await Promise.all([
        statsRes.json(),
        configRes.json(),
        tradesRes.json()
      ]);

      setStats(statsData);
      setConfig(configData);
      
      // Process trades: keep only the most recent trade per level as "open", close others
      if (Array.isArray(tradesData)) {
        const levelMap = new Map<string, Trade>();
        
        // Group trades by level, keeping only the most recent one
        tradesData.forEach((trade: Trade) => {
          const existing = levelMap.get(trade.level);
          if (!existing || new Date(trade.created_at) > new Date(existing.created_at)) {
            levelMap.set(trade.level, trade);
          }
        });
        
        // Mark trades: most recent per level stays open, others are closed
        const processedTrades = tradesData.map((trade: Trade) => {
          const mostRecent = levelMap.get(trade.level);
          if (mostRecent && trade.id === mostRecent.id) {
            return trade; // Keep as is (should be open)
          } else {
            // Close this trade
            return { ...trade, status: 'closed' };
          }
        });
        
        setTrades(processedTrades);
      } else {
        setTrades([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setStats({ total_trades: 0, open_trades: 0, closed_trades: 0, total_pnl: 0, win_rate: 0, avg_win: 0, avg_loss: 0 });
      setConfig({ current_level: 'N/A', is_enabled: false, min_delta: 0, max_delta: 0 });
      setTrades([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Settlement Orchestrator</h1>
          <p className="text-slate-400">Iron Condor Trading Dashboard</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('spx')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'spx'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            SPX
          </button>
          <button
            onClick={() => setActiveTab('rut')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'rut'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/50'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            RUT
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Total P&L</span>
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div className={`text-3xl font-bold ${(stats?.total_pnl || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${(stats?.total_pnl || 0).toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Win Rate</span>
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-white">
              {stats?.win_rate || 0}%
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Open Trades</span>
              <Activity className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-white">
              {stats?.open_trades || 0}
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Current Level</span>
              <TrendingDown className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-white">
              {config?.current_level || 'N/A'}
            </div>
          </div>
        </div>

        {/* Config Info */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-slate-400 text-sm">Status</span>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-3 h-3 rounded-full ${config?.is_enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-white font-semibold">{config?.is_enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Delta Range</span>
              <div className="text-white font-semibold mt-1">
                {config?.min_delta} - {config?.max_delta}
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-sm">Total Trades</span>
              <div className="text-white font-semibold mt-1">
                {stats?.total_trades || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Recent Trades</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 text-sm font-semibold pb-3">Date</th>
                  <th className="text-right text-slate-400 text-sm font-semibold pb-3">SPX Entry</th>
                  <th className="text-center text-slate-400 text-sm font-semibold pb-3">Deltas</th>
                  <th className="text-center text-slate-400 text-sm font-semibold pb-3">Level</th>
                  <th className="text-center text-slate-400 text-sm font-semibold pb-3">Expiration</th>
                  <th className="text-center text-slate-400 text-sm font-semibold pb-3">Call Strikes</th>
                  <th className="text-center text-slate-400 text-sm font-semibold pb-3">Put Strikes</th>
                  <th className="text-center text-slate-400 text-sm font-semibold pb-3">Status</th>
                  <th className="text-right text-slate-400 text-sm font-semibold pb-3">SPX Settlement</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b border-slate-700/50">
                    <td className="py-4 text-white text-sm">
                      {new Date(trade.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-right text-white font-semibold text-sm">
                      {trade.entry_price ? trade.entry_price.toFixed(2) : '-'}
                    </td>
                    <td className="py-4 text-center text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-green-500">C: {trade.call_delta ? trade.call_delta.toFixed(4) : '0.0000'}</span>
                        <span className="text-red-500">P: {trade.put_delta ? trade.put_delta.toFixed(4) : '0.0000'}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-400">
                        {trade.level}
                      </span>
                    </td>
                    <td className="py-4 text-center text-white text-sm">
                      {new Date(trade.expiration).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-center text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-green-500">Sell: {trade.call_sell_strike}</span>
                        <span className="text-green-500">Buy: {trade.call_buy_strike}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-red-500">Sell: {trade.put_sell_strike}</span>
                        <span className="text-red-500">Buy: {trade.put_buy_strike}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        trade.status === 'open' 
                          ? 'bg-yellow-500/20 text-yellow-500' 
                          : trade.pnl && trade.pnl > 0
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}>
                        {trade.status === 'open' ? 'Open' : trade.pnl && trade.pnl > 0 ? 'Max Win' : 'Max Loss'}
                      </span>
                    </td>
                    <td className="py-4 text-right text-white font-semibold text-sm">
                      {trade.settlement_price ? trade.settlement_price.toFixed(2) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
