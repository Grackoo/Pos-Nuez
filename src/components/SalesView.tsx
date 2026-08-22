import React, { useState } from 'react';
import { Search, ArrowRight, Minus, Plus, ShoppingCart, Trash2, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { SaleItem, Product } from '../types';

export function SalesView() {
  const { products, categories, activeEmployee, addSale } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        setCart(cart.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.priceAtSale }
            : item
        ));
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { productId: product.id, quantity: 1, priceAtSale: product.price, subtotal: product.price }]);
      }
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setCart(cart.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, Math.min(item.quantity + delta, product.stock));
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
    
    addSale({
      employeeId: activeEmployee?.id || 'unknown',
      total: total,
      items: cart
    });
    
    setCheckoutComplete(true);
    setCart([]);
    setTimeout(() => {
      setCheckoutComplete(false);
      setIsCheckout(false);
    }, 3000);
  };

  if (checkoutComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] p-4 text-center">
        <CheckCircle2 size={80} className="text-primary mb-6" />
        <h2 className="text-3xl font-bold text-on-surface mb-2">¡Venta Completada!</h2>
        <p className="text-on-surface-variant">El inventario ha sido actualizado y la venta registrada.</p>
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
            <button 
              key={product.id}
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              className={`bg-surface rounded-xl p-4 border flex flex-col text-left transition-all ${product.stock > 0 ? 'border-outline-variant hover:border-primary hover:shadow-md cursor-pointer' : 'border-error/30 opacity-60 cursor-not-allowed'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-on-surface line-clamp-2">{product.name}</span>
              </div>
              <div className="mt-auto pt-2">
                <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                <p className={`text-xs ${product.stock > 0 ? 'text-on-surface-variant' : 'text-error font-medium'}`}>
                  {product.stock > 0 ? `Stock: ${product.stock} ${product.unit}` : 'Agotado'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Cart Area - Sidebar on Desktop, Bottom Sheet/Overlay on Mobile when checkout active */}
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
                        <span className="font-medium min-w-[1.5rem] text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, 1)} className="w-8 h-8 flex items-center justify-center bg-surface rounded shadow-sm text-on-surface">+</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-4 lg:p-6 lg:bg-surface-container-lowest lg:rounded-2xl lg:border lg:border-outline-variant lg:shadow-sm mt-auto border-t border-outline-variant bg-surface">
          <div className="flex justify-between items-center mb-4 text-lg">
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
    </div>
  );
}
