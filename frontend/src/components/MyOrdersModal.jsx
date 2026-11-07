import React, { useState, useEffect } from 'react';
import { X, Package, Clock, CheckCircle2, Truck, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

export default function MyOrdersModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders/my-orders?user_id=${user.id || ''}&email=${encodeURIComponent(user.email || '')}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchUserOrders();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-flipkart-blue text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package size={20} />
            <h2 className="font-bold text-base sm:text-lg">My Orders & Purchases</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchUserOrders}
              className="p-1 rounded hover:bg-white/20 text-white transition"
              title="Refresh Orders"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 text-white transition"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 space-y-4">
          {!user ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              Please log in to view your orders.
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-700">No orders placed yet</h3>
              <p className="text-xs text-gray-400 mt-1">Start shopping Big Billion Day deals and your orders will show up here.</p>
            </div>
          ) : (
            orders.map((ord) => (
              <div key={ord.id} className="bg-white rounded border border-gray-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <span className="font-bold text-xs text-gray-900">{ord.order_number}</span>
                    <div className="text-[11px] text-gray-400">
                      Placed on {new Date(ord.created_at).toLocaleDateString()} at {new Date(ord.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    ord.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    ord.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                    ord.status === 'DELIVERED' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ord.status}
                  </span>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {(ord.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-12 h-12 object-contain rounded border p-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-gray-900 truncate">{item.title}</h4>
                        <div className="text-[11px] text-gray-500">
                          Qty: {item.quantity} • ₹{Number(item.price).toLocaleString('en-IN')} each
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="text-gray-500">
                    Payment: <span className="font-medium text-gray-700">{ord.payment_method || 'COD'}</span>
                  </div>
                  <div className="font-bold text-sm text-gray-900">
                    Total: ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
