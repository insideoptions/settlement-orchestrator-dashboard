'use client';

import { useState, useEffect } from 'react';
import { Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  CurrentLevel: string;
  IsEnabled: boolean;
  DeltaMin: number;
  DeltaMax: number;
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'spx' | 'rut'>('spx');
  const [stats, setStats] = useState<Stats | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      const [statsRes, configRes, tradesRes] = await Promise.all([
        fetch(`/api/stats/${activeTab}`),
        fetch(`/api/config/${activeTab}`),
        fetch(`/api/trades/${activeTab}?limit=20`)
      ]);

      if (!statsRes.ok || !configRes.ok || !tradesRes.ok) {
        setStats({ total_trades: 0, open_trades: 0, closed_trades: 0, total_pnl: 0, win_rate: 0, avg_win: 0, avg_loss: 0 });
        setConfig({ CurrentLevel: 'N/A', IsEnabled: false, DeltaMin: 0, DeltaMax: 0 });
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
      
      const processedTrades = (tradesData || []).map((trade: Trade, index: number) => {
        if (index === 0) {
          return trade;
        }
        return { ...trade, status: 'closed' };
      });
      
      setTrades(processedTrades);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1419] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const lastClose = trades.length > 0 && trades[0].entry_price ? trades[0].entry_price : 0;

  return (
    <div className="min-h-screen bg-[#0f1419]">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <h1 className="text-2xl font-bold text-white">GO.ALGO</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-[#1a2332] px-4 py-2 rounded-lg border border-slate-700">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-green-500 text-sm font-semibold">BOT ACTIVE</span>
                <span className="text-slate-500 text-xs ml-2">Last check: {new Date().toLocaleTimeString()}</span>
              </div>
              <button 
                onClick={() => router.push('/admin')}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="Admin Panel"
              >
                <Settings className="w-5 h-5 text-slate-400" />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('spx')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'spx'
                ? 'bg-blue-600 text-white'
                : 'text-blue-400 hover:bg-slate-800'
            }`}
          >
            Short SPX
          </button>
          <button
            onClick={() => setActiveTab('rut')}
            className={`px-6 py-2 rounded-lg font-medium text-sm transition-all ${
              activeTab === 'rut'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            RUT
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#1a2332] to-[#151d2a] rounded-lg p-4 border border-slate-800 hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/50 transition-all duration-300 group">
            <div className="text-slate-500 text-xs mb-1 group-hover:text-slate-400 transition-colors">Total Iron Condors</div>
            <div className="text-white text-2xl font-bold group-hover:scale-105 transition-transform">{stats?.total_trades || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-[#1a2332] to-[#151d2a] rounded-lg p-4 border border-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300 group">
            <div className="text-slate-500 text-xs mb-1 group-hover:text-blue-400 transition-colors">Current Level</div>
            <div className="text-blue-400 text-2xl font-bold group-hover:text-blue-300 group-hover:scale-105 transition-all">{config?.CurrentLevel || 'N/A'}</div>
          </div>
          <div className="bg-gradient-to-br from-[#1a2332] to-[#151d2a] rounded-lg p-4 border border-slate-800 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-900/30 transition-all duration-300 group">
            <div className="text-slate-500 text-xs mb-1 group-hover:text-yellow-400 transition-colors">Open Trades</div>
            <div className="text-white text-2xl font-bold group-hover:text-yellow-400 group-hover:scale-105 transition-all">{stats?.open_trades || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-[#1a2332] to-[#151d2a] rounded-lg p-4 border border-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-900/30 transition-all duration-300 group">
            <div className="text-slate-500 text-xs mb-1 group-hover:text-purple-400 transition-colors">Last {activeTab.toUpperCase()} Close</div>
            <div className="text-purple-400 text-2xl font-bold group-hover:text-purple-300 group-hover:scale-105 transition-all">{lastClose ? lastClose.toFixed(2) : '-'}</div>
          </div>
        </div>

        {/* Trade Alerts Table */}
        <div className="bg-[#1a2332] rounded-lg border border-slate-800">
          <div className="p-4 border-b border-slate-800">
            <h2 className="text-white text-lg font-bold">Trade Alerts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left text-slate-500 text-xs font-semibold px-4 py-3 uppercase">Date</th>
                  <th className="text-right text-slate-500 text-xs font-semibold px-4 py-3 uppercase">{activeTab.toUpperCase()} Entry</th>
                  <th className="text-center text-slate-500 text-xs font-semibold px-4 py-3 uppercase">Deltas</th>
                  <th className="text-center text-slate-500 text-xs font-semibold px-4 py-3 uppercase">Level</th>
                  <th className="text-center text-slate-500 text-xs font-semibold px-4 py-3 uppercase">Expiration</th>
                  <th className="text-center text-slate-500 text-xs font-semibold px-4 py-3 uppercase">Call Strikes</th>
                  <th className="text-center text-slate-500 text-xs font-semibold px-4 py-3 uppercase">Put Strikes</th>
                  <th className="text-center text-slate-500 text-xs font-semibold px-4 py-3 uppercase">Status</th>
                  <th className="text-right text-slate-500 text-xs font-semibold px-4 py-3 uppercase">{activeTab.toUpperCase()} Settlement</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade) => (
                  <tr key={trade.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-4 text-white text-sm">
                      {new Date(trade.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4 text-right text-white font-semibold">
                      {trade.entry_price ? trade.entry_price.toFixed(2) : '-'}
                    </td>
                    <td className="px-4 py-4 text-center text-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-green-500">C: {trade.call_delta ? trade.call_delta.toFixed(4) : '0.0000'}</span>
                        <span className="text-red-500">P: {trade.put_delta ? trade.put_delta.toFixed(4) : '0.0000'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        trade.level.includes('1.') ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        trade.level === 'Level 2' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                        trade.level === 'Level 3' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        trade.level === 'Level 4' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {trade.level}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-white text-sm">
                      {new Date(trade.expiration).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                    </td>
                    <td className="px-4 py-4 text-center text-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-green-500">Sell: {trade.call_sell_strike}</span>
                        <span className="text-green-500">Buy: {trade.call_buy_strike}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-red-500">Sell: {trade.put_sell_strike}</span>
                        <span className="text-red-500">Buy: {trade.put_buy_strike}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${
                        trade.status === 'open' 
                          ? 'bg-yellow-600/20 text-yellow-500' 
                          : trade.pnl && trade.pnl > 0
                          ? 'bg-green-600/20 text-green-500'
                          : 'bg-red-600/20 text-red-500'
                      }`}>
                        {trade.status === 'open' ? 'Open' : trade.pnl && trade.pnl > 0 ? 'Max Win' : 'Max Loss'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-white font-semibold">
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
