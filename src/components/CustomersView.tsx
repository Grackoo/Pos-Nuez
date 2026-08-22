import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, Banknote, Edit, Trash2, Plus, X } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { Customer } from '../types';

export function CustomersView() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'Todos' | 'Pendiente' | 'Al Dia'>('Todos');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: '',
    phone: '',
    email: '',
    balance: 0
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' ? true : filter === 'Pendiente' ? c.balance > 0 : c.balance <= 0;
    return matchesSearch && matchesFilter;
  });

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        balance: customer.balance
      });
      setEditingId(customer.id);
    } else {
      setFormData({
        name: '',
        phone: '',
        email: '',
        balance: 0
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCustomer(editingId, formData);
    } else {
      addCustomer(formData);
    }
    setIsModalOpen(false);
  };

  const handlePayment = (customer: Customer) => {
    // Simple prompt for demo payment
    const amount = window.prompt(`¿Monto a abonar para ${customer.name}? (Deuda: $${customer.balance.toFixed(2)})`);
    if (amount) {
      const val = parseFloat(amount);
      if (!isNaN(val) && val > 0) {
        updateCustomer(customer.id, { balance: Math.max(0, customer.balance - val) });
      }
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6 h-full">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Directorio de Clientes</h1>
          <p className="text-on-surface-variant text-sm">Gestiona clientes y su estado de cuenta.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Plus size={18} />
          <span className="text-sm">Nuevo Cliente</span>
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm" 
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilter('Todos')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === 'Todos' ? 'bg-primary text-on-primary' : 'border border-outline bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('Pendiente')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${filter === 'Pendiente' ? 'bg-error text-on-error border-error' : 'border border-outline bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}
          >
            <span className={`w-2 h-2 rounded-full ${filter === 'Pendiente' ? 'bg-on-error' : 'bg-error'}`}></span> Saldo Pendiente
          </button>
          <button 
            onClick={() => setFilter('Al Dia')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${filter === 'Al Dia' ? 'bg-secondary text-on-secondary border-secondary' : 'border border-outline bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}
          >
            <span className={`w-2 h-2 rounded-full ${filter === 'Al Dia' ? 'bg-on-secondary' : 'bg-secondary'}`}></span> Al Día
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => {
          const isPendiente = customer.balance > 0;
          
          return (
            <div key={customer.id} className={`bg-surface rounded-xl p-4 border relative shadow-sm ${isPendiente ? 'border-error/50' : 'border-secondary/50'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center text-primary font-bold text-lg border border-outline">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-on-surface line-clamp-1">{customer.name}</h2>
                    <p className="text-xs text-on-surface-variant">{customer.phone || 'Sin teléfono'}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium gap-1 ${isPendiente ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'}`}>
                  {isPendiente ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                  {isPendiente ? 'Pendiente' : 'Al Día'}
                </span>
              </div>

              <div className="bg-surface-container-lowest rounded-lg p-3 mb-4 border border-outline-variant">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">{isPendiente ? 'Deuda Total' : 'Balance'}</span>
                  <span className={`text-lg font-bold ${isPendiente ? 'text-error' : 'text-secondary'}`}>
                    ${customer.balance.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handlePayment(customer)}
                  disabled={!isPendiente}
                  className={`flex-1 rounded-lg text-sm font-medium h-10 flex items-center justify-center gap-2 transition-colors ${isPendiente ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-container text-outline cursor-not-allowed'}`}
                >
                  <Banknote size={16} />
                  Abonar
                </button>
                <button onClick={() => handleOpenModal(customer)} className="w-10 border border-outline text-primary rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Edit size={16} />
                </button>
                <button onClick={() => deleteCustomer(customer.id)} className="w-10 border border-outline text-error rounded-lg flex items-center justify-center hover:bg-error/10 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
        
        {filteredCustomers.length === 0 && (
          <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface rounded-xl border border-outline-variant border-dashed">
            No se encontraron clientes que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-outline hover:text-on-surface">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input 
                  required type="text" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input 
                    type="tel"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input 
                    type="email"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Deuda Inicial ($)</label>
                <input 
                  type="number" min="0" step="0.01"
                  value={formData.balance} onChange={e => setFormData({...formData, balance: parseFloat(e.target.value) || 0})}
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
