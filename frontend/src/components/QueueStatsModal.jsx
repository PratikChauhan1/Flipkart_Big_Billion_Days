import React, { useState, useEffect } from 'react';
import { X, Activity, RefreshCw, Zap, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';
import { API_BASE } from '../config';

export default function QueueStatsModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders/queue-stats`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
      const interval = setInterval(fetchStats, 1500);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-yellow-400 animate-pulse" />
            <div>
              <h3 className="font-bold text-sm">Big Billion Day Queue Engine</h3>
              <p className="text-[11px] text-blue-200">Real-Time High Concurrency Order Pipeline</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-yellow-900 flex items-start gap-2">
            <Flame size={16} className="text-yellow-600 shrink-0 fill-yellow-600 mt-0.5" />
            <p>
              When thousands of users click <strong>"BUY NOW"</strong> simultaneously on limited deals, our FIFO queue ensures atomic stock verification without overselling!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-center">
              <span className="text-gray-500 font-semibold block text-[11px]">ACTIVE QUEUE</span>
              <span className="text-2xl font-black text-blue-700">{stats?.activeQueueLength ?? 0}</span>
              <span className="text-[10px] text-gray-400 block">Orders Waiting</span>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded text-center">
              <span className="text-gray-500 font-semibold block text-[11px]">CONFIRMED ORDERS</span>
              <span className="text-2xl font-black text-green-700">{stats?.totalCompleted ?? 0}</span>
              <span className="text-[10px] text-gray-400 block">Processed Atomically</span>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded text-center">
              <span className="text-gray-500 font-semibold block text-[11px]">PEAK CONCURRENCY</span>
              <span className="text-2xl font-black text-purple-700">{stats?.peakQueueLength ?? 0}</span>
              <span className="text-[10px] text-gray-400 block">Simultaneous Rush</span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-center">
              <span className="text-gray-500 font-semibold block text-[11px]">TOTAL ENQUEUED</span>
              <span className="text-2xl font-black text-amber-700">{stats?.totalEnqueued ?? 0}</span>
              <span className="text-[10px] text-gray-400 block">Transactions</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded border border-gray-200 space-y-1.5 text-gray-600">
            <div className="flex items-center gap-2 text-green-600 font-semibold">
              <CheckCircle2 size={14} /> Database Mutex / Inventory Lock Active
            </div>
            <div className="flex items-center gap-2 text-flipkart-blue font-semibold">
              <Zap size={14} className="fill-flipkart-blue" /> Average Processing: 500ms per order
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <ShieldCheck size={14} /> Zero Race Condition Stock Guarantee
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-flipkart-blue hover:bg-flipkart-darkBlue text-white font-bold py-2 px-4 rounded text-xs uppercase tracking-wider transition"
          >
            Got it, Return to Store
          </button>
        </div>

      </div>
    </div>
  );
}
