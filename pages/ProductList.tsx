
import React, { useState, useEffect } from 'react';
import type { Product } from '../types';
import { api } from '../services/api';

interface ProductListProps {
  userId: string;
}

const ProductList: React.FC<ProductListProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState<string | null>(null);

  useEffect(() => {
    api.getProducts().then(data => {
      console.log("Fetched products:", data);
      setProducts(data);
      setLoading(false);
    }).catch(err => {
      console.error("Failed to fetch products:", err);
      setLoading(false);
    });
  }, []);

  const handleBuy = async (p: Product) => {
    setOrdering(p.id);
    try {
      await api.placeOrder([{ productId: p.id, productName: p.name, quantity: 1, price: p.price }], p.price);
      alert('Order placed successfully! Check "My Orders" tab.');
    } catch (error) {
      alert('Failed to place order. Ensure Order Service is running.');
    } finally {
      setOrdering(null);
    }
  };

  if (loading) return <div className="text-center py-20 text-slate-500">Scanning Cosmos DB...</div>;

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Cloud Marketplace</h1>
        <p className="text-slate-500">Select premium microservices solutions for your cluster.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 rounded-md">
                {p.categoryId}
              </span>
              <span className="text-2xl font-bold text-indigo-600">${p.price}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</h3>
            <p className="text-slate-500 text-sm mt-2 flex-1">{p.description}</p>
            <div className="mt-6">
              <button
                disabled={!!ordering}
                onClick={() => handleBuy(p)}
                className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  ordering === p.id 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-md active:scale-[0.98]'
                }`}
              >
                {ordering === p.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
