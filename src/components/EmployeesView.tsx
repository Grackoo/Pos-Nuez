import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { UserPlus, Edit, Trash2 } from 'lucide-react';

export function EmployeesView() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', role: 'Cajero' as 'Admin' | 'Cajero', pin: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateEmployee(editingId, formData);
      setEditingId(null);
    } else {
      addEmployee(formData);
      setIsAdding(false);
    }
    setFormData({ name: '', role: 'Cajero', pin: '' });
  };

  const handleEdit = (employee: any) => {
    setFormData({ name: employee.name, role: employee.role, pin: employee.pin });
    setEditingId(employee.id);
    setIsAdding(true);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Empleados</h1>
        <button
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', role: 'Cajero', pin: '' }); }}
          className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          <UserPlus size={20} />
          <span className="hidden sm:inline">Nuevo Empleado</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-surface p-4 rounded-xl border border-outline-variant mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{editingId ? 'Editar Empleado' : 'Nuevo Empleado'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Rol</label>
              <select
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Cajero' })}
                className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="Cajero">Cajero</option>
                <option value="Admin">Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">PIN (para cobro)</label>
              <input
                required
                type="text"
                maxLength={4}
                value={formData.pin}
                onChange={e => setFormData({ ...formData, pin: e.target.value.replace(/\D/g, '') })}
                className="w-full p-2 border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-on-primary rounded-lg hover:bg-primary/90"
            >
              Guardar
            </button>
          </div>
        </form>
      )}

      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="p-4 font-semibold text-on-surface">Nombre</th>
                <th className="p-4 font-semibold text-on-surface">Rol</th>
                <th className="p-4 font-semibold text-on-surface">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-lowest">
                  <td className="p-4">{emp.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.role === 'Admin' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(emp)} className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteEmployee(emp.id)} className="p-2 text-error hover:bg-error/10 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
