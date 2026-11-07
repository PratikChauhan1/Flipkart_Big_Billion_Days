import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  AlertCircle, 
  Loader2, 
  Zap, 
  ShieldCheck, 
  Package 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_BASE } from '../config';

export default function CheckoutModal({ isOpen, onClose, onOrderCompleted }) {
  const { user } = useAuth();
  const { items, totalAmount, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '9876543210',
    address: user?.address || 'Flat 402, Sunshine Residency, Outer Ring Road',
    city: 'Bengaluru',
    pincode: '560103',
    paymentMethod: 'Cash on Delivery (Big Billion Pay)'
  });

  const [stage, setStage] = useState('FORM'); // 'FORM' | 'QUEUED' | 'SUCCESS' | 'ERROR'
  const [queueData, setQueueData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Sync user info if auth updates
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address
      }));
    }
  }, [user]);

  // Queue Poller
  useEffect(() => {
    let interval = null;
    if (stage === 'QUEUED' && queueData?.data?.jobId) {
      const jobId = queueData.data.jobId;
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BASE}/api/orders/queue/${jobId}`);
          const json = await res.json();
          if (json.success && json.data) {
            setQueueData({ data: json.data });
            if (json.data.status === 'CONFIRMED') {
              clearInterval(interval);
              setStage('SUCCESS');
              clearCart();
              if (onOrderCompleted) onOrderCompleted(json.data.result || json.data.orderData);
            } else if (json.data.status === 'FAILED') {
              clearInterval(interval);
              setStage('ERROR');
              setErrorMessage(json.data.error || 'High traffic burst: stock depleted during checkout.');
            }
          }
        } catch (err) {
          console.error('Queue poll error:', err);
        }
      }, 700);
    }
    return () => clearInterval(interval);
  }, [stage, queueData]);

  if (!isOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.address) {
      alert('Please fill all required shipping fields');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const fullAddress = `${formData.address}, ${formData.city} - ${formData.pincode}`;
      const payload = {
        items,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: fullAddress,
        total_amount: totalAmount,
        payment_method: formData.paymentMethod,
        user_id: user?.id || null
      };

      const res = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit order');
      }

      setQueueData(data);
      setStage('QUEUED');
    } catch (err) {
      setErrorMessage(err.message);
      setStage('ERROR');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setStage('FORM');
    setQueueData(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="bg-flipkart-blue text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap size={20} className="fill-yellow-300 text-yellow-300" />
            <h2 className="font-bold text-base sm:text-lg">
              {stage === 'FORM' && 'Big Billion Day Rush Checkout'}
              {stage === 'QUEUED' && 'Order Processing Queue'}
              {stage === 'SUCCESS' && 'Order Confirmed! 🎉'}
              {stage === 'ERROR' && 'Order Notice'}
            </h2>
          </div>
          <button 
            onClick={handleReset}
            className="p-1 rounded-full hover:bg-white/20 text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* STAGE 1: ADDRESS & PAYMENT FORM */}
        {stage === 'FORM' && (
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-4">
            {/* Rush alert */}
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-900 text-xs p-3 rounded flex items-center gap-2.5">
              <Zap size={16} className="text-yellow-600 shrink-0 fill-yellow-600" />
              <span>
                <strong>Big Billion Day High Demand:</strong> Orders are prioritized via our live FIFO Order Queue to guarantee stock allocation.
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={14} className="text-flipkart-blue" />
                Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-flipkart-blue focus:outline-none"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-flipkart-blue focus:outline-none"
                    placeholder="e.g. rahul@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-flipkart-blue focus:outline-none"
                  placeholder="10-digit mobile number"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Street Address *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-flipkart-blue focus:outline-none"
                  placeholder="House No., Building, Area, Landmark"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-flipkart-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded focus:border-flipkart-blue focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-2 border-t border-gray-200">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Payment Option
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2.5 border rounded cursor-pointer hover:bg-blue-50/50 border-flipkart-blue bg-blue-50/20">
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    checked={formData.paymentMethod === 'Cash on Delivery (Big Billion Pay)'} 
                    onChange={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery (Big Billion Pay)' })}
                    className="text-flipkart-blue"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-gray-800">Cash on Delivery (Pay at Doorstep)</span>
                    <span className="block text-[11px] text-gray-500">Fastest checkout during Big Billion peak sale</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Total summary bar */}
            <div className="bg-gray-50 p-3 rounded flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Order Total ({items.length} items):</span>
              <span className="text-lg font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold py-3 px-4 rounded text-sm uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition"
            >
              {submitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting to Queue...</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="fill-white" />
                  <span>CONFIRM & PLACE ORDER IN QUEUE</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STAGE 2: LIVE ORDER QUEUE SCREEN */}
        {stage === 'QUEUED' && (
          <div className="p-8 text-center space-y-6">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-flipkart-blue/20 border-t-flipkart-blue animate-spin"></div>
              <Clock size={32} className="text-flipkart-blue absolute" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-flipkart-blue text-xs font-bold tracking-wider uppercase mb-2">
                Order Processing Queue
              </span>
              <h3 className="text-xl font-bold text-gray-900">
                Holding your Big Billion Day items...
              </h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Multiple users are ordering right now. Our queue worker is atomically reserving inventory for you.
              </p>
            </div>

            {/* Queue Position Box */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-lg max-w-xs mx-auto">
              <div className="text-xs text-gray-600">Your Current Queue Position:</div>
              <div className="text-3xl font-black text-flipkart-blue mt-0.5">
                #{queueData?.data?.currentPosition ?? queueData?.data?.initialPosition ?? 1}
              </div>
              <div className="text-[11px] text-gray-500 mt-1 flex items-center justify-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
                Order ID: {queueData?.data?.orderNumber}
              </div>
            </div>

            {/* Progress steps animation */}
            <div className="max-w-md mx-auto space-y-2 text-left text-xs">
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <CheckCircle2 size={16} /> 1. Order Received & Enqueued
              </div>
              <div className="flex items-center gap-2 text-flipkart-blue font-semibold animate-pulse">
                <Loader2 size={16} className="animate-spin" /> 2. Verifying Stock & Database Lock
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} /> 3. Finalizing Confirmation
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: ORDER CONFIRMED SUCCESS */}
        {stage === 'SUCCESS' && (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-green-100 text-[#388e3c] rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={38} />
            </div>

            <div>
              <h3 className="text-2xl font-black text-gray-900">
                Order Confirmed!
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Processed via Big Billion Day Priority Queue
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Order ID:</span>
                <span className="font-bold text-gray-900">{queueData?.data?.orderNumber}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Customer:</span>
                <span className="font-medium text-gray-800">{formData.name}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-gray-500">Amount Paid / COD:</span>
                <span className="font-bold text-[#388e3c]">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery By:</span>
                <span className="font-medium text-gray-800">Tomorrow by 9:00 PM (Express)</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className="bg-flipkart-blue hover:bg-flipkart-darkBlue text-white font-bold py-2.5 px-6 rounded text-xs uppercase tracking-wider transition shadow"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* STAGE 4: ERROR / OUT OF STOCK NOTICE */}
        {stage === 'ERROR' && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle size={36} />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Order Could Not Be Completed
            </h3>

            <p className="text-xs text-red-600 bg-red-50 p-3 rounded border border-red-200 max-w-md mx-auto">
              {errorMessage || 'High burst demand: Item ran out of stock right as your order reached the queue front.'}
            </p>

            <button
              onClick={() => setStage('FORM')}
              className="bg-gray-800 hover:bg-black text-white text-xs font-bold py-2 px-6 rounded uppercase tracking-wider"
            >
              Try Again / Change Cart
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
