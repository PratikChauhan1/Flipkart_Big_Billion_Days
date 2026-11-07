import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CategoryBar from './components/CategoryBar';
import Banner from './components/Banner';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import MyOrdersModal from './components/MyOrdersModal';
import { useAuth } from './context/AuthContext';
import { 
  Sparkles, 
  Flame, 
  Filter, 
  ArrowUpDown, 
  RefreshCw, 
  ShieldCheck, 
  HelpCircle, 
  Award 
} from 'lucide-react';
import { API_BASE } from './config';

export default function App() {
  const { user, isAdmin } = useAuth();

  // Navigation / View State
  const [activeView, setActiveView] = useState('store'); // 'store' | 'admin'

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Products & Filtering
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'price_asc' | 'price_desc' | 'discount'

  // Fetch products from backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API_BASE}/api/products?`;
      if (selectedCategory && selectedCategory !== 'All') {
        url += `category=${encodeURIComponent(selectedCategory)}&`;
      }
      if (searchTerm) {
        url += `search=${encodeURIComponent(searchTerm)}&`;
      }
      if (sortBy !== 'relevance') {
        url += `sort=${encodeURIComponent(sortBy)}&`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, sortBy]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 350);
    return () => clearInterval(timer);
  }, [searchTerm]);

  const handleBuyNow = (product) => {
    setShowCheckoutModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f6]">
      {/* Top Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenCart={() => setShowCartModal(true)}
        onOpenOrders={() => setShowOrdersModal(true)}
        onOpenAdmin={() => setActiveView('admin')}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Body */}
      {activeView === 'admin' ? (
        <AdminDashboard onProductsUpdated={fetchProducts} />
      ) : (
        <main className="flex-1 pb-12">
          {/* Categories Navigation Bar */}
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          {/* Big Billion Days Hero Banner */}
          <Banner
            onExploreDeals={() => {
              setSelectedCategory('All');
              const grid = document.getElementById('deals-section');
              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Products Section */}
          <div id="deals-section" className="max-w-7xl mx-auto px-4 mt-5">
            {/* Filter & Sort Bar */}
            <div className="bg-white p-3.5 rounded border border-gray-200 shadow-2xs mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-1.5">
                  <Flame size={18} className="fill-orange-500 text-orange-500" />
                  {selectedCategory === 'All' ? 'Top Big Billion Deals' : `${selectedCategory} Deals`}
                </span>
                <span className="text-xs text-gray-400">({products.length} Items)</span>
              </div>

              {/* Sort By controls */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium hidden sm:inline flex items-center gap-1">
                  <ArrowUpDown size={13} /> Sort By:
                </span>
                <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded">
                  <button
                    onClick={() => setSortBy('relevance')}
                    className={`px-2.5 py-1 rounded font-medium transition ${
                      sortBy === 'relevance' ? 'bg-white text-flipkart-blue shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Relevance
                  </button>
                  <button
                    onClick={() => setSortBy('price_asc')}
                    className={`px-2.5 py-1 rounded font-medium transition ${
                      sortBy === 'price_asc' ? 'bg-white text-flipkart-blue shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Price: Low to High
                  </button>
                  <button
                    onClick={() => setSortBy('price_desc')}
                    className={`px-2.5 py-1 rounded font-medium transition ${
                      sortBy === 'price_desc' ? 'bg-white text-flipkart-blue shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Price: High to Low
                  </button>
                  <button
                    onClick={() => setSortBy('discount')}
                    className={`px-2.5 py-1 rounded font-medium transition ${
                      sortBy === 'discount' ? 'bg-white text-[#388e3c] shadow-2xs font-bold' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Discount %
                  </button>
                </div>
              </div>
            </div>

            {/* Product Cards Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 py-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="bg-white p-4 rounded border border-gray-200 animate-pulse space-y-3 h-80">
                    <div className="bg-gray-200 h-44 rounded"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 text-center rounded border border-gray-200 my-4">
                <p className="text-gray-500 text-sm">No products found matching your search or category.</p>
                <button
                  onClick={() => { setSelectedCategory('All'); setSearchTerm(''); }}
                  className="mt-3 bg-flipkart-blue text-white text-xs font-bold px-4 py-2 rounded hover:bg-flipkart-darkBlue transition"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {products.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={(p) => setSelectedProduct(p)}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* MODALS */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onBuyNow={handleBuyNow}
        />
      )}

      <CartModal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        onProceedToCheckout={() => setShowCheckoutModal(true)}
      />

      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onOrderCompleted={(order) => {
          fetchProducts();
        }}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <MyOrdersModal
        isOpen={showOrdersModal}
        onClose={() => setShowOrdersModal(false)}
      />
    </div>
  );
}
