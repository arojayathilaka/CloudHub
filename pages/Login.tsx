
import React, { useState } from 'react';
import { User } from '../types';
import { mockApi } from '../services/mockApi';
import { api } from '../services/api';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await api.login(email, password);
      onLogin(user);
    } catch (err) {
      alert('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Cloud Portal</h2>
        <p className="text-slate-500 mt-2">Sign in to manage your microservices</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Service Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            placeholder="admin@enterprise.com"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Access Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
            placeholder="••••••••"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : 'Secure Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center pt-8 border-t border-slate-100">
        <p className="text-slate-500">
          New system administrator?{' '}
          <button onClick={onNavigate} className="text-indigo-600 font-bold hover:underline">
            Register Service Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
