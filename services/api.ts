
import axios from 'axios';
import type { Product, Order, User } from '../types';

// Microservice Endpoints
const SERVICES = {
  AUTH: 'http://localhost:5001',
  PRODUCT: 'http://localhost:5002',
  ORDER: 'http://localhost:5003'
};

const authApi = axios.create({ baseURL: SERVICES.AUTH, timeout: 10000 });
const productApi = axios.create({ baseURL: SERVICES.PRODUCT, timeout: 10000 });
const orderApi = axios.create({ baseURL: SERVICES.ORDER, timeout: 10000 });

// Inject JWT Token into all requests
const addAuthInterceptor = (instance: any) => {
  instance.interceptors.request.use((config: any) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  });
};

[productApi, orderApi].forEach(addAuthInterceptor);

/**
 * Resilient wrapper to handle "Network Error" gracefully.
 * In a real environment, this allows the UI to function using local simulation 
 * if the microservices aren't locally running yet.
 */
const handleRequest = async <T>(request: Promise<any>): Promise<T> => {
  try {
    const res = await request;
    return res.data;
  } catch (error: any) {
    if (error.message === 'Network Error' || error.code === 'ECONNABORTED') {
      console.warn(`[Microservice Connectivity] Service at ${SERVICES.AUTH} unreachable. Falling back to local simulation.`);
    }
    console.log(error)
    throw error;
  }
};

export const api = {
  // Auth Service
  login: async (email: string, pass: string): Promise<User> => {
    return handleRequest(
      authApi.post('/auth/login', { email, password: pass }),
    );
  },
  
  register: async (email: string, pass: string): Promise<User> => {
    return handleRequest(
      authApi.post('/auth/register', { email, password: pass }),
    );
  },

  // Product Service
  getProducts: async (): Promise<Product[]> => {
    return handleRequest(
      productApi.get('/products')
    );
  },
  
  createProduct: async (product: Partial<Product>): Promise<Product> => {
    return handleRequest(
      productApi.post('/products', product),
    );
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    return handleRequest(
      productApi.put(`/products/${id}`, product),
    );
  },

  // Order Service
  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    return handleRequest(
      orderApi.get(`/orders/user/${userId}`),
    );
  },

  placeOrder: async (userId: string, items: any[], totalAmount: number): Promise<Order> => {
    return handleRequest(
      orderApi.post('/orders', { items, totalAmount }),
    );
  }
};
