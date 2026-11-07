import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartModal({ isOpen, onClose, onProceedToCheckout }) {
  const { items, removeFromCart, updateQuantity, totalItems, totalAmount, totalOriginalAmount, totalSavings } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-flipkart-blue text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} />
            <h2 className="font-bold text-base sm:text-lg">My Shopping Cart ({totalItems} Items)</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-blue-50 text-flipkart-blue rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Your cart is empty!</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              Explore the hottest Big Billion Day deals and add items to your cart before they run out.
            </p>
            <button
              onClick={onClose}
              className="mt-6 bg-flipkart-blue hover:bg-flipkart-darkBlue text-white font-bold py-2.5 px-8 rounded text-sm transition shadow"
            >
              Shop Big Billion Deals
            </button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#f1f3f6]">
            
            {/* Left Items Column */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded shadow-xs border border-gray-200 flex flex-col sm:flex-row gap-4">
                  {/* Thumbnail & Quantity */}
                  <div className="flex sm:flex-col items-center gap-3">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-20 h-20 object-contain"
                    />
                    
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="px-2.5 py-1 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-3 py-1 text-xs font-bold text-gray-800 bg-white min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="px-2.5 py-1 bg-gray-50 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">Category: {item.category}</p>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base font-bold text-gray-900">
                          ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.original_price > item.price && (
                          <>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{Number((item.original_price || item.price) * item.quantity).toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-bold text-[#388e3c]">
                              {item.discount_percent || Math.round(((item.original_price - item.price) / item.original_price) * 100)}% Off
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] text-[#388e3c] font-semibold">
                        Big Billion Instant Dispatch
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 transition"
                      >
                        <Trash2 size={13} />
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Price Summary Column */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded shadow-xs border border-gray-200">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-200">
                  PRICE DETAILS
                </h3>

                <div className="space-y-2.5 py-3 text-sm text-gray-700 border-b border-gray-200">
                  <div className="flex justify-between">
                    <span>Price ({totalItems} items)</span>
                    <span>₹{totalOriginalAmount.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-[#388e3c]">
                    <span>Discount</span>
                    <span>- ₹{totalSavings.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="text-[#388e3c] font-medium flex items-center gap-1">
                      <span className="line-through text-gray-400 font-normal">₹40</span> FREE
                    </span>
                  </div>
                </div>

                <div className="py-3 flex justify-between items-center text-base font-bold text-gray-900 border-b border-dashed border-gray-200">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-3 text-xs text-[#388e3c] font-bold">
                  You will save ₹{totalSavings.toLocaleString('en-IN')} on this order!
                </div>
              </div>

              {/* Safe & Secure */}
              <div className="flex items-center gap-2 text-xs text-gray-500 px-2">
                <ShieldCheck size={18} className="text-gray-400 shrink-0" />
                <span>Safe and Secure Payments. 100% Authentic products.</span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold py-3 px-4 rounded text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition"
              >
                <span>PLACE ORDER</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
