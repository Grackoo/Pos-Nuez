import React from 'react';
import { Banknote, FileText, Table, Send } from 'lucide-react';
import { useStore } from '../store/StoreContext';

export function ReportsView() {
  const { sales, employees } = useStore();

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  // Group by employee
  const salesByEmployee = employees.map(emp => {
    const empSales = sales.filter(s => s.employeeId === emp.id);
    const total = empSales.reduce((sum, sale) => sum + sale.total, 0);
    return { ...emp, totalSalesAmount: total, count: empSales.length };
  }).sort((a, b) => b.totalSalesAmount - a.totalSalesAmount);

  return (
    <div className="flex flex-col h-full bg-surface">
      <header className="hidden md:flex justify-between items-center px-6 h-24 w-full border-b border-outline-variant bg-surface sticky top-0 z-30">
        <div>
          <h1 className="text-2xl font-bold text-primary">Reportes de Ventas</h1>
          <p className="text-sm text-on-surface-variant mt-1">Historial completo y métricas por empleado</p>
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
    </div>
  );
}
