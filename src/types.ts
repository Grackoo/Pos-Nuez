export type ViewType = 'dashboard' | 'inventory' | 'sales' | 'customers' | 'reports' | 'employees' | 'settings' | 'cash' | 'cash_history';

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
  createdAt?: string;
}

export interface SaleItem {
  productId: string;
  quantity: number;
  subtotal: number;
  priceAtSale: number;
}

export type PaymentMethod = 'Efectivo' | 'Tarjeta' | 'Credito';

export interface Sale {
  id: string;
  date: string;
  employeeId: string;
  customerId?: string;
  total: number;
  items: SaleItem[];
  paymentMethod: PaymentMethod;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  balance: number;
}

export interface CustomerMovement {
  id: string;
  customerId: string;
  date: string;
  amount: number;
  type: 'Cargo' | 'Abono';
  description: string;
}

export interface CashMovement {
  id: string;
  type: 'in' | 'out';
  amount: number;
  description: string;
  date: string;
}

export interface CashSession {
  id: string;
  startTime: string;
  endTime?: string;
  employeeId: string;
  initialAmount: number;
  cashSales: number;
  cardSales: number;
  cashIn: number;
  cashOut: number;
  expectedCash: number;
  actualCash?: number;
  status: 'Open' | 'Closed';
  movements?: CashMovement[];
}

export interface TransformationTarget {
  productId: string;
  quantity: number;
}

export interface Transformation {
  id: string;
  date: string;
  sourceProductId: string;
  sourceQuantity: number;
  targets: TransformationTarget[];
  wasteQuantity: number;
  employeeId: string;
}
