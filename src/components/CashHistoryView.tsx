import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Wallet, Trash2, Eye } from 'lucide-react';
import { CashSession } from '../types';

export function CashHistoryView() {
  const { cashSessions, activeEmployee, employees, deleteCashSession } = useStore();
  const [selectedSession, setSelectedSession] = useState<CashSession | null>(null);

  if (activeEmployee?.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-5rem)] p-4">
        <h2 className="text-2xl font-bold text-error">Acceso Denegado</h2>
        <p className="text-on-surface-variant">Solo los administradores pueden ver el historial de caja.</p>
      </div>
    );
  }

  const closedSessions = cashSessions.filter(s => s.status === 'Closed').sort((a,b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-5rem)] p-4 md:p-6 gap-6 max-w-6xl mx-auto">
      <header>
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2"><Wallet /> Historial de Cortes de Caja</h1>
        <p className="text-on-surface-variant text-sm mt-1">Registros de todas las sesiones pasadas y sus movimientos</p>
      </header>

      <div className="bg-surface rounded-xl border border-outline-variant shadow-sm flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low text-on-surface-variant">
              <tr>
                <th className="p-4 font-medium uppercase tracking-wider text-xs">Apertura</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs">Cierre</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs">Cajero</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs text-right">Inicial</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs text-right">Ventas</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs text-right">Esperado</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs text-right">Real</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs text-right">Dif.</th>
                <th className="p-4 font-medium uppercase tracking-wider text-xs text-center">Detalle</th>
              </tr>
            </thead>
            <tbody>
              {closedSessions.map(s => {
                const diff = (s.actualCash || 0) - s.expectedCash;
                const empName = employees.find(e => e.id === s.employeeId)?.name || 'Desconocido';
                return (
                  <tr key={s.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4">
                      {new Date(s.startTime).toLocaleDateString()} <span className="text-xs text-on-surface-variant">{new Date(s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </td>
                    <td className="p-4">
                      {s.endTime ? <>{new Date(s.endTime).toLocaleDateString()} <span className="text-xs text-on-surface-variant">{new Date(s.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></> : '-'}
                    </td>
                    <td className="p-4 text-on-surface-variant">{empName}</td>
                    <td className="p-4 text-right">${s.initialAmount.toFixed(2)}</td>
                    <td className="p-4 text-right">${s.cashSales.toFixed(2)}</td>
                    <td className="p-4 text-right font-medium text-primary">${s.expectedCash.toFixed(2)}</td>
                    <td className="p-4 text-right font-bold">${(s.actualCash || 0).toFixed(2)}</td>
                    <td className={`p-4 text-right font-bold ${diff < 0 ? 'text-error' : diff > 0 ? 'text-secondary' : 'text-on-surface-variant'}`}>
                      {diff > 0 ? '+' : ''}{diff.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => setSelectedSession(s)} className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {closedSessions.length === 0 && (
                <tr><td colSpan={9} className="p-6 text-center text-on-surface-variant">No hay cortes de caja registrados.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-2xl shadow-lg relative max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">Detalle de Corte de Caja</h2>
              <button onClick={() => setSelectedSession(null)} className="text-outline hover:text-on-surface">Cerrar</button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-surface-container-low p-4 rounded-xl border border-outline-variant">
              <div><span className="block text-xs text-on-surface-variant mb-1">Cajero</span><span className="font-medium">{employees.find(e => e.id === selectedSession.employeeId)?.name}</span></div>
              <div><span className="block text-xs text-on-surface-variant mb-1">Entradas (Caja)</span><span className="font-bold text-secondary">+${selectedSession.cashIn.toFixed(2)}</span></div>
              <div><span className="block text-xs text-on-surface-variant mb-1">Salidas (Gastos)</span><span className="font-bold text-error">-${selectedSession.cashOut.toFixed(2)}</span></div>
              <div><span className="block text-xs text-on-surface-variant mb-1">Ventas Tarjeta</span><span className="font-medium text-on-surface-variant">${selectedSession.cardSales.toFixed(2)}</span></div>
            </div>

            <h3 className="font-bold mb-2">Movimientos Registrados</h3>
            <div className="overflow-y-auto flex-1 border border-outline-variant rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-container-low text-on-surface-variant sticky top-0">
                  <tr>
                    <th className="p-3 font-medium">Hora</th>
                    <th className="p-3 font-medium">Tipo</th>
                    <th className="p-3 font-medium">Concepto</th>
                    <th className="p-3 font-medium text-right">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSession.movements && selectedSession.movements.length > 0 ? (
                    selectedSession.movements.map(m => (
                      <tr key={m.id} className="border-b border-outline-variant">
                        <td className="p-3">{new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs ${m.type === 'in' ? 'bg-secondary/10 text-secondary' : 'bg-error/10 text-error'}`}>
                            {m.type === 'in' ? 'Ingreso' : 'Egreso'}
                          </span>
                        </td>
                        <td className="p-3">{m.description}</td>
                        <td className={`p-3 text-right font-medium ${m.type === 'in' ? 'text-secondary' : 'text-error'}`}>
                          {m.type === 'in' ? '+' : '-'}${m.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="p-6 text-center text-on-surface-variant">No hubo movimientos manuales en este turno.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 pt-4 border-t border-outline-variant flex justify-end">
              <button 
                onClick={() => {
                  if (window.confirm('¿Seguro que deseas eliminar este corte de caja de forma permanente?')) {
                    deleteCashSession(selectedSession.id);
                    setSelectedSession(null);
                  }
                }}
                className="px-4 py-2 bg-error/10 text-error rounded-lg flex items-center gap-2 hover:bg-error/20 font-medium"
              >
                <Trash2 size={18} /> Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
