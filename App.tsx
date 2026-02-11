
import React, { useState, useEffect } from 'react';
import { Page, User } from './types';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductList from './pages/ProductList';
import OrderList from './pages/OrderList';
import Documentation from './pages/Documentation';
import Sidebar from './components/Sidebar';
import { api } from './services/api';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setCurrentPage(Page.PRODUCTS);
    }
    setLoading(false);
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('user', JSON.stringify(u));
    setCurrentPage(Page.PRODUCTS);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentPage(Page.LOGIN);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const renderPage = () => {
    if (!user && currentPage !== Page.REGISTER) return <Login onLogin={handleLogin} onNavigate={() => setCurrentPage(Page.REGISTER)} />;
    if (!user && currentPage === Page.REGISTER) return <Register onNavigate={() => setCurrentPage(Page.LOGIN)} />;

    switch (currentPage) {
      case Page.PRODUCTS: return <ProductList userId={user?.userId || ''} />;
      case Page.ORDERS: return <OrderList userId={user?.userId || ''} />;
      case Page.DOCS: return <Documentation />;
      default: return <ProductList userId={user?.userId || ''} />;
    }
  };

  const isAuthPage = !user;

  return (
    <div className={`min-h-screen ${isAuthPage ? 'bg-slate-900 flex items-center justify-center' : 'bg-slate-50 flex'}`}>
      {!isAuthPage && (
        <Sidebar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage} 
          onLogout={handleLogout}
          userEmail={user?.email || ''}
        />
      )}
      <main className={`${isAuthPage ? 'w-full max-w-md p-6' : 'flex-1 overflow-y-auto p-4 md:p-10'}`}>
        {!isAuthPage && (
          <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100/50 w-fit px-3 py-1 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Simulation Mode: Services not detected on Localhost
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
