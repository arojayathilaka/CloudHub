
export interface User {
  userId: string;
  email: string;
  token?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  status: 'Pending' | 'Processed' | 'Shipped';
}

export interface OrderCreatedEvent {
  eventType: "OrderCreated";
  orderId: string;
  userId: string;
  totalAmount: number;
  createdAt: string;
}

export enum Page {
  LOGIN = 'login',
  REGISTER = 'register',
  PRODUCTS = 'products',
  ORDERS = 'orders',
  DOCS = 'docs'
}
