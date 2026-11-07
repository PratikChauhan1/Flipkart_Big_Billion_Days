import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  ChevronDown, 
  Package, 
  ShieldCheck, 
  LogOut, 
  Store 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ 
  searchTerm, 
  setSearchTerm, 
  onOpenAuth, 
  onOpenCart, 
  onOpenOrders, 
  onOpenAdmin,
  activeView,
  setActiveView 
}) {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-flipkart-blue text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => { setActiveView('store'); }} 
          className="cursor-pointer flex flex-col items-start select-none"
        >
          <div className="flex items-center text-xl font-black italic tracking-wide">
            <span>Flipkart</span>
            <span className="text-flipkart-yellow font-bold text-xs italic ml-1 self-end mb-0.5">Plus</span>
          </div>
          <span className="text-[10px] text-gray-200 italic -mt-1 flex items-center gap-0.5">
            Explore <span className="text-flipkart-yellow font-bold">Plus</span>
            <span className="text-[9px] text-flipkart-yellow">✦</span>
          </span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for Products, Brands and More (Big Billion Days Deals!)"
            className="w-full bg-white text-gray-800 placeholder-gray-500 pl-4 pr-11 py-2 rounded-sm text-sm focus:outline-none shadow-inner"
          />
          <button 
            type="button"
            className="absolute right-0 top-0 bottom-0 px-3.5 flex items-center justify-center text-flipkart-blue hover:text-flipkart-darkBlue"
          >
            <Search size={18} />
          </button>
        </div>

        {/* Right Menu Links */}
        <div className="flex items-center gap-3 sm:gap-6 text-sm font-medium">
          {/* User Auth / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-1.5 bg-white text-flipkart-blue px-3.5 py-1 rounded-sm font-semibold hover:bg-gray-50 shadow-sm"
              >
                <User size={16} />
                <span className="truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                {user.role === 'admin' && (
                  <span className="bg-red-500 text-white text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full">Admin</span>
                )}
                <ChevronDown size={14} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div 
                  onMouseLeave={() => setShowDropdown(false)}
                  className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="font-bold text-sm truncate text-flipkart-blue">{user.email}</p>
                    <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-100 text-flipkart-blue capitalize">
                      {user.role} Account
                    </span>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setActiveView('admin');
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center gap-2 text-purple-700 font-semibold"
                    >
                      <ShieldCheck size={16} />
                      Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenOrders();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 flex items-center gap-2"
                  >
                    <Package size={16} />
                    My Orders
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-gray-100 mt-1"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="bg-white text-flipkart-blue font-semibold px-6 py-1 rounded-sm hover:bg-gray-100 transition shadow-sm text-sm"
            >
              Login
            </button>
          )}

          {/* Admin Direct Button (When Admin) */}
          {isAdmin && (
            <button
              onClick={() => setActiveView(activeView === 'admin' ? 'store' : 'admin')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold border transition ${
                activeView === 'admin' 
                  ? 'bg-yellow-400 text-gray-900 border-yellow-400' 
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/30'
              }`}
            >
              {activeView === 'admin' ? <Store size={14} /> : <ShieldCheck size={14} />}
              <span>{activeView === 'admin' ? 'Store View' : 'Admin Panel'}</span>
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 hover:text-flipkart-yellow transition font-semibold"
          >
            <div className="relative">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-flipkart-orange text-white text-[11px] font-bold h-4.5 w-4.5 min-w-[18px] rounded-full flex items-center justify-center px-1 border-2 border-flipkart-blue">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}
