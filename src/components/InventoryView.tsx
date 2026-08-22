import React, { useState } from 'react';
import { Download, Plus, Warehouse, AlertTriangle, Tags, Search, MoreVertical, Edit, Trash2, X } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { Product } from '../types';

export function InventoryView() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    categoryId: categories[0]?.id || '',
    price: 0,
    stock: 0,
    unit: 'Kg'
  });

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock < 10);
  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? p.categoryId === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setFormData({
        name: product.name,
        categoryId: product.categoryId,
        price: product.price,
        stock: product.stock,
        unit: product.unit
      });
      setEditingId(product.id);
    } else {
      setFormData({
        name: '',
        categoryId: categories[0]?.id || '',
        price: 0,
        stock: 0,
        unit: 'Kg'
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-1">Inventario</h1>
          <p className="text-on-surface-variant text-sm">Control de existencias y presentaciones en tiempo real.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-surface-container border border-outline-variant text-on-surface rounded-lg hover:bg-surface-container-high transition-colors">
            <Download size={18} />
            <span className="text-sm">Exportar</span>
          </button>
          <button onClick={() => handleOpenModal()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            <Plus size={18} />
            <span className="text-sm">Nuevo Producto</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl p-6 border border-outline-variant flex items-start gap-4">
          <div className="p-3 bg-secondary/10 text-secondary rounded-lg">
            <Warehouse size={24} />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Total Unidades</p>
            <p className="text-2xl font-bold text-on-surface">{totalStock.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-error/20 flex items-start gap-4">
          <div className="p-3 bg-error/10 text-error rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-xs text-error uppercase tracking-wider mb-1">Stock Bajo</p>
            <p className="text-2xl font-bold text-on-surface">{lowStockProducts.length}</p>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-outline-variant flex items-start gap-4">
          <div className="p-3 bg-tertiary/10 text-tertiary rounded-lg">
            <Tags size={24} />
          </div>
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider mb-1">Categorías</p>
            <p className="text-2xl font-bold text-on-surface">{categories.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col h-full">
        <div className="p-4 border-b border-outline-variant flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-10 pr-4 bg-surface border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm" 
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <button 
              onClick={() => setFilterCategory(null)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filterCategory === null ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
            >
              Todas
            </button>
            {categories.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setFilterCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${filterCategory === cat.id ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold w-1/3">Producto</th>
                <th className="p-4 font-semibold text-center w-1/6">Categoría</th>
                <th className="p-4 font-semibold text-right w-1/4">Stock</th>
                <th className="p-4 font-semibold text-right w-1/6">Precio</th>
                <th className="p-4 font-semibold text-center w-1/12">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProducts.map(product => {
                const category = categories.find(c => c.id === product.categoryId);
                const isLowStock = product.stock < 10;
                return (
                  <tr key={product.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-on-surface">{product.name}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block px-2 py-1 bg-surface-variant rounded-md text-xs">{category?.name}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        {isLowStock && <AlertTriangle size={14} className="text-error" />}
                        <span className={`font-bold ${isLowStock ? 'text-error' : 'text-on-surface'}`}>
                          {product.stock} {product.unit}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-medium">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleOpenModal(product)} className="p-1 text-primary hover:bg-primary/10 rounded">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => deleteProduct(product.id)} className="p-1 text-error hover:bg-error/10 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-outline hover:text-on-surface">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre del producto</label>
                <input 
                  required type="text" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Categoría</label>
                <select 
                  value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio ($)</label>
                  <input 
                    required type="number" min="0" step="0.01"
                    value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unidad</label>
                  <select 
                    value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value as any})}
                    className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Gramos">Gramos</option>
                    <option value="Pieza">Pieza</option>
                    <option value="Paquete">Paquete</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Stock Inicial</label>
                <input 
                  required type="number" min="0" step="0.01"
                  value={formData.stock} onChange={e => setFormData({...formData, stock: parseFloat(e.target.value) || 0})}
                  className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
