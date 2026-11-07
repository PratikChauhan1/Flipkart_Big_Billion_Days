import React, { useState, useEffect } from 'react';
import { Flame, Clock, CreditCard, Zap, ShieldCheck } from 'lucide-react';

export default function Banner({ onExploreDeals }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 45,
    seconds: 22
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const format2 = (n) => String(n).padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-4 mt-3">
      {/* Main Banner */}
      <div className="relative overflow-hidden rounded-md bg-gradient-to-r from-blue-900 via-indigo-900 to-flipkart-blue text-white p-5 sm:p-7 shadow-lg border border-blue-800">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left Title & Promo */}
          <div className="text-center md:text-left space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-flipkart-yellow text-blue-950 text-xs font-black tracking-wider uppercase shadow-sm">
              <Flame size={14} className="fill-orange-500 text-orange-500 animate-bounce" />
              THE BIG BILLION DAYS • LIVE NOW
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              India's Biggest Deals on <br className="hidden sm:inline" />
              <span className="text-flipkart-yellow">Mobiles, Electronics & Fashion</span>
            </h1>

            <p className="text-blue-100 text-xs sm:text-sm">
              Up to 80% Off on top brands. Extra 10% Instant Discount on credit/debit cards.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded text-xs">
                <CreditCard size={14} className="text-yellow-400" />
                <span>10% Instant Bank Discount</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded text-xs">
                <Zap size={14} className="text-yellow-400" />
                <span>Priority Order Queue</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-3 py-1 rounded text-xs">
                <ShieldCheck size={14} className="text-green-400" />
                <span>100% Genuine Assured</span>
              </div>
            </div>
          </div>

          {/* Right Countdown & Call to action */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20 text-center min-w-[260px]">
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-yellow-300 uppercase tracking-wider mb-2">
              <Clock size={15} />
              <span>Flash Deals End In</span>
            </div>

            <div className="flex items-center justify-center gap-2 font-mono text-2xl font-bold">
              <div className="bg-black/50 px-2.5 py-1.5 rounded shadow">
                {format2(timeLeft.hours)}
                <span className="block text-[9px] font-sans font-normal text-gray-300">HRS</span>
              </div>
              <span className="text-yellow-300">:</span>
              <div className="bg-black/50 px-2.5 py-1.5 rounded shadow">
                {format2(timeLeft.minutes)}
                <span className="block text-[9px] font-sans font-normal text-gray-300">MIN</span>
              </div>
              <span className="text-yellow-300">:</span>
              <div className="bg-black/50 px-2.5 py-1.5 rounded shadow">
                {format2(timeLeft.seconds)}
                <span className="block text-[9px] font-sans font-normal text-gray-300">SEC</span>
              </div>
            </div>

            <button
              onClick={onExploreDeals}
              className="mt-4 w-full bg-flipkart-yellow hover:bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded text-xs uppercase tracking-wider shadow transition"
            >
              Shop Big Billion Deals
            </button>
          </div>

        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl pointer-events-none"></div>
      </div>
    </div>
  );
}
