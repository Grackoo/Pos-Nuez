export type ViewType = 'dashboard' | 'inventory' | 'sales' | 'customers' | 'reports' | 'employees';

export interface Employee {
  id: string;
  name: string;
  role: 'Admin' | 'Cajero';
  pin: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  stock: number;
  unit: 'Kg' | 'Gramos' | 'Pieza' | 'Paquete';
}

export interface SaleItem {
  productId: string;
  quantity: number;
  subtotal: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  date: string;
  employeeId: string;
  customerId?: string;
  total: number;
  items: SaleItem[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  balance: number;
}
