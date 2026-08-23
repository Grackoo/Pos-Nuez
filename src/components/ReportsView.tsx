import React, { useState } from 'react';
import { Banknote, FileText, Table, Send, Receipt, X, Printer } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { Sale } from '../types';
import { printTicket } from '../utils/printTicket';

export function ReportsView() {
  const { sales, employees, products, customers } = useStore();

  const [selectedTicket, setSelectedTicket] = useState<Sale | null>(null);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  // Group by employee
  const salesByEmployee = employees.map(emp => {
    const empSales = sales.filter(s => s.employeeId === emp.id);
    const total = empSales.reduce((sum, sale) => sum + sale.total, 0);
    return { ...emp, totalSalesAmount: total, count: empSales.length };
  }).sort((a, b) => b.totalSalesAmount - a.totalSalesAmount);

  const handlePrintTicket = () => {
    if (selectedTicket) {
      printTicket(selectedTicket, employees, customers, products);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface">
      <header className="hidden md:flex justify-between items-center px-6 h-24 w-full border-b border-outline-variant bg-surface sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-primary">Reportes de Ventas</h1>
          <p className="text-sm text-on-surface-variant mt-1">Historial completo y emisión de tickets</p>
        </div>
      </header>

      <header className="md:hidden p-4">
        <h1 className="text-xl font-bold text-primary">Reportes</h1>
      </header>

      <div className="p-4 md:p-6 flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div className="text-sm text-on-surface-variant uppercase tracking-wide font-medium">Ingreso Histórico Total</div>
              <Banknote size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="text-sm text-on-surface-variant mt-1">{sales.length} ventas totales registradas</div>
            </div>
          </div>

          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant">
              <h2 className="font-semibold text-on-surface">Historial de Ventas (Tickets)</h2>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant">
                  <tr>
                    <th className="p-4 text-xs text-on-surface-variant font-medium uppercase tracking-wider">Fecha / Folio</th>
                    <th className="p-4 text-xs text-on-surface-variant font-medium uppercase tracking-wider">Método</th>
                    <th className="p-4 text-xs text-on-surface-variant font-medium uppercase tracking-wider text-right">Total</th>
                    <th className="p-4 text-xs text-on-surface-variant font-medium uppercase tracking-wider text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(sale => (
                    <tr key={sale.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                      <td className="p-4 text-on-surface">
                        <div className="font-medium">{new Date(sale.date).toLocaleDateString()} {new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        <div className="text-xs text-on-surface-variant">Folio: {sale.id}</div>
                      </td>
                      <td className="p-4 text-on-surface-variant">
                        <span className={`px-2 py-1 rounded text-xs ${sale.paymentMethod === 'Credito' ? 'bg-error/10 text-error' : sale.paymentMethod === 'Tarjeta' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-primary">
                        ${sale.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => setSelectedTicket(sale)} className="p-2 text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors inline-flex items-center gap-1">
                          <Receipt size={16} /> <span className="text-xs font-medium">Ticket</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {sales.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-on-surface-variant">No hay ventas registradas.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant">
              <h2 className="font-semibold text-on-surface">Desglose por Vendedor</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="p-4 text-xs text-on-surface-variant font-medium uppercase tracking-wider">Vendedor</th>
                    <th className="p-4 text-xs text-on-surface-variant font-medium uppercase tracking-wider text-center">Cant. Ventas</th>
                    <th className="p-4 text-xs text-on-surface-variant font-medium uppercase tracking-wider text-right">Total Vendido</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {salesByEmployee.map(emp => (
                    <tr key={emp.id} className="border-b border-outline-variant hover:bg-surface-container-lowest transition-colors">
                      <td className="p-4 font-medium text-on-surface">{emp.name}</td>
                      <td className="p-4 text-center text-on-surface-variant">{emp.count}</td>
                      <td className="p-4 text-right font-bold text-primary">
                        ${emp.totalSalesAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-semibold text-on-surface border-b border-outline-variant pb-4 mb-2">Exportar Reportes</h2>
            
            <button className="w-full py-3 bg-primary text-on-primary rounded-lg text-sm font-medium uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors shadow-sm">
              <FileText size={18} />
              Descargar PDF
            </button>
            
            <button className="w-full py-3 bg-surface text-primary border border-primary rounded-lg text-sm font-medium uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-primary/10 transition-colors">
              <Table size={18} />
              Exportar Excel
            </button>
            
            <div className="h-px bg-outline-variant w-full my-2"></div>
            
            <button className="w-full py-3 bg-secondary/10 text-secondary rounded-lg text-sm font-medium uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-secondary/20 transition-colors">
              <Send size={18} />
              Enviar Resumen Mensual
            </button>
          </div>
        </div>

      </div>

      {/* Ticket Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-xl p-6 w-full max-w-sm shadow-lg relative flex flex-col max-h-[90vh]">
            <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 text-outline hover:text-on-surface">
              <X size={20} />
            </button>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2"><Receipt className="text-primary" /> Ticket de Venta</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto border-t border-b border-outline-variant py-4 space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-lg">Pos Venta de Nuez</h3>
                <p className="text-sm text-on-surface-variant">{new Date(selectedTicket.date).toLocaleString()}</p>
                <p className="text-xs text-on-surface-variant mt-1">Folio: {selectedTicket.id}</p>
                <p className="text-xs text-on-surface-variant">Atendió: {employees.find(e => e.id === selectedTicket.employeeId)?.name || 'Cajero'}</p>
              </div>

              {selectedTicket.customerId && (
                <div className="bg-surface-container-low p-2 rounded text-sm text-center border border-outline-variant">
                  <span className="text-on-surface-variant block text-xs">Cliente:</span>
                  <span className="font-bold">{customers.find(c => c.id === selectedTicket.customerId)?.name || 'Desconocido'}</span>
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
                  {selectedTicket.items.map((item, idx) => {
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
                <div className="text-sm text-on-surface-variant mb-1">Método de pago: <span className="font-medium text-on-surface">{selectedTicket.paymentMethod}</span></div>
                <div className="text-xl font-bold text-primary">Total: ${selectedTicket.total.toFixed(2)}</div>
              </div>
              
              <div className="text-center text-xs text-on-surface-variant mt-4">
                ¡Gracias por su compra!
              </div>
            </div>

            <div className="mt-4 pt-2">
              <button onClick={handlePrintTicket} className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
                <Printer size={18} /> Imprimir Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
