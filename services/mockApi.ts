
import { Product, Order, User, OrderCreatedEvent } from '../types';

// Initial Mock Data
let products: Product[] = [
  { id: '1', name: 'Azure Cloud Expert Course', description: 'Mastering microservices architecture.', price: 299, categoryId: 'education', stock: 50 },
  { id: '2', name: 'DotNet Core Bundle', description: 'Deep dive into C# 12 and Web APIs.', price: 149, categoryId: 'education', stock: 100 },
  { id: '3', name: 'Azure Cosmos DB Pro', description: 'Advanced NoSQL patterns.', price: 199, categoryId: 'software', stock: 20 },
  { id: '4', name: 'Enterprise Messaging Pack', description: 'Service Bus and Event Hub patterns.', price: 89, categoryId: 'software', stock: 30 },
];

let orders: Order[] = [];

// Simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const mockApi = {
  // Auth Service
  login: async (email: string): Promise<User> => {
    await delay(800);
    return { userId: 'user-123', email, token: 'mock-jwt-token-' + Date.now() };
  },
  
  register: async (email: string): Promise<User> => {
    await delay(1000);
    return { userId: 'user-' + Math.random().toString(36).substr(2, 9), email, token: 'mock-jwt-token-' + Date.now() };
  },

  // Product Service
  getProducts: async (): Promise<Product[]> => {
    await delay(500);
    return [...products];
  },

  createProduct: async (p: Partial<Product>): Promise<Product> => {
    await delay(700);
    const newP = { ...p, id: Math.random().toString() } as Product;
    products.push(newP);
    return newP;
  },

  // Order Service
  getOrdersByUser: async (userId: string): Promise<Order[]> => {
    await delay(600);
    return orders.filter(o => o.userId === userId);
  },

  placeOrder: async (userId: string, items: any[], totalAmount: number): Promise<Order> => {
    await delay(1200);
    const newOrder: Order = {
      orderId: 'ORD-' + Math.random().toString(36).toUpperCase().substr(2, 6),
      userId,
      items,
      totalAmount,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    orders.push(newOrder);

    // Simulate Azure Service Bus Event
    const event: OrderCreatedEvent = {
      eventType: "OrderCreated",
      orderId: newOrder.orderId,
      userId: newOrder.userId,
      totalAmount: newOrder.totalAmount,
      createdAt: newOrder.createdAt
    };
    console.log("%c [Service Bus Publisher] %c Published OrderCreated event to 'order-events' topic:", "background: #312e81; color: #fff; padding: 2px 4px; border-radius: 4px;", "color: #4f46e5", event);

    return newOrder;
  }
};
