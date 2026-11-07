import React from 'react';
import { X, Star, ShoppingCart, Zap, CheckCircle2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose, onBuyNow }) {
  const { addToCart } = useCart();
  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    onClose();
    if (onBuyNow) onBuyNow(product);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto relative flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-3 top-3 z-10 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
        >
          <X size={20} />
        </button>

        {/* Left Side: Product Image & Buttons */}
        <div className="md:w-5/12 p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-gray-100 bg-gray-50/50">
          <div className="w-full h-72 flex items-center justify-center">
            <img 
              src={product.image_url} 
              alt={product.title} 
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-3 px-4 rounded text-sm font-bold flex items-center justify-center gap-2 transition ${
                isOutOfStock 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#ff9f00] hover:bg-[#f39700] text-white shadow-sm'
              }`}
            >
              <ShoppingCart size={18} />
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`py-3 px-4 rounded text-sm font-bold flex items-center justify-center gap-2 transition ${
                isOutOfStock 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#fb641b] hover:bg-[#e6530b] text-white shadow-md'
              }`}
            >
              <Zap size={18} className="fill-white" />
              BUY NOW
            </button>
          </div>
        </div>

        {/* Right Side: Details & Offers */}
        <div className="md:w-7/12 p-6 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Category & Brand */}
            <div className="text-xs text-gray-500 font-medium tracking-wide uppercase flex items-center gap-2">
              <span>Home &gt; {product.category} &gt; {product.brand || 'Flipkart'}</span>
            </div>

            {/* Title */}
            <h1 className="text-xl font-medium text-gray-900 leading-snug">
              {product.title}
            </h1>

            {/* Ratings & Assured */}
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 bg-[#388e3c] text-white text-xs font-bold px-2 py-0.5 rounded">
                {product.rating || 4.3} <Star size={12} className="fill-white" />
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {Number(product.reviews_count || 1250).toLocaleString()} Ratings & Reviews
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-flipkart-blue italic">
                Flipkart Assured <CheckCircle2 size={13} className="fill-flipkart-blue text-white" />
              </span>
            </div>

            {/* Price section */}
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-[#388e3c] font-bold uppercase tracking-wider mb-1">
                Special Big Billion Days Price
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                {product.original_price > product.price && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{Number(product.original_price).toLocaleString('en-IN')}
                    </span>
                    <span className="text-base font-bold text-[#388e3c]">
                      {product.discount_percent || Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stock status */}
            <div>
              {product.stock > 0 ? (
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded bg-green-50 text-green-700 border border-green-200">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  In Stock ({product.stock} units available)
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded bg-red-50 text-red-700 border border-red-200">
                  Currently Out of Stock
                </div>
              )}
            </div>

            {/* Description */}
            <div className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded border border-gray-100">
              <h4 className="font-semibold text-gray-800 text-xs uppercase mb-1">Product Description</h4>
              <p>{product.description || 'Premium quality product verified and assured by Flipkart.'}</p>
            </div>

            {/* Big Billion Day Benefits */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs text-gray-600">
              <div className="p-2 border border-gray-200 rounded flex flex-col items-center">
                <Truck size={18} className="text-flipkart-blue mb-1" />
                <span>Free Express Delivery</span>
              </div>
              <div className="p-2 border border-gray-200 rounded flex flex-col items-center">
                <RotateCcw size={18} className="text-flipkart-blue mb-1" />
                <span>7 Days Replacement</span>
              </div>
              <div className="p-2 border border-gray-200 rounded flex flex-col items-center">
                <ShieldCheck size={18} className="text-flipkart-blue mb-1" />
                <span>1 Year Warranty</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
