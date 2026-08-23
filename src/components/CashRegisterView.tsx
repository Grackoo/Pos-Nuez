import React, { useState } from 'react';
import { Wallet, ArrowDownCircle, ArrowUpCircle, Lock, LockKeyhole, DollarSign } from 'lucide-react';
import { useStore } from '../store/StoreContext';

export function CashRegisterView() {
  const { cashSessions, activeEmployee, openCashSession, closeCashSession, addCashMovement } = useStore();
  
  const currentSession = cashSessions.find(s => s.status === 'Open');
  
  const [initialCash, setInitialCash] = useState<number>(0);
  const [actualCash, setActualCash] = useState<number>(0);
  const [movementAmount, setMovementAmount] = useState<number>(0);
  const [movementDesc, setMovementDesc] = useState<string>('');

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');

  const handleOpenSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmployee) {
      alert('Debes estar logueado para abrir turno.');
      return;
    }
    openCashSession(activeEmployee.id, initialCash);
    setInitialCash(0);
  };

  const handleCloseSession = (e: React.FormEvent) => {
    e.preventDefault();
    closeCashSession(actualCash);
    setIsCloseModalOpen(false);
    setActualCash(0);
  };

  const handleMovementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (movementAmount <= 0) return;
    addCashMovement(movementType, movementAmount, movementDesc);
    setIsMovementModalOpen(false);
    setMovementAmount(0);
    setMovementDesc('');
  };

  if (!currentSession) {
    return (
      <div className="flex flex-col items-center justify-start h-full p-4 gap-6 max-w-4xl mx-auto overflow-y-auto">
        <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-lg border border-outline-variant text-center mt-10">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-primary" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-2">Caja Cerrada</h2>
          <p className="text-on-surface-variant mb-8">Abre un nuevo turno para poder realizar ventas en efectivo y registrar movimientos.</p>
          
          <form onSubmit={handleOpenSession} className="space-y-6">
            <div className="text-left">
              <label className="block text-sm font-medium mb-2 text-on-surface-variant">Fondo Inicial en Caja ($)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                <input 
                  type="number" step="0.01" min="0" required
                  value={initialCash} onChange={e => setInitialCash(parseFloat(e.target.value) || 0)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-outline bg-surface-container-lowest text-xl font-medium focus:ring-2 focus:ring-primary outline-none" 
                  autoFocus
                />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-primary text-on-primary rounded-xl font-bold text-lg hover:bg-primary/90 transition-colors">
              Abrir Turno
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-5rem)] p-4 md:p-6 gap-6 max-w-4xl mx-auto">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-primary flex items-center gap-2"><Wallet /> Control de Caja</h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Turno abierto: {new Date(currentSession.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>
        <button 
          onClick={() => { setActualCash(currentSession.expectedCash); setIsCloseModalOpen(true); }}
          className="px-6 py-3 bg-error text-on-error rounded-xl font-bold flex items-center gap-2 hover:bg-error/90 transition-colors shadow-sm"
        >
          <LockKeyhole size={20} /> Cerrar Turno (Corte Z)
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Fondo Inicial</span>
          <span className="text-3xl font-bold text-on-surface">${currentSession.initialAmount.toFixed(2)}</span>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-outline-variant shadow-sm flex flex-col justify-between">
          <span className="text-sm font-medium text-on-surface-variant uppercase tracking-wider mb-2">Ventas Efectivo</span>
          <span className="text-3xl font-bold text-secondary">+${currentSession.cashSales.toFixed(2)}</span>
        </div>
        <div className="bg-primary/10 rounded-xl p-6 border border-primary/20 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Efectivo Esperado</span>
          <span className="text-4xl font-black text-primary">${currentSession.expectedCash.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <div className="bg-surface rounded-xl p-6 border border-outline-variant shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-on-surface">Entradas de Efectivo</h3>
            <span className="text-xl font-bold text-secondary">+${currentSession.cashIn.toFixed(2)}</span>
          </div>
          <button onClick={() => { setMovementType('in'); setIsMovementModalOpen(true); }} className="w-full py-3 border border-secondary text-secondary rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-secondary/10 transition-colors">
            <ArrowDownCircle size={18} /> Registrar Ingreso Manual
          </button>
        </div>
        
        <div className="bg-surface rounded-xl p-6 border border-outline-variant shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-on-surface">Salidas de Efectivo</h3>
            <span className="text-xl font-bold text-error">-${currentSession.cashOut.toFixed(2)}</span>
          </div>
          <button onClick={() => { setMovementType('out'); setIsMovementModalOpen(true); }} className="w-full py-3 border border-error text-error rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-error/10 transition-colors">
            <ArrowUpCircle size={18} /> Registrar Retiro / Gasto
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant text-sm text-on-surface-variant flex justify-between items-center mt-auto">
        <span>Ventas con Tarjeta (No suman en caja): <strong className="text-on-surface">${currentSession.cardSales.toFixed(2)}</strong></span>
      </div>

      {/* Movement Modal */}
      {isMovementModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-lg relative">
            <h2 className={`text-xl font-bold mb-6 ${movementType === 'in' ? 'text-secondary' : 'text-error'}`}>
              Registrar {movementType === 'in' ? 'Entrada' : 'Salida'} de Efectivo
            </h2>
            <form onSubmit={handleMovementSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Monto ($)</label>
                <input required type="number" step="0.01" min="0.01" value={movementAmount} onChange={e => setMovementAmount(parseFloat(e.target.value) || 0)} className="w-full p-3 border border-outline rounded-lg bg-surface focus:ring-2 outline-none" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Concepto / Descripción</label>
                <input required type="text" value={movementDesc} onChange={e => setMovementDesc(e.target.value)} placeholder="Ej. Pago a proveedor, Cambio adicional..." className="w-full p-3 border border-outline rounded-lg bg-surface focus:ring-2 outline-none" />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsMovementModalOpen(false)} className="px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg">Cancelar</button>
                <button type="submit" className={`px-4 py-2 text-white rounded-lg font-bold ${movementType === 'in' ? 'bg-secondary hover:bg-secondary/90' : 'bg-error hover:bg-error/90'}`}>Registrar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Session Modal */}
      {isCloseModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-lg relative border-2 border-error">
            <h2 className="text-2xl font-bold mb-2 text-error">Corte de Caja (Z)</h2>
            <p className="text-on-surface-variant mb-6 text-sm">Al realizar el corte, se cerrará el turno actual y se generará el reporte final.</p>
            
            <div className="bg-surface-container-low rounded-lg p-4 mb-6 border border-outline-variant space-y-2">
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Fondo Inicial</span><span>${currentSession.initialAmount.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Ventas Efectivo</span><span className="text-secondary">+${currentSession.cashSales.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Entradas Manuales</span><span className="text-secondary">+${currentSession.cashIn.toFixed(2)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-on-surface-variant">Salidas Manuales</span><span className="text-error">-${currentSession.cashOut.toFixed(2)}</span></div>
              <div className="border-t border-outline-variant my-2 pt-2 flex justify-between font-bold text-primary">
                <span>Efectivo Esperado en Caja</span>
                <span>${currentSession.expectedCash.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleCloseSession} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Efectivo Físico Contado ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input 
                    type="number" step="0.01" min="0" required
                    value={actualCash} onChange={e => setActualCash(parseFloat(e.target.value) || 0)}
                    className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 bg-surface text-xl font-bold outline-none ${actualCash === currentSession.expectedCash ? 'border-secondary focus:border-secondary' : actualCash < currentSession.expectedCash ? 'border-error focus:border-error' : 'border-primary focus:border-primary'}`}
                    autoFocus
                  />
                </div>
                {actualCash !== currentSession.expectedCash && (
                  <p className={`text-sm mt-2 font-medium ${actualCash < currentSession.expectedCash ? 'text-error' : 'text-primary'}`}>
                    Diferencia: ${(actualCash - currentSession.expectedCash).toFixed(2)} {actualCash < currentSession.expectedCash ? '(Faltante)' : '(Sobrante)'}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setIsCloseModalOpen(false)} className="flex-1 py-3 text-on-surface-variant bg-surface-container rounded-xl font-medium">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-error text-on-error rounded-xl font-bold">Confirmar Corte</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
