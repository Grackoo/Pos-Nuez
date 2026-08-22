import React, { useState } from 'react';
import { Search, AlertTriangle, CheckCircle2, Banknote, Edit, Trash2, Plus, X, Receipt, Printer } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { Customer } from '../types';

export function CustomersView() {
  const { customers, customerMovements, addCustomer, updateCustomer, deleteCustomer, addCustomerPayment } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'Todos' | 'Pendiente' | 'Al Dia'>('Todos');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({ name: '', phone: '', email: '', balance: 0 });

  const [isKardexOpen, setIsKardexOpen] = useState(false);
  const [kardexCustomer, setKardexCustomer] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Todos' ? true : filter === 'Pendiente' ? c.balance > 0 : c.balance <= 0;
    return matchesSearch && matchesFilter;
  });

  const handleOpenModal = (customer?: Customer) => {
    if (customer) {
      setFormData({ name: customer.name, phone: customer.phone, email: customer.email, balance: customer.balance });
      setEditingId(customer.id);
    } else {
      setFormData({ name: '', phone: '', email: '', balance: 0 });
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
    const amount = window.prompt(`¿Monto a abonar para ${customer.name}? (Deuda actual: $${customer.balance.toFixed(2)})`);
    if (amount) {
      const val = parseFloat(amount);
      if (!isNaN(val) && val > 0) {
        addCustomerPayment(customer.id, val, `Abono en efectivo`);
      }
    }
  };

  const openKardex = (customer: Customer) => {
    setKardexCustomer(customer);
    setIsKardexOpen(true);
  };

  const printKardex = () => {
    window.alert(`Generando PDF del Estado de Cuenta para ${kardexCustomer?.name}...\n\n(Simulación de impresión lista para producción)`);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col gap-6 h-full">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Directorio de Clientes</h1>
          <p className="text-on-surface-variant text-sm">Gestiona clientes, cobros y estados de cuenta.</p>
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
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none text-sm" 
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilter('Todos')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'Todos' ? 'bg-primary text-on-primary' : 'border border-outline bg-surface-container-lowest text-on-surface'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter('Pendiente')}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${filter === 'Pendiente' ? 'bg-error text-on-error border-error' : 'border border-outline bg-surface-container-lowest text-on-surface'}`}
          >
            <span className={`w-2 h-2 rounded-full ${filter === 'Pendiente' ? 'bg-on-error' : 'bg-error'}`}></span> Con Deuda
          </button>
          <button 
            onClick={() => setFilter('Al Dia')}
            className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${filter === 'Al Dia' ? 'bg-secondary text-on-secondary border-secondary' : 'border border-outline bg-surface-container-lowest text-on-surface'}`}
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
                  className={`flex-1 rounded-lg text-xs font-medium h-10 flex items-center justify-center gap-1 transition-colors ${isPendiente ? 'bg-primary text-on-primary hover:bg-primary/90' : 'bg-surface-container text-outline cursor-not-allowed'}`}
                >
                  <Banknote size={16} /> Abonar
                </button>
                <button onClick={() => openKardex(customer)} className="flex-1 border border-outline text-on-surface rounded-lg text-xs font-medium h-10 flex items-center justify-center gap-1 hover:bg-surface-container transition-colors">
                  <Receipt size={16} /> Kárdex
                </button>
                <button onClick={() => handleOpenModal(customer)} className="w-10 border border-outline text-primary rounded-lg flex items-center justify-center hover:bg-primary/10 transition-colors">
                  <Edit size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Kardex */}
      {isKardexOpen && kardexCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-2xl shadow-lg relative flex flex-col max-h-[90vh]">
            <button onClick={() => setIsKardexOpen(false)} className="absolute top-4 right-4 text-outline hover:text-on-surface">
              <X size={20} />
            </button>
            <div className="flex justify-between items-start mb-6 pr-6">
              <div>
                <h2 className="text-xl font-bold">Estado de Cuenta (Kárdex)</h2>
                <p className="text-on-surface-variant">{kardexCustomer.name}</p>
              </div>
              <button onClick={printKardex} className="flex items-center gap-2 px-3 py-1.5 bg-surface-container text-primary rounded-lg text-sm hover:bg-surface-container-high transition-colors border border-outline">
                <Printer size={16} /> Imprimir PDF
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-4 border border-outline-variant rounded-lg bg-surface-container-lowest">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container border-b border-outline-variant sticky top-0">
                  <tr>
                    <th className="p-3 font-medium text-on-surface-variant">Fecha</th>
                    <th className="p-3 font-medium text-on-surface-variant">Concepto</th>
                    <th className="p-3 font-medium text-on-surface-variant text-right">Cargo</th>
                    <th className="p-3 font-medium text-on-surface-variant text-right">Abono</th>
                  </tr>
                </thead>
                <tbody>
                  {customerMovements
                    .filter(m => m.customerId === kardexCustomer.id)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(m => (
                    <tr key={m.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors">
                      <td className="p-3 whitespace-nowrap text-on-surface-variant">{new Date(m.date).toLocaleDateString()} {new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                      <td className="p-3 font-medium">{m.description}</td>
                      <td className="p-3 text-right text-error font-mono">{m.type === 'Cargo' ? `$${m.amount.toFixed(2)}` : ''}</td>
                      <td className="p-3 text-right text-secondary font-mono">{m.type === 'Abono' ? `$${m.amount.toFixed(2)}` : ''}</td>
                    </tr>
                  ))}
                  {customerMovements.filter(m => m.customerId === kardexCustomer.id).length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-on-surface-variant">No hay movimientos registrados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center bg-surface-container p-4 rounded-lg border border-outline-variant">
              <span className="font-bold text-on-surface">Saldo Actual</span>
              <span className={`text-2xl font-bold ${kardexCustomer.balance > 0 ? 'text-error' : 'text-secondary'}`}>
                ${kardexCustomer.balance.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit/Create */}
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
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 border border-outline rounded-lg focus:ring-2 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Teléfono</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 border border-outline rounded-lg outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 border border-outline rounded-lg outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deuda Inicial ($)</label>
                <input type="number" min="0" step="0.01" value={formData.balance} onChange={e => setFormData({...formData, balance: parseFloat(e.target.value) || 0})} className="w-full p-2 border border-outline rounded-lg outline-none" />
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
