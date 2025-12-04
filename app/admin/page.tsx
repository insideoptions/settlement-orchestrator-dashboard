'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, Save, X, Trash2 } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  level: string;
  expiration: string;
  call_buy_strike: number;
  call_sell_strike: number;
  put_sell_strike: number;
  put_buy_strike: number;
  credit: number;
  max_risk: number;
  entry_price: number;
  call_delta: number;
  put_delta: number;
  status: string;
  pnl: number | null;
  settlement_price: number | null;
  created_at: string;
  closed_at: string | null;
}

interface BotConfig {
  symbol: string;
  current_level: string;
  enabled: boolean;
}

export default function AdminPanel() {
  const router = useRouter();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [configs, setConfigs] = useState<BotConfig[]>([]);
  const [editingTrade, setEditingTrade] = useState<string | null>(null);
  const [editedTrade, setEditedTrade] = useState<Partial<Trade>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<'SPXW' | 'RUT'>('SPXW');

  useEffect(() => {
    fetchData();
  }, [selectedSymbol]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tradesRes, configsRes] = await Promise.all([
        fetch(`/api/trades?symbol=${selectedSymbol}&limit=20`),
        fetch('/api/config')
      ]);

      if (tradesRes.ok) {
        const tradesData = await tradesRes.json();
        setTrades(tradesData);
      }

      if (configsRes.ok) {
        const configsData = await configsRes.json();
        setConfigs(configsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (trade: Trade) => {
    setEditingTrade(trade.id);
    setEditedTrade({ ...trade });
  };

  const cancelEditing = () => {
    setEditingTrade(null);
    setEditedTrade({});
  };

  const updateField = (field: keyof Trade, value: any) => {
    setEditedTrade(prev => ({ ...prev, [field]: value }));
  };

  const saveTrade = async () => {
    if (!editingTrade || !editedTrade) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/update-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTrade,
          symbol: selectedSymbol,
          updates: editedTrade
        })
      });

      if (response.ok) {
        await fetchData();
        setEditingTrade(null);
        setEditedTrade({});
      } else {
        alert('Failed to update trade');
      }
    } catch (error) {
      console.error('Error saving trade:', error);
      alert('Error saving trade');
    } finally {
      setSaving(false);
    }
  };

  const deleteTrade = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return;

    try {
      const response = await fetch('/api/admin/delete-trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, symbol: selectedSymbol })
      });

      if (response.ok) {
        await fetchData();
      } else {
        alert('Failed to delete trade');
      }
    } catch (error) {
      console.error('Error deleting trade:', error);
      alert('Error deleting trade');
    }
  };

  const updateBotLevel = async (symbol: string, newLevel: string) => {
    try {
      const response = await fetch('/api/admin/update-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, level: newLevel })
      });

      if (response.ok) {
        await fetchData();
      } else {
        alert('Failed to update bot level');
      }
    } catch (error) {
      console.error('Error updating level:', error);
      alert('Error updating level');
    }
  };

  const currentConfig = configs.find(c => c.symbol === selectedSymbol);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm mt-1">v1.0.1</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Symbol Selector */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedSymbol('SPXW')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedSymbol === 'SPXW'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Short SPX
          </button>
          <button
            onClick={() => setSelectedSymbol('RUT')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              selectedSymbol === 'RUT'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            RUT
          </button>
        </div>

        {/* Bot Level Editor */}
        {currentConfig && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Bot Configuration</h2>
            <div className="flex items-center gap-4">
              <label className="text-slate-300">Current Level:</label>
              <input
                type="text"
                value={currentConfig.current_level}
                onChange={(e) => updateBotLevel(selectedSymbol, e.target.value)}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
              <span className={`px-3 py-1 rounded-full text-sm ${
                currentConfig.enabled ? 'bg-green-600' : 'bg-red-600'
              } text-white`}>
                {currentConfig.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        )}

        {/* Trades Table */}
        <div className="bg-slate-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Level</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Entry</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Call Strikes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Put Strikes</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Credit</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Settlement</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">P&L</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                      Loading...
                    </td>
                  </tr>
                ) : trades.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-400">
                      No trades found
                    </td>
                  </tr>
                ) : (
                  trades.map((trade) => {
                    const isEditing = editingTrade === trade.id;
                    const displayTrade = isEditing ? { ...trade, ...editedTrade } : trade;

                    return (
                      <tr key={trade.id} className="hover:bg-slate-750">
                        <td className="px-4 py-3 text-sm text-slate-300">
                          {new Date(trade.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={displayTrade.level}
                              onChange={(e) => updateField('level', e.target.value)}
                              className="w-24 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                            />
                          ) : (
                            <span className="text-blue-400 font-semibold text-sm">{trade.level}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={displayTrade.entry_price || ''}
                              onChange={(e) => updateField('entry_price', parseFloat(e.target.value))}
                              className="w-24 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                            />
                          ) : (
                            <span className="text-slate-300 text-sm">{trade.entry_price ? trade.entry_price.toFixed(2) : '-'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <div className="flex gap-1">
                              <input
                                type="number"
                                step="1"
                                value={displayTrade.call_buy_strike || ''}
                                onChange={(e) => updateField('call_buy_strike', parseFloat(e.target.value))}
                                className="w-20 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                                placeholder="Buy"
                              />
                              <input
                                type="number"
                                step="1"
                                value={displayTrade.call_sell_strike || ''}
                                onChange={(e) => updateField('call_sell_strike', parseFloat(e.target.value))}
                                className="w-20 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                                placeholder="Sell"
                              />
                            </div>
                          ) : (
                            <span className="text-green-400 text-sm">
                              {trade.call_buy_strike} / {trade.call_sell_strike}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <div className="flex gap-1">
                              <input
                                type="number"
                                step="1"
                                value={displayTrade.put_sell_strike || ''}
                                onChange={(e) => updateField('put_sell_strike', parseFloat(e.target.value))}
                                className="w-20 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                                placeholder="Sell"
                              />
                              <input
                                type="number"
                                step="1"
                                value={displayTrade.put_buy_strike || ''}
                                onChange={(e) => updateField('put_buy_strike', parseFloat(e.target.value))}
                                className="w-20 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                                placeholder="Buy"
                              />
                            </div>
                          ) : (
                            <span className="text-red-400 text-sm">
                              {trade.put_sell_strike} / {trade.put_buy_strike}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={displayTrade.credit || ''}
                              onChange={(e) => updateField('credit', parseFloat(e.target.value))}
                              className="w-20 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                            />
                          ) : (
                            <span className="text-slate-300 text-sm">${trade.credit ? trade.credit.toFixed(2) : '0.00'}</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={displayTrade.settlement_price || ''}
                              onChange={(e) => updateField('settlement_price', e.target.value ? parseFloat(e.target.value) : null)}
                              className="w-24 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                            />
                          ) : (
                            <span className="text-slate-300 text-sm">
                              {trade.settlement_price ? trade.settlement_price.toFixed(2) : '-'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <input
                              type="number"
                              step="0.01"
                              value={displayTrade.pnl || ''}
                              onChange={(e) => updateField('pnl', e.target.value ? parseFloat(e.target.value) : null)}
                              className="w-24 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                            />
                          ) : (
                            <span className={`text-sm font-semibold ${
                              trade.pnl === null ? 'text-slate-400' :
                              trade.pnl > 0 ? 'text-green-400' : 'text-red-400'
                            }`}>
                              {trade.pnl !== null ? `$${trade.pnl.toFixed(2)}` : '-'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <select
                              value={displayTrade.status}
                              onChange={(e) => updateField('status', e.target.value)}
                              className="px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 text-sm"
                            >
                              <option value="open">Open</option>
                              <option value="Closed">Closed</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              trade.status === 'open' ? 'bg-green-600' : 'bg-slate-600'
                            } text-white`}>
                              {trade.status}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <button
                                onClick={saveTrade}
                                disabled={saving}
                                className="p-1 bg-green-600 hover:bg-green-700 text-white rounded transition-colors disabled:opacity-50"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="p-1 bg-slate-600 hover:bg-slate-700 text-white rounded transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => startEditing(trade)}
                                className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteTrade(trade.id)}
                                className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
