import React from 'react';
import { Star, ShoppingCart, Zap, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onSelect, onBuyNow }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product);
    if (onBuyNow) onBuyNow(product);
  };

  const isLowStock = product.stock <= 5 && product.stock > 0;
  const isOutOfStock = product.stock <= 0;

  return (
    <div 
      onClick={() => onSelect(product)}
      className="bg-white rounded border border-gray-200 hover:shadow-xl transition-all duration-200 flex flex-col justify-between p-3.5 cursor-pointer relative group overflow-hidden"
    >
      {/* Big Billion Deal Ribbon */}
      {product.is_big_billion_deal && (
        <div className="absolute top-2 left-2 z-10 bg-flipkart-yellow text-blue-950 text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1 uppercase tracking-wider">
          <Zap size={11} className="fill-blue-950" />
          Big Billion Deal
        </div>
      )}

      {/* Stock warning */}
      {isLowStock && (
        <div className="absolute top-2 right-2 z-10 bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
          Only {product.stock} left!
        </div>
      )}

      {isOutOfStock && (
        <div className="absolute top-2 right-2 z-10 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          Sold Out
        </div>
      )}

      {/* Product Image */}
      <div className="w-full h-48 flex items-center justify-center p-2 mb-2 overflow-hidden">
        <img 
          src={product.image_url} 
          alt={product.title} 
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
          loading="lazy"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between pt-2 border-t border-gray-100">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="font-medium text-gray-600 uppercase tracking-wider">{product.brand || 'Flipkart'}</span>
            <span className="text-gray-400">{product.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-medium text-sm text-gray-900 line-clamp-2 group-hover:text-flipkart-blue transition title-clamp leading-snug">
            {product.title}
          </h3>

          {/* Rating and Flipkart Assured */}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="inline-flex items-center gap-0.5 bg-[#388e3c] text-white text-[11px] font-bold px-1.5 py-0.2 rounded">
              {product.rating || 4.2} <Star size={10} className="fill-white" />
            </span>
            <span className="text-xs text-gray-500 font-normal">
              ({Number(product.reviews_count || 120).toLocaleString()})
            </span>
            <span className="ml-auto inline-flex items-center gap-0.5 text-[10px] font-bold text-flipkart-blue italic">
              Assured <CheckCircle2 size={11} className="fill-flipkart-blue text-white" />
            </span>
          </div>

          {/* Pricing */}
          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            {product.original_price > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-[#388e3c]">
                  {product.discount_percent || Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 grid grid-cols-2 gap-2 pt-2 border-t border-gray-50">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-sm text-xs font-semibold border transition ${
              isOutOfStock 
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white border-flipkart-orange text-flipkart-orange hover:bg-orange-50'
            }`}
          >
            <ShoppingCart size={13} />
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-sm text-xs font-semibold transition ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-flipkart-orange hover:bg-orange-600 text-white shadow-xs'
            }`}
          >
            <Zap size={13} className="fill-white" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
