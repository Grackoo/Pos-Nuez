import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, ArrowUpDown, Filter, Activity, X, Factory, FileClock } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { Product, TransformationTarget } from '../types';

export function InventoryView() {
  const { products, categories, activeEmployee, addProduct, updateProduct, deleteProduct, transformStock, transformations } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransformOpen, setIsTransformOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Product Form
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '', categoryId: '', price: 0, stock: 0, unit: 'Kg'
  });

  // Transform Form
  const [sourceId, setSourceId] = useState<string>('');
  const [sourceQty, setSourceQty] = useState<number>(0);
  const [targets, setTargets] = useState<TransformationTarget[]>([{ productId: '', quantity: 0 }]);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? p.categoryId === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(p => p.stock < 10);
  const totalItems = products.reduce((acc, p) => acc + p.stock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.stock * p.price), 0);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setFormData({ name: product.name, categoryId: product.categoryId, price: product.price, stock: product.stock, unit: product.unit });
      setEditingId(product.id);
    } else {
      setFormData({ name: '', categoryId: categories[0]?.id || '', price: 0, stock: 0, unit: 'Kg' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) updateProduct(editingId, formData);
    else addProduct(formData);
    setIsModalOpen(false);
  };

  const handleTransformSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || sourceQty <= 0) return;
    const validTargets = targets.filter(t => t.productId && t.quantity > 0);
    if (validTargets.length === 0) return;
    
    transformStock(sourceId, sourceQty, validTargets, activeEmployee?.id || 'admin');
    setIsTransformOpen(false);
    setSourceId('');
    setSourceQty(0);
    setTargets([{ productId: '', quantity: 0 }]);
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <header className="hidden md:flex justify-between items-center px-6 h-24 w-full border-b border-outline-variant bg-surface sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-primary">Inventario y Almacén</h1>
          <p className="text-sm text-on-surface-variant mt-1">Gestión de productos y transformaciones</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-surface-container text-on-surface rounded-lg hover:bg-surface-container-high transition-colors font-medium text-sm">
            <FileClock size={18} /> Historial
          </button>
          <button onClick={() => setIsTransformOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg hover:bg-secondary/90 transition-colors font-medium text-sm shadow-sm">
            <Factory size={18} /> Transformar Lote
          </button>
          <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm">
            <Plus size={18} /> Nuevo Producto
          </button>
        </div>
      </header>

      {/* Mobile header area omitted for brevity, but similar buttons could be added */}
      <div className="md:hidden flex flex-col gap-2 p-4">
         <h1 className="text-xl font-bold text-primary">Inventario</h1>
         <div className="flex gap-2">
            <button onClick={() => setIsTransformOpen(true)} className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-secondary text-on-secondary rounded-lg text-sm"><Factory size={16}/> Transformar</button>
            <button onClick={() => handleOpenModal()} className="flex-1 flex items-center justify-center gap-2 px-2 py-2 bg-primary text-on-primary rounded-lg text-sm"><Plus size={16}/> Nuevo</button>
         </div>
      </div>

      <div className="p-4 md:p-6 flex-1 max-w-7xl mx-auto w-full flex flex-col gap-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
            <div className="text-sm text-on-surface-variant mb-1">Total Productos</div>
            <div className="text-2xl font-bold text-primary">{products.length}</div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm">
            <div className="text-sm text-on-surface-variant mb-1">Valor del Inventario</div>
            <div className="text-2xl font-bold text-primary">${totalValue.toLocaleString()}</div>
          </div>
          <div className="bg-error/10 border border-error/30 rounded-xl p-4 shadow-sm">
            <div className="text-sm text-error mb-1">Alertas de Stock Bajo</div>
            <div className="text-2xl font-bold text-error">{lowStockProducts.length} <span className="text-sm font-normal">productos</span></div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary outline-none text-sm" 
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter size={20} className="text-on-surface-variant shrink-0" />
            <button onClick={() => setSelectedCategory(null)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === null ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}>
              Todos
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat.id ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="p-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Fecha</th>
                  <th className="p-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Producto</th>
                  <th className="p-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider">Categoría</th>
                  <th className="p-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider text-right">Precio</th>
                  <th className="p-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider text-center">Stock</th>
                  <th className="p-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider text-center">Unidad</th>
                  <th className="p-4 text-xs font-medium text-on-surface-variant uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredProducts.map(product => {
                  const cat = categories.find(c => c.id === product.categoryId);
                  const isLowStock = product.stock < 10;
                  return (
                    <tr key={product.id} className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                      <td className="p-4 text-on-surface-variant text-xs">
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-4 font-medium text-on-surface flex items-center gap-2">
                        {isLowStock && <Activity size={16} className="text-error" />}
                        {product.name}
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        <span className="bg-surface-container-high px-2 py-1 rounded text-xs">{cat?.name}</span>
                      </td>
                      <td className="p-4 text-right font-medium text-primary">${product.price.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <span className={`font-bold ${isLowStock ? 'text-error' : 'text-secondary'}`}>
                          {product.stock.toFixed(3)}
                        </span>
                      </td>
                      <td className="p-4 text-center text-on-surface-variant">{product.unit}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleOpenModal(product)} className="p-2 text-primary hover:bg-primary/10 rounded transition-colors mx-1"><Edit2 size={18} /></button>
                        <button onClick={() => deleteProduct(product.id)} className="p-2 text-error hover:bg-error/10 rounded transition-colors"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Transform */}
      {isTransformOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-2xl shadow-lg relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsTransformOpen(false)} className="absolute top-4 right-4 text-outline hover:text-on-surface"><X size={20} /></button>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Factory className="text-secondary" /> Transformar Lote</h2>
            
            <form onSubmit={handleTransformSubmit} className="space-y-6">
              {/* Origen */}
              <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant">
                <h3 className="text-sm font-bold text-on-surface mb-3 uppercase tracking-wide">Materia Prima (Origen)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1 text-on-surface-variant">Producto a procesar</label>
                    <select required value={sourceId} onChange={e => setSourceId(e.target.value)} className="w-full p-2.5 border border-outline rounded-lg bg-surface focus:ring-2 outline-none text-sm">
                      <option value="">Seleccione un producto...</option>
                      {products.filter(p => p.stock > 0).map(p => <option key={p.id} value={p.id}>{p.name} (Disp: {p.stock} {p.unit})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-on-surface-variant">Cantidad</label>
                    <input required type="number" step="0.001" min="0.001" value={sourceQty} onChange={e => setSourceQty(parseFloat(e.target.value) || 0)} className="w-full p-2.5 border border-outline rounded-lg bg-surface outline-none text-sm" />
                  </div>
                </div>
              </div>

              {/* Destinos */}
              <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-on-surface uppercase tracking-wide">Productos Resultantes (Destino)</h3>
                  <button type="button" onClick={() => setTargets([...targets, {productId: '', quantity: 0}])} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"><Plus size={14}/> Añadir fila</button>
                </div>
                
                <div className="space-y-3">
                  {targets.map((target, idx) => (
                    <div key={idx} className="flex gap-4 items-end">
                      <div className="flex-1">
                        <select required value={target.productId} onChange={e => {
                            const newTargets = [...targets];
                            newTargets[idx].productId = e.target.value;
                            setTargets(newTargets);
                          }} className="w-full p-2.5 border border-outline rounded-lg bg-surface focus:ring-2 outline-none text-sm">
                          <option value="">Seleccione producto destino...</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="w-32">
                        <input required type="number" step="0.001" min="0" placeholder="Cant." value={target.quantity} onChange={e => {
                            const newTargets = [...targets];
                            newTargets[idx].quantity = parseFloat(e.target.value) || 0;
                            setTargets(newTargets);
                          }} className="w-full p-2.5 border border-outline rounded-lg bg-surface outline-none text-sm" />
                      </div>
                      <button type="button" onClick={() => setTargets(targets.filter((_, i) => i !== idx))} className="p-2.5 text-error bg-error/10 rounded-lg hover:bg-error/20"><Trash2 size={18}/></button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-outline-variant flex justify-between items-center">
                  <span className="text-sm font-medium text-on-surface-variant">Merma Calculada:</span>
                  <span className="text-lg font-bold text-error">
                    {Math.max(0, sourceQty - targets.reduce((acc, t) => acc + t.quantity, 0)).toFixed(3)}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsTransformOpen(false)} className="px-5 py-2.5 text-primary bg-surface-container rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-secondary text-on-secondary rounded-lg font-bold shadow-sm">Procesar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal History */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-4xl shadow-lg relative max-h-[90vh] flex flex-col">
            <button onClick={() => setIsHistoryOpen(false)} className="absolute top-4 right-4 text-outline hover:text-on-surface"><X size={20} /></button>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileClock className="text-primary" /> Historial de Transformaciones (Auditoría)</h2>
            
            <div className="flex-1 overflow-y-auto border border-outline-variant rounded-lg bg-surface-container-lowest">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container border-b border-outline-variant sticky top-0">
                  <tr>
                    <th className="p-3 font-medium text-on-surface-variant">Fecha</th>
                    <th className="p-3 font-medium text-on-surface-variant">Origen</th>
                    <th className="p-3 font-medium text-on-surface-variant">Cant.</th>
                    <th className="p-3 font-medium text-on-surface-variant">Destinos (Resultados)</th>
                    <th className="p-3 font-medium text-on-surface-variant text-right">Merma</th>
                  </tr>
                </thead>
                <tbody>
                  {transformations.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(t => {
                    const source = products.find(p => p.id === t.sourceProductId);
                    return (
                      <tr key={t.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low">
                        <td className="p-3 whitespace-nowrap text-on-surface-variant">{new Date(t.date).toLocaleDateString()} {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="p-3 font-medium text-on-surface">{source?.name || 'Prod. Eliminado'}</td>
                        <td className="p-3 text-secondary font-bold">{t.sourceQuantity.toFixed(3)}</td>
                        <td className="p-3">
                          <ul className="text-xs space-y-1">
                            {t.targets.map((tgt, i) => {
                              const dest = products.find(p => p.id === tgt.productId);
                              return (
                                <li key={i}><span className="font-medium text-primary">+{tgt.quantity.toFixed(3)}</span> {dest?.name || 'Desconocido'}</li>
                              )
                            })}
                          </ul>
                        </td>
                        <td className="p-3 text-right font-bold text-error">{t.wasteQuantity.toFixed(3)}</td>
                      </tr>
                    );
                  })}
                  {transformations.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-on-surface-variant">No hay transformaciones registradas.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal CRUD Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-outline hover:text-on-surface"><X size={20} /></button>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-outline rounded-lg bg-surface outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-2 border border-outline rounded-lg bg-surface outline-none focus:ring-2 focus:ring-primary">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unidad</label>
                  <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value as any})} className="w-full p-2 border border-outline rounded-lg bg-surface outline-none focus:ring-2 focus:ring-primary">
                    <option>Kg</option><option>Gramos</option><option>Pieza</option><option>Paquete</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Precio ($)</label>
                  <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-outline rounded-lg bg-surface outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock Inicial</label>
                  <input required type="number" min="0" step="0.001" value={formData.stock} onChange={e => setFormData({...formData, stock: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-outline rounded-lg bg-surface outline-none focus:ring-2 focus:ring-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-on-surface-variant">Fecha de Registro (Opcional)</label>
                <input 
                  type="datetime-local" 
                  value={formData.createdAt ? formData.createdAt.slice(0, 16) : ''} 
                  onChange={e => setFormData({...formData, createdAt: e.target.value ? new Date(e.target.value).toISOString() : undefined})} 
                  className="w-full p-2 border border-outline rounded-lg bg-surface outline-none focus:ring-2 focus:ring-primary text-sm" 
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg font-medium">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
