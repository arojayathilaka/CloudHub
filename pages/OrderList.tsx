
import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { api } from '../services/api';

interface OrderListProps {
  userId: string;
}

const OrderList: React.FC<OrderListProps> = ({ userId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOrdersByUser(userId).then(data => {
      setOrders(data);
      setLoading(false);
    }).catch(err => {
      console.log(userId);

      console.error("Failed to fetch orders:", err);
      setLoading(false);
    });
  }, [userId]);

  if (loading) return <div className="text-center py-20 text-slate-500">Querying Order Container...</div>;

  return (
    <div>
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Order History</h1>
        <p className="text-slate-500">Real-time status of your microservice provisioning.</p>
      </header>

      {orders.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">No orders found.</p>
          <p className="text-slate-400 text-sm">Deploy some products from the marketplace first.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.orderId} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-200 transition-colors shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono font-bold text-indigo-600">{o.orderId}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                      {o.status || 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase font-semibold">Total Amount</p>
                    <p className="text-lg font-bold text-slate-900">${o.totalAmount}</p>
                  </div>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-50 flex flex-wrap gap-2">
                {o.items.map((item, idx) => (
                  <span key={idx} className="bg-slate-50 text-slate-600 text-xs px-3 py-1.5 rounded-lg border border-slate-100">
                    {item.quantity}x {item.productName}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
