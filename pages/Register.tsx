
import React, { useState } from 'react';
import { api } from '../services/api';

interface RegisterProps {
  onNavigate: () => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.register(email, password);
      alert('Account created. Please log in.');
      onNavigate();
    } catch (err) {
      alert('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 w-full">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Join Cloud Hub</h2>
        <p className="text-slate-500 mt-2">Create your microservices identity</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Work Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-70"
        >
          {loading ? 'Creating Account...' : 'Initialize Identity'}
        </button>
      </form>

      <div className="mt-8 text-center pt-8 border-t border-slate-100">
        <p className="text-slate-500">
          Already have an account?{' '}
          <button onClick={onNavigate} className="text-indigo-600 font-bold hover:underline">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
