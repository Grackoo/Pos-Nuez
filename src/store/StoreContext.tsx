import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, Category, Product, Sale, Customer } from '../types';

interface StoreContextType {
  employees: Employee[];
  categories: Category[];
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  activeEmployee: Employee | null;
  setActiveEmployee: (employee: Employee | null) => void;
  
  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const initialCategories: Category[] = [
  { id: '1', name: 'Nuez Entera' },
  { id: '2', name: 'Nuez en Mitades' },
  { id: '3', name: 'Nuez en Pedacería' },
  { id: '4', name: 'Nuez Garapiñada' },
  { id: '5', name: 'Nuez Salada' },
  { id: '6', name: 'Harina de Nuez' },
];

const initialEmployees: Employee[] = [
  { id: '1', name: 'Admin User', role: 'Admin', pin: '1234' }
];

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : [];
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sales');
    return saved ? JSON.parse(saved) : [];
  });
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);

  // Persistence
  useEffect(() => { localStorage.setItem('employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('customers', JSON.stringify(customers)); }, [customers]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: generateId() }]);
  };

  const updateProduct = (id: string, productUpdate: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productUpdate } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addSale = (saleData: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...saleData,
      id: generateId(),
      date: new Date().toISOString(),
    };
    
    // Decrease inventory
    const newProducts = [...products];
    newSale.items.forEach(item => {
      const productIndex = newProducts.findIndex(p => p.id === item.productId);
      if (productIndex !== -1) {
        newProducts[productIndex] = {
          ...newProducts[productIndex],
          stock: newProducts[productIndex].stock - item.quantity
        };
      }
    });
    
    setProducts(newProducts);
    setSales(prev => [...prev, newSale]);
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...customer, id: generateId() }]);
  };

  const updateCustomer = (id: string, customerUpdate: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customerUpdate } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    setEmployees(prev => [...prev, { ...employee, id: generateId() }]);
  };

  const updateEmployee = (id: string, employeeUpdate: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...employeeUpdate } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  return (
    <StoreContext.Provider value={{
      employees, categories, products, sales, customers, activeEmployee, setActiveEmployee,
      addProduct, updateProduct, deleteProduct,
      addSale,
      addCustomer, updateCustomer, deleteCustomer,
      addEmployee, updateEmployee, deleteEmployee
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
