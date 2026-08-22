import React, { useState } from 'react';
import { Search, ArrowRight, Minus, Plus, ShoppingCart, Trash2, CheckCircle2, Calculator, Receipt, X, Printer } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { SaleItem, Product, PaymentMethod, Sale } from '../types';

export function SalesView() {
  const { products, categories, customers, employees, activeEmployee, addSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Efectivo');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');

  const [isCalcModalOpen, setIsCalcModalOpen] = useState(false);
  const [calcProduct, setCalcProduct] = useState<Product | null>(null);
  const [calcMode, setCalcMode] = useState<'qty' | 'amount'>('qty');
  const [calcValue, setCalcValue] = useState<string>('');

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity + quantity <= product.stock) {
        setCart(cart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.priceAtSale }
            : item
        ));
      }
    } else {
      if (product.stock >= quantity) {
        setCart([...cart, { productId: product.id, quantity: quantity, priceAtSale: product.price, subtotal: product.price * quantity }]);
      }
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(0.01, Math.min(item.quantity + delta, product.stock));
        return { ...item, quantity: newQty, subtotal: newQty * item.priceAtSale };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const total = cart.reduce((acc, item) => acc + item.subtotal, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'Credito' && !selectedCustomerId) {
      alert("Debe seleccionar un cliente para compras a crédito");
      return;
    }
    
    const newSale = addSale({
      employeeId: activeEmployee?.id || 'unknown',
      total: total,
      items: cart,
      paymentMethod,
      customerId: selectedCustomerId || undefined
    });
    
    setCompletedSale(newSale);
    setCart([]);
    setSelectedCustomerId('');
    setPaymentMethod('Efectivo');
  };

  const closeTicketModal = () => {
    setCompletedSale(null);
    setIsCheckout(false);
  };

  const handlePrintTicket = () => {
    window.alert("Imprimiendo ticket...");
  };

  const handleCalcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calcProduct) return;
    let qty = 0;
    const val = parseFloat(calcValue);
    if (isNaN(val) || val <= 0) return;

    if (calcMode === 'qty') {
      qty = val;
    } else {
      qty = val / calcProduct.price;
    }
    
    qty = Math.round(qty * 1000) / 1000;
    
    if (qty > calcProduct.stock) {
      alert("No hay suficiente stock");
      return;
    }

    addToCart(calcProduct, qty);
    setIsCalcModalOpen(false);
    setCalcValue('');
  };

  if (completedSale) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-5rem)] p-4 bg-background z-50">
        <div className="bg-surface rounded-xl p-6 w-full max-w-sm shadow-lg relative flex flex-col max-h-[90vh]">
          <button onClick={closeTicketModal} className="absolute top-4 right-4 text-outline hover:text-on-surface">
            <X size={20} />
          </button>
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-primary"><CheckCircle2 className="text-primary" /> Venta Exitosa</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto border-t border-b border-outline-variant py-4 space-y-4">
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">Pos Venta de Nuez</h3>
              <p className="text-sm text-on-surface-variant">{new Date(completedSale.date).toLocaleString()}</p>
              <p className="text-xs text-on-surface-variant mt-1">Folio: {completedSale.id}</p>
              <p className="text-xs text-on-surface-variant">Atendió: {employees.find(e => e.id === completedSale.employeeId)?.name || 'Cajero'}</p>
            </div>

            {completedSale.customerId && (
              <div className="bg-surface-container-low p-2 rounded text-sm text-center border border-outline-variant">
                <span className="text-on-surface-variant block text-xs">Cliente:</span>
                <span className="font-bold">{customers.find(c => c.id === completedSale.customerId)?.name || 'Desconocido'}</span>
              </div>
            )}

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant text-on-surface-variant">
                  <th className="text-left font-normal pb-2">Cant</th>
                  <th className="text-left font-normal pb-2">Descripción</th>
                  <th className="text-right font-normal pb-2">Importe</th>
                </tr>
              </thead>
              <tbody>
                {completedSale.items.map((item, idx) => {
                  const prod = products.find(p => p.id === item.productId);
                  return (
                    <tr key={idx} className="border-b border-outline-variant border-dashed">
                      <td className="py-2 align-top">{Number.isInteger(item.quantity) ? item.quantity : item.quantity.toFixed(3)}</td>
                      <td className="py-2">
                        <div>{prod?.name || 'Producto eliminado'}</div>
                        <div className="text-xs text-on-surface-variant">${item.priceAtSale.toFixed(2)} c/u</div>
                      </td>
                      <td className="py-2 text-right align-top">${item.subtotal.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pt-2 text-right">
              <div className="text-sm text-on-surface-variant mb-1">Método de pago: <span className="font-medium text-on-surface">{completedSale.paymentMethod}</span></div>
              <div className="text-xl font-bold text-primary">Total: ${completedSale.total.toFixed(2)}</div>
            </div>
            
            <div className="text-center text-xs text-on-surface-variant mt-4">
              ¡Gracias por su compra!
            </div>
          </div>

          <div className="mt-4 flex gap-3 pt-2">
            <button onClick={closeTicketModal} className="flex-1 py-3 bg-surface-container text-on-surface rounded-lg font-medium hover:bg-surface-container-high transition-colors">
              Cerrar
            </button>
            <button onClick={handlePrintTicket} className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
              <Printer size={18} /> Imprimir
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-5rem)] p-4 md:p-6 gap-6 max-w-7xl mx-auto">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Punto de Venta</h1>
          <p className="text-on-surface-variant text-sm">Selecciona productos para agregar al carrito</p>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategoryId(null)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedCategoryId === null ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high'}`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${selectedCategoryId === cat.id ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline" size={20} />
          <input 
            type="text" 
            placeholder="Buscar producto..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline bg-surface focus:ring-2 focus:ring-primary outline-none"
          />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24 lg:pb-0 overflow-y-auto">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              className={`bg-surface rounded-xl p-4 border flex flex-col text-left transition-all ${product.stock > 0 ? 'border-outline-variant hover:border-primary hover:shadow-md' : 'border-error/30 opacity-60'}`}
            >
              <div className="flex justify-between items-start mb-2" onClick={() => product.stock > 0 && addToCart(product, 1)}>
                <span className="font-semibold text-on-surface line-clamp-2 cursor-pointer">{product.name}</span>
              </div>
              <div className="mt-auto pt-2 flex justify-between items-end">
                <div onClick={() => product.stock > 0 && addToCart(product, 1)} className="cursor-pointer flex-1">
                  <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                  <p className={`text-xs ${product.stock > 0 ? 'text-on-surface-variant' : 'text-error font-medium'}`}>
                    {product.stock > 0 ? `Stock: ${product.stock} ${product.unit}` : 'Agotado'}
                  </p>
                </div>
                {['Kg', 'Gramos'].includes(product.unit) && product.stock > 0 && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setCalcProduct(product);
                      setIsCalcModalOpen(true);
                      setCalcValue('');
                    }}
                    className="p-2 bg-surface-container text-primary rounded-lg hover:bg-surface-container-high ml-2"
                  >
                    <Calculator size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Area */}
      <div className={`
        fixed inset-0 z-50 bg-surface flex flex-col lg:static lg:w-96 lg:bg-transparent lg:border-l lg:border-outline-variant lg:pl-6
        ${isCheckout ? 'flex' : 'hidden lg:flex'}
      `}>
        <div className="lg:hidden p-4 border-b border-outline-variant flex justify-between items-center bg-surface">
          <h2 className="text-xl font-bold flex items-center gap-2"><ShoppingCart /> Carrito</h2>
          <button onClick={() => setIsCheckout(false)} className="px-4 py-2 bg-surface-container rounded-lg font-medium">Volver</button>
        </div>

        <div className="hidden lg:flex items-center gap-2 mb-6">
          <ShoppingCart className="text-primary" />
          <h2 className="text-xl font-bold text-primary">Carrito Actual</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-0">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-on-surface-variant opacity-60">
              <ShoppingCart size={48} className="mb-4" />
              <p>El carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => {
                const product = products.find(p => p.id === item.productId);
                if (!product) return null;
                
                return (
                  <div key={item.productId} className="flex flex-col p-3 bg-surface border border-outline-variant rounded-xl gap-2 shadow-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-on-surface">{product.name}</span>
                      <button onClick={() => removeFromCart(item.productId)} className="text-error hover:bg-error/10 p-1 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-bold text-primary">${item.subtotal.toFixed(2)}</span>
                      <div className="flex items-center gap-3 bg-surface-container rounded-lg p-1">
                        <button onClick={() => updateQuantity(item.productId, -1)} className="w-8 h-8 flex items-center justify-center bg-surface rounded shadow-sm text-on-surface">-</button>
                        <span className="font-medium min-w-[3rem] text-center">{Number.isInteger(item.quantity) ? item.quantity : item.quantity.toFixed(3)}</span>
                        <button onClick={() => updateQuantity(item.productId, 1)} className="w-8 h-8 flex items-center justify-center bg-surface rounded shadow-sm text-on-surface">+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Checkout panel */}
        <div className="p-4 lg:p-6 lg:bg-surface-container-lowest lg:rounded-2xl lg:border lg:border-outline-variant lg:shadow-sm mt-auto border-t border-outline-variant bg-surface flex flex-col gap-4">
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-on-surface-variant font-medium">Método de Pago</label>
            <div className="grid grid-cols-3 gap-2">
              {['Efectivo', 'Tarjeta', 'Credito'].map(m => (
                <button 
                  key={m}
                  onClick={() => setPaymentMethod(m as PaymentMethod)}
                  className={`py-2 text-sm rounded-lg border transition-colors ${paymentMethod === m ? 'bg-primary/10 border-primary text-primary font-medium' : 'bg-surface-container border-outline text-on-surface'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-on-surface-variant font-medium">Cliente (Opcional, Obligatorio para Crédito)</label>
            <select 
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full p-2 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary outline-none text-sm"
            >
              <option value="">Consumidor Final</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex justify-between items-center mt-2 text-lg">
            <span className="text-on-surface-variant">Total:</span>
            <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            Cobrar <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Floating Cart Button */}
      {!isCheckout && cart.length > 0 && (
        <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
          <button 
            onClick={() => setIsCheckout(true)}
            className="w-full bg-primary text-on-primary p-4 rounded-xl shadow-lg flex justify-between items-center font-bold"
          >
            <div className="flex items-center gap-2">
              <ShoppingCart />
              <span>Ver Carrito ({cart.length})</span>
            </div>
            <span>${total.toFixed(2)}</span>
          </button>
        </div>
      )}

      {/* Calc Modal for bulk */}
      {isCalcModalOpen && calcProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-sm shadow-lg relative">
            <h3 className="text-lg font-bold mb-4">Venta a Granel - {calcProduct.name}</h3>
            <div className="flex gap-2 mb-4 bg-surface-container rounded-lg p-1">
              <button 
                className={`flex-1 py-1 rounded text-sm ${calcMode === 'qty' ? 'bg-primary text-on-primary' : ''}`}
                onClick={() => { setCalcMode('qty'); setCalcValue(''); }}
              >
                Por Peso
              </button>
              <button 
                className={`flex-1 py-1 rounded text-sm ${calcMode === 'amount' ? 'bg-primary text-on-primary' : ''}`}
                onClick={() => { setCalcMode('amount'); setCalcValue(''); }}
              >
                Por Monto ($)
              </button>
            </div>
            <form onSubmit={handleCalcSubmit}>
              <div className="relative mb-4">
                <input 
                  type="number" step="0.001" min="0" required
                  autoFocus
                  value={calcValue} onChange={e => setCalcValue(e.target.value)}
                  placeholder={calcMode === 'qty' ? `Ej. 0.250 (${calcProduct.unit})` : `Ej. 50.00`}
                  className="w-full p-3 rounded-lg border border-outline bg-surface text-lg text-center focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              {calcMode === 'amount' && calcValue && !isNaN(parseFloat(calcValue)) && (
                <p className="text-center text-sm text-on-surface-variant mb-4">
                  Equivale a: <span className="font-bold text-primary">{(parseFloat(calcValue) / calcProduct.price).toFixed(3)} {calcProduct.unit}</span>
                </p>
              )}
              {calcMode === 'qty' && calcValue && !isNaN(parseFloat(calcValue)) && (
                <p className="text-center text-sm text-on-surface-variant mb-4">
                  Subtotal: <span className="font-bold text-primary">${(parseFloat(calcValue) * calcProduct.price).toFixed(2)}</span>
                </p>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setIsCalcModalOpen(false)} className="flex-1 p-2 bg-surface-container rounded-lg text-sm">Cancelar</button>
                <button type="submit" className="flex-1 p-2 bg-primary text-on-primary rounded-lg text-sm">Agregar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
