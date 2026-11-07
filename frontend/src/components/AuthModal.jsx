import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config';

export default function AuthModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState('user'); // 'user' | 'admin'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? `${API_BASE}/api/auth/register` : `${API_BASE}/api/auth/login`;
    const body = isRegister 
      ? { name, email, password, role } 
      : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed');
      }

      login(data.user, data.token);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole) => {
    if (demoRole === 'admin') {
      setEmail('admin@flipkart.com');
      setPassword('admin123');
      setIsRegister(false);
      setRole('admin');
    } else {
      setEmail('user@flipkart.com');
      setPassword('user123');
      setIsRegister(false);
      setRole('user');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden relative">
        
        {/* Header Banner */}
        <div className="bg-flipkart-blue text-white p-5 relative">
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 p-1 rounded-full hover:bg-white/20 text-white transition"
          >
            <X size={18} />
          </button>
          
          <div className="text-xl font-bold flex items-center gap-2">
            <span>Flipkart</span>
            <span className="text-xs bg-flipkart-yellow text-blue-950 font-black px-1.5 py-0.5 rounded">
              {isRegister ? 'JOIN' : 'LOGIN'}
            </span>
          </div>
          <p className="text-xs text-blue-100 mt-1">
            {isRegister 
              ? 'Create your account to unlock Big Billion Day exclusive offers' 
              : 'Get access to your Orders, Wishlist and Special Recommendations'}
          </p>
        </div>

        {/* Demo Fast-Fill Bar */}
        <div className="bg-yellow-50 border-b border-yellow-200 p-3 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-yellow-900 font-semibold flex items-center gap-1">
            <Sparkles size={14} className="text-yellow-600 fill-yellow-600" />
            Quick Demo Accounts:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('user')}
              className="px-2.5 py-1 bg-white border border-gray-300 hover:border-flipkart-blue text-flipkart-blue font-bold rounded shadow-2xs"
            >
              Demo User
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1 bg-white border border-purple-300 hover:border-purple-600 text-purple-700 font-bold rounded shadow-2xs"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-2.5 rounded border border-red-200 font-medium">
              {error}
            </div>
          )}

          {isRegister && (
            <>
              {/* Role Picker for Registration */}
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('user')}
                    className={`py-2 px-3 text-xs font-bold rounded border text-center transition flex items-center justify-center gap-1.5 ${
                      role === 'user' 
                        ? 'border-flipkart-blue bg-blue-50 text-flipkart-blue shadow-2xs' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <User size={14} />
                    Customer (Buyer)
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 text-xs font-bold rounded border text-center transition flex items-center justify-center gap-1.5 ${
                      role === 'admin' 
                        ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-2xs' 
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Shield size={14} />
                    Store Admin
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded focus:border-flipkart-blue focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded focus:border-flipkart-blue focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                className="w-full text-xs pl-9 pr-3 py-2.5 border border-gray-300 rounded focus:border-flipkart-blue focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fb641b] hover:bg-[#e6530b] text-white font-bold py-2.5 px-4 rounded text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span>{isRegister ? 'CREATE ACCOUNT' : 'CONTINUE'}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>

          {/* Switch Mode */}
          <div className="text-center pt-2 text-xs text-gray-600">
            {isRegister ? (
              <p>
                Existing User?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(false); setError(''); }}
                  className="text-flipkart-blue font-bold hover:underline"
                >
                  Log in
                </button>
              </p>
            ) : (
              <p>
                New to Flipkart?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegister(true); setError(''); }}
                  className="text-flipkart-blue font-bold hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </form>

      </div>
    </div>
  );
}
