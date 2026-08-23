import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Lock, LogIn } from 'lucide-react';

export function LoginScreen() {
  const { employees, setActiveEmployee } = useStore();
  const [selectedId, setSelectedId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === selectedId);
    if (!emp) {
      setError('Selecciona un usuario.');
      return;
    }
    if (emp.pin !== pin) {
      setError('PIN incorrecto.');
      return;
    }
    setActiveEmployee(emp);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="bg-surface rounded-2xl p-8 max-w-sm w-full shadow-lg border border-outline-variant text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="text-primary" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">Iniciar Sesión</h1>
        <p className="text-on-surface-variant mb-6 text-sm">Ingresa con tu usuario y PIN para continuar</p>
        
        {error && <div className="bg-error/10 text-error text-sm p-3 rounded-lg mb-4">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="text-left">
            <label className="block text-sm font-medium mb-1">Usuario</label>
            <select 
              value={selectedId} 
              onChange={e => { setSelectedId(e.target.value); setError(''); }}
              className="w-full p-3 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary outline-none"
              required
            >
              <option value="" disabled>Selecciona un usuario</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
              ))}
            </select>
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-medium mb-1">PIN</label>
            <input 
              type="password" 
              maxLength={4}
              value={pin}
              onChange={e => { setPin(e.target.value); setError(''); }}
              placeholder="••••"
              className="w-full p-3 rounded-lg border border-outline bg-surface focus:ring-2 focus:ring-primary outline-none text-center tracking-widest text-lg"
              required
            />
          </div>

          <button type="submit" className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors mt-4">
            <LogIn size={20} /> Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}
