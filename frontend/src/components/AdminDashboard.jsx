import React, { useState, useEffect } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Activity, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  Zap, 
  ArrowUpRight,
  Search,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

export default function AdminDashboard({ onProductsUpdated }) {
  const { token } = useAuth();
  const [tab, setTab] = useState('products'); // 'products' | 'orders' | 'queue'
  
  // Products state
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    category: 'Mobiles',
    brand: 'Flipkart Assured',
    price: '',
    original_price: '',
    stock: '15',
    image_url: '',
    description: '',
    is_big_billion_deal: true
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderFilter, setOrderFilter] = useState('ALL');

  // Queue state
  const [queueStats, setQueueStats] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [simulationLog, setSimulationLog] = useState([]);

  // Fetch products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch queue stats
  const fetchQueueStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/queue-stats`);
      const data = await res.json();
      if (data.success) {
        setQueueStats(data.stats);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchQueueStats();
    const interval = setInterval(fetchQueueStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Add Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (data.success) {
        alert('Product added to Flipkart inventory!');
        setShowAddModal(false);
        setNewProduct({
          title: '',
          category: 'Mobiles',
          brand: 'Flipkart Assured',
          price: '',
          original_price: '',
          stock: '15',
          image_url: '',
          description: '',
          is_big_billion_deal: true
        });
        fetchProducts();
        if (onProductsUpdated) onProductsUpdated();
      } else {
        alert(data.message || 'Failed to add product');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        if (onProductsUpdated) onProductsUpdated();
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Quick Stock Update
  const handleUpdateStock = async (id, currentStock, delta) => {
    const newStock = Math.max(0, currentStock + delta);
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stock: newStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: newStock } : p));
        if (onProductsUpdated) onProductsUpdated();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/admin/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Simulate High Concurrency Orders Burst
  const handleSimulateBurst = async (count = 5) => {
    setSimulating(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders/simulate-burst`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count })
      });
      const data = await res.json();
      if (data.success) {
        setSimulationLog(prev => [
          `⚡ [${new Date().toLocaleTimeString()}] Burst triggered: ${count} users checked out concurrently!`,
          ...prev.slice(0, 8)
        ]);
        fetchQueueStats();
        setTimeout(fetchOrders, 2000);
        setTimeout(fetchProducts, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'ALL') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Top Header */}
      <div className="bg-white rounded-md p-5 border border-gray-200 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded">
              ADMIN CONTROL PANEL
            </span>
            <span className="text-xs text-gray-500 font-medium">Big Billion Days 2026</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">Flipkart Store Management</h1>
          <p className="text-xs text-gray-500">Manage catalog inventory, fulfill customer orders, and supervise the real-time queue.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded">
          <button
            onClick={() => setTab('products')}
            className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'products' ? 'bg-white text-flipkart-blue shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package size={14} />
            Products ({products.length})
          </button>
          <button
            onClick={() => { setTab('orders'); fetchOrders(); }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'orders' ? 'bg-white text-flipkart-blue shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag size={14} />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => { setTab('queue'); fetchQueueStats(); }}
            className={`px-3 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'queue' ? 'bg-white text-yellow-600 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity size={14} />
            Queue Monitor
          </button>
        </div>
      </div>

      {/* TAB 1: PRODUCTS MANAGEMENT */}
      {tab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Product Inventory & Stock</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-flipkart-blue hover:bg-flipkart-darkBlue text-white text-xs font-bold py-2 px-4 rounded flex items-center gap-1.5 shadow transition"
            >
              <Plus size={15} />
              Add New Product
            </button>
          </div>

          <div className="bg-white rounded-md border border-gray-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock Units</th>
                  <th className="p-3">Discount</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/80 transition">
                    <td className="p-3 flex items-center gap-3 min-w-[280px]">
                      <img 
                        src={prod.image_url} 
                        alt={prod.title} 
                        className="w-10 h-10 object-contain rounded bg-white p-0.5 border"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 line-clamp-1">{prod.title}</div>
                        <div className="text-[11px] text-gray-500">{prod.brand}</div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{prod.category}</td>
                    <td className="p-3 font-bold text-gray-900">₹{Number(prod.price).toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          prod.stock <= 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {prod.stock} in stock
                        </span>
                        <div className="flex items-center border rounded bg-white text-gray-700">
                          <button 
                            onClick={() => handleUpdateStock(prod.id, prod.stock, -1)}
                            className="px-1.5 py-0.5 hover:bg-gray-100 font-bold"
                          >
                            -
                          </button>
                          <button 
                            onClick={() => handleUpdateStock(prod.id, prod.stock, +5)}
                            className="px-1.5 py-0.5 hover:bg-gray-100 font-bold text-[10px]"
                            title="Restock +5"
                          >
                            +5
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-[#388e3c] font-bold">{prod.discount_percent || 0}% Off</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDERS MANAGEMENT */}
      {tab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-800">Customer Orders ({orders.length})</h2>
            
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">Filter Status:</span>
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="p-1.5 border border-gray-300 rounded font-semibold text-gray-700 bg-white"
              >
                <option value="ALL">All Orders</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>

              <button
                onClick={fetchOrders}
                className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                title="Refresh Orders"
              >
                <RefreshCw size={14} className={loadingOrders ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="bg-white p-8 rounded border border-gray-200 text-center text-gray-500 text-sm">
              No orders found matching the filter.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-white p-4 rounded-md border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-gray-900">{ord.order_number}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        ord.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                        ord.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                        ord.status === 'DELIVERED' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ord.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(ord.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="text-xs text-gray-700">
                      <strong>Customer:</strong> {ord.customer_name} ({ord.customer_email})
                    </div>
                    <div className="text-xs text-gray-500">
                      <strong>Address:</strong> {ord.shipping_address}
                    </div>

                    {/* Order items snapshot */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(ord.items || []).map((it, idx) => (
                        <span key={idx} className="bg-gray-50 border border-gray-200 px-2 py-0.5 rounded text-[11px] text-gray-700">
                          {it.title?.substring(0, 30)}... x{it.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-2 md:pt-0">
                    <div className="text-base font-bold text-gray-900">
                      ₹{Number(ord.total_amount).toLocaleString('en-IN')}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-gray-500">Update:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="p-1 border border-gray-300 rounded font-semibold text-gray-800 bg-white text-xs"
                      >
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: QUEUE MONITOR & CONCURRENCY SIMULATOR */}
      {tab === 'queue' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-md border border-gray-200 shadow-xs">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity size={18} className="text-flipkart-blue" />
              Big Billion Day High Concurrency Order Queue
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Processes bursts of concurrent checkout transactions sequentially (FIFO) to prevent race-condition stock overselling.
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                <div className="text-xs text-blue-700 font-semibold">Active In-Flight Queue</div>
                <div className="text-2xl font-black text-blue-900 mt-1">
                  {queueStats?.activeQueueLength ?? 0}
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded">
                <div className="text-xs text-green-700 font-semibold">Orders Completed</div>
                <div className="text-2xl font-black text-green-900 mt-1">
                  {queueStats?.totalCompleted ?? 0}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-3 rounded">
                <div className="text-xs text-purple-700 font-semibold">Peak Queue Depth</div>
                <div className="text-2xl font-black text-purple-900 mt-1">
                  {queueStats?.peakQueueLength ?? 0}
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 p-3 rounded">
                <div className="text-xs text-amber-700 font-semibold">Total Orders Enqueued</div>
                <div className="text-2xl font-black text-amber-900 mt-1">
                  {queueStats?.totalEnqueued ?? 0}
                </div>
              </div>
            </div>

            {/* Simulation controls */}
            <div className="mt-6 pt-5 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-gray-900">Simulate Multiple Concurrent Users</h4>
                <p className="text-xs text-gray-500">Test the queue by bombarding the backend with 5 simultaneous checkouts.</p>
              </div>

              <div className="flex gap-2">
                <button
                  disabled={simulating}
                  onClick={() => handleSimulateBurst(3)}
                  className="bg-flipkart-blue hover:bg-flipkart-darkBlue text-white font-bold py-2 px-4 rounded text-xs transition"
                >
                  Simulate 3 Users
                </button>
                <button
                  disabled={simulating}
                  onClick={() => handleSimulateBurst(5)}
                  className="bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold py-2 px-4 rounded text-xs transition shadow flex items-center gap-1.5"
                >
                  <Zap size={14} className="fill-white" />
                  Simulate Big Billion Rush (5 Users)
                </button>
              </div>
            </div>

            {/* Live activity log */}
            {simulationLog.length > 0 && (
              <div className="mt-4 bg-gray-900 text-green-400 p-3.5 rounded font-mono text-xs space-y-1">
                <div className="text-gray-400 pb-1 border-b border-gray-800 text-[11px]">Real-Time Queue Events:</div>
                {simulationLog.map((log, idx) => (
                  <div key={idx}>{log}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Product to Flipkart Inventory</h3>
            
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  placeholder="e.g. OnePlus 12 5G (Flowy Emerald, 256 GB)"
                  className="w-full p-2.5 border rounded focus:border-flipkart-blue focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full p-2.5 border rounded focus:border-flipkart-blue focus:outline-none bg-white"
                  >
                    <option value="Mobiles">Mobiles</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Appliances">Appliances</option>
                    <option value="Home">Home & Kitchen</option>
                    <option value="Grocery">Grocery</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    placeholder="e.g. OnePlus"
                    className="w-full p-2.5 border rounded focus:border-flipkart-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Sale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="49999"
                    className="w-full p-2.5 border rounded focus:border-flipkart-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={newProduct.original_price}
                    onChange={(e) => setNewProduct({ ...newProduct, original_price: e.target.value })}
                    placeholder="64999"
                    className="w-full p-2.5 border rounded focus:border-flipkart-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full p-2.5 border rounded focus:border-flipkart-blue focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2.5 border rounded focus:border-flipkart-blue focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Product highlights..."
                  className="w-full p-2.5 border rounded focus:border-flipkart-blue focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-flipkart-blue text-white rounded font-bold hover:bg-flipkart-darkBlue"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
