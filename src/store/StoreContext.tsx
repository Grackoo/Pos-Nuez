import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Employee, Category, Product, Sale, Customer, CustomerMovement, CashSession, Transformation, TransformationTarget } from '../types';

interface StoreContextType {
  employees: Employee[];
  categories: Category[];
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  customerMovements: CustomerMovement[];
  cashSessions: CashSession[];
  transformations: Transformation[];
  activeEmployee: Employee | null;
  setActiveEmployee: (employee: Employee | null) => void;
  
  // Actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  transformStock: (sourceProductId: string, sourceQty: number, targets: TransformationTarget[], employeeId: string) => void;
  
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => Sale;
  
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addCustomerPayment: (customerId: string, amount: number, description: string) => void;

  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Cash Register
  openCashSession: (employeeId: string, initialAmount: number) => void;
  closeCashSession: (actualCash: number) => void;
  addCashMovement: (type: 'in' | 'out', amount: number, description: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial Data
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
    if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    return [
      { id: 'p1', categoryId: '1', name: 'Nuez Pecana Entera Extra', price: 250, stock: 50, unit: 'Kg' },
      { id: 'p2', categoryId: '2', name: 'Nuez en Mitades Premium', price: 280, stock: 120, unit: 'Kg' },
      { id: 'p3', categoryId: '3', name: 'Pedacería de Nuez para Repostería', price: 150, stock: 200, unit: 'Kg' },
      { id: 'p4', categoryId: '4', name: 'Nuez Garapiñada Artesanal (Bolsa 500g)', price: 180, stock: 8, unit: 'Paquete' },
      { id: 'p5', categoryId: '5', name: 'Nuez Salada Tostada', price: 210, stock: 45, unit: 'Kg' },
      { id: 'p6', categoryId: '6', name: 'Harina de Nuez Fina', price: 120, stock: 15, unit: 'Kg' },
    ];
  });
  
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sales');
    if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    const today = new Date().toISOString();
    return [
      { id: 's1', date: today, employeeId: '1', total: 750, paymentMethod: 'Efectivo', items: [{ productId: 'p1', quantity: 3, subtotal: 750, priceAtSale: 250 }] },
      { id: 's2', date: today, employeeId: '1', total: 560, paymentMethod: 'Efectivo', items: [{ productId: 'p2', quantity: 2, subtotal: 560, priceAtSale: 280 }] },
      { id: 's3', date: today, employeeId: '1', total: 360, paymentMethod: 'Efectivo', items: [{ productId: 'p4', quantity: 2, subtotal: 360, priceAtSale: 180 }] },
    ];
  });
  
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    return [
      { id: 'c1', name: 'Agro Industrias del Norte', phone: '555-0123', email: 'compras@agronorte.com', balance: 14500 },
      { id: 'c2', name: 'Distribuidora La Cosecha', phone: '555-0456', email: 'contacto@lacosecha.com', balance: 0 },
      { id: 'c3', name: 'Exportaciones Nogal', phone: '555-0789', email: 'pagos@nogalexport.com', balance: 850 },
      { id: 'c4', name: 'Panadería El Trigo de Oro', phone: '555-0999', email: 'trigooro@gmail.com', balance: 2300 },
    ];
  });

  const [customerMovements, setCustomerMovements] = useState<CustomerMovement[]>(() => {
    const saved = localStorage.getItem('customerMovements');
    if (saved && JSON.parse(saved).length > 0) return JSON.parse(saved);
    // Mock initial debt movements based on current balances
    return [
      { id: 'm1', customerId: 'c1', date: new Date(Date.now() - 86400000*3).toISOString(), amount: 14500, type: 'Cargo', description: 'Saldo inicial de deuda' },
      { id: 'm2', customerId: 'c3', date: new Date(Date.now() - 86400000*2).toISOString(), amount: 850, type: 'Cargo', description: 'Saldo inicial de deuda' },
      { id: 'm3', customerId: 'c4', date: new Date(Date.now() - 86400000*1).toISOString(), amount: 2300, type: 'Cargo', description: 'Saldo inicial de deuda' },
    ];
  });

  const [cashSessions, setCashSessions] = useState<CashSession[]>(() => {
    const saved = localStorage.getItem('cashSessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [transformations, setTransformations] = useState<Transformation[]>(() => {
    const saved = localStorage.getItem('transformations');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeEmployee, setActiveEmployee] = useState<Employee | null>(null);

  // Persistence
  useEffect(() => { localStorage.setItem('employees', JSON.stringify(employees)); }, [employees]);
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('sales', JSON.stringify(sales)); }, [sales]);
  useEffect(() => { localStorage.setItem('customers', JSON.stringify(customers)); }, [customers]);
  useEffect(() => { localStorage.setItem('customerMovements', JSON.stringify(customerMovements)); }, [customerMovements]);
  useEffect(() => { localStorage.setItem('cashSessions', JSON.stringify(cashSessions)); }, [cashSessions]);
  useEffect(() => { localStorage.setItem('transformations', JSON.stringify(transformations)); }, [transformations]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // --- Product & Transformation Methods ---
  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [...prev, { ...product, id: generateId() }]);
  };

  const updateProduct = (id: string, productUpdate: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productUpdate } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const transformStock = (sourceProductId: string, sourceQty: number, targets: TransformationTarget[], employeeId: string) => {
    const totalTargetQty = targets.reduce((sum, t) => sum + t.quantity, 0);
    const wasteQuantity = Math.max(0, sourceQty - totalTargetQty);
    
    // Create Audit Log
    const transformation: Transformation = {
      id: generateId(),
      date: new Date().toISOString(),
      sourceProductId,
      sourceQuantity: sourceQty,
      targets,
      wasteQuantity,
      employeeId
    };

    setTransformations(prev => [...prev, transformation]);

    // Update inventory
    setProducts(prev => {
      let newProducts = [...prev];
      // Deduct source
      const sourceIndex = newProducts.findIndex(p => p.id === sourceProductId);
      if (sourceIndex > -1) {
        newProducts[sourceIndex] = { ...newProducts[sourceIndex], stock: newProducts[sourceIndex].stock - sourceQty };
      }
      // Add targets
      targets.forEach(target => {
        const targetIndex = newProducts.findIndex(p => p.id === target.productId);
        if (targetIndex > -1) {
          newProducts[targetIndex] = { ...newProducts[targetIndex], stock: newProducts[targetIndex].stock + target.quantity };
        }
      });
      return newProducts;
    });
  };

  // --- Sales Methods ---
  const addSale = (saleData: Omit<Sale, 'id' | 'date'>): Sale => {
    const newSale: Sale = {
      ...saleData,
      id: generateId(),
      date: new Date().toISOString(),
    };
    
    // 1. Decrease inventory
    let newProducts = [...products];
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

    // 2. Add Sale
    setSales(prev => [...prev, newSale]);

    // 3. Handle Payment Method logic
    if (newSale.paymentMethod === 'Credito' && newSale.customerId) {
      // Add debt to customer
      updateCustomer(newSale.customerId, { 
        balance: (customers.find(c => c.id === newSale.customerId)?.balance || 0) + newSale.total 
      });
      // Add Movement
      setCustomerMovements(prev => [...prev, {
        id: generateId(),
        customerId: newSale.customerId!,
        date: newSale.date,
        amount: newSale.total,
        type: 'Cargo',
        description: `Venta a crédito (Folio: ${newSale.id})`
      }]);
    } else if (newSale.paymentMethod === 'Efectivo') {
      // Register in open cash session
      setCashSessions(prev => prev.map(session => {
        if (session.status === 'Open') {
          const newCashSales = session.cashSales + newSale.total;
          return { ...session, cashSales: newCashSales, expectedCash: session.initialAmount + newCashSales + session.cashIn - session.cashOut };
        }
        return session;
      }));
    } else if (newSale.paymentMethod === 'Tarjeta') {
      setCashSessions(prev => prev.map(session => {
        if (session.status === 'Open') {
          return { ...session, cardSales: session.cardSales + newSale.total };
        }
        return session;
      }));
    }

    return newSale;
  };

  // --- Customer Methods ---
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...customer, id: generateId() }]);
  };

  const updateCustomer = (id: string, customerUpdate: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customerUpdate } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addCustomerPayment = (customerId: string, amount: number, description: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    // Decrease balance
    updateCustomer(customerId, { balance: Math.max(0, customer.balance - amount) });
    
    // Add Movement
    setCustomerMovements(prev => [...prev, {
      id: generateId(),
      customerId,
      date: new Date().toISOString(),
      amount,
      type: 'Abono',
      description
    }]);

    // Automatically add to cash register as cash in
    addCashMovement('in', amount, `Abono Cliente: ${customer.name}`);
  };

  // --- Employee Methods ---
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    setEmployees(prev => [...prev, { ...employee, id: generateId() }]);
  };

  const updateEmployee = (id: string, employeeUpdate: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...employeeUpdate } : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  // --- Cash Register Methods ---
  const openCashSession = (employeeId: string, initialAmount: number) => {
    const newSession: CashSession = {
      id: generateId(),
      startTime: new Date().toISOString(),
      employeeId,
      initialAmount,
      cashSales: 0,
      cardSales: 0,
      cashIn: 0,
      cashOut: 0,
      expectedCash: initialAmount,
      status: 'Open'
    };
    setCashSessions(prev => [...prev, newSession]);
  };

  const closeCashSession = (actualCash: number) => {
    setCashSessions(prev => prev.map(session => {
      if (session.status === 'Open') {
        return {
          ...session,
          status: 'Closed',
          endTime: new Date().toISOString(),
          actualCash
        };
      }
      return session;
    }));
  };

  const addCashMovement = (type: 'in' | 'out', amount: number, description: string) => {
    setCashSessions(prev => prev.map(session => {
      if (session.status === 'Open') {
        const cashIn = type === 'in' ? session.cashIn + amount : session.cashIn;
        const cashOut = type === 'out' ? session.cashOut + amount : session.cashOut;
        const expectedCash = session.initialAmount + session.cashSales + cashIn - cashOut;
        return { ...session, cashIn, cashOut, expectedCash };
      }
      return session;
    }));
  };

  return (
    <StoreContext.Provider value={{
      employees, categories, products, sales, customers, customerMovements, cashSessions, transformations, activeEmployee, setActiveEmployee,
      addProduct, updateProduct, deleteProduct, transformStock,
      addSale,
      addCustomer, updateCustomer, deleteCustomer, addCustomerPayment,
      addEmployee, updateEmployee, deleteEmployee,
      openCashSession, closeCashSession, addCashMovement
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
