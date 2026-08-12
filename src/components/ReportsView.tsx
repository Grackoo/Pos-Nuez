import React from 'react';
import { Banknote, Clock, ArrowRight, FileText, Table, Send } from 'lucide-react';

export function ReportsView() {
  return (
    <div className="flex flex-col h-full bg-surface">
      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-center px-margin-desktop h-24 w-full border-b border-outline-variant bg-surface sticky top-0 z-30">
        <div>
          <h1 className="font-headline-lg font-bold text-primary">Cierre de Caja y Reportes</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Resumen financiero del día - 24 de Octubre, 2023</p>
        </div>
      </header>

      {/* Mobile Header Equivalent */}
      <header className="md:hidden px-margin-mobile pt-4 pb-2">
        <h1 className="font-headline-lg-mobile font-bold text-primary">Cierre de Caja</h1>
        <p className="text-sm text-on-surface-variant mt-1">24 de Octubre, 2023</p>
      </header>

      <div className="p-margin-mobile md:p-margin-desktop flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-gutter pb-24 md:pb-0">
        
        {/* Financial Overview Bento */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-gutter">
          
          {/* Total Collected */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
              <div className="font-label-sm text-on-surface-variant uppercase tracking-wide">Total Recaudado (Hoy)</div>
              <Banknote size={20} className="text-secondary" />
            </div>
            <div>
              <div className="font-data-display text-secondary mb-2">$42,500.00</div>
              <div className="flex items-center gap-2 font-label-sm">
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded flex items-center gap-1">
                  <span className="text-[14px]">↗</span> +12%
                </span>
                <span className="text-on-surface-variant">vs ayer</span>
              </div>
            </div>
          </div>

          {/* Pending Receivables */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between h-48">
            <div className="flex justify-between items-start">
              <div className="font-label-sm text-on-surface-variant uppercase tracking-wide">Cuentas por Cobrar</div>
              <Clock size={20} className="text-error" />
            </div>
            <div>
              <div className="font-data-display text-primary mb-2">$15,230.50</div>
              <div className="flex gap-2 mt-2">
                <span className="bg-surface-container text-on-surface px-2 py-1 rounded text-xs">Crédito a 30 días: $10,000</span>
              </div>
            </div>
          </div>

          {/* Sales Breakdown Table */}
          <div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-outline-variant flex justify-between items-center">
              <h2 className="font-body-md font-bold text-on-surface">Desglose de Ventas por Vendedor</h2>
              <button className="text-primary hover:bg-surface-container p-2 rounded flex items-center gap-2 transition-colors">
                <span className="font-label-sm">Ver todos</span>
                <ArrowRight size={16} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="p-4 font-label-sm text-on-surface-variant font-medium">Vendedor</th>
                    <th className="p-4 font-label-sm text-on-surface-variant font-medium text-right">Efectivo</th>
                    <th className="p-4 font-label-sm text-on-surface-variant font-medium text-right">Crédito</th>
                    <th className="p-4 font-label-sm text-on-surface-variant font-medium text-right">Total Venta</th>
                  </tr>
                </thead>
                <tbody className="font-data-display text-sm">
                  <tr className="border-b border-outline-variant hover:bg-surface-bright transition-colors">
                    <td className="p-4 font-body-md font-medium text-on-surface">Carlos Mendoza</td>
                    <td className="p-4 text-right text-secondary">$12,000.00</td>
                    <td className="p-4 text-right text-on-surface-variant">$3,500.00</td>
                    <td className="p-4 text-right font-bold text-primary">$15,500.00</td>
                  </tr>
                  <tr className="border-b border-outline-variant hover:bg-surface-bright transition-colors">
                    <td className="p-4 font-body-md font-medium text-on-surface">Ana Rivera</td>
                    <td className="p-4 text-right text-secondary">$8,500.00</td>
                    <td className="p-4 text-right text-on-surface-variant">$1,200.00</td>
                    <td className="p-4 text-right font-bold text-primary">$9,700.00</td>
                  </tr>
                  <tr className="hover:bg-surface-bright transition-colors">
                    <td className="p-4 font-body-md font-medium text-on-surface">Luis García</td>
                    <td className="p-4 text-right text-secondary">$14,300.00</td>
                    <td className="p-4 text-right text-on-surface-variant">$0.00</td>
                    <td className="p-4 text-right font-bold text-primary">$14,300.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Actions & Export Sidebar */}
        <div className="xl:col-span-4 flex flex-col gap-gutter">
          {/* Action Card */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-body-md font-bold text-on-surface border-b border-outline-variant pb-4 mb-2">Exportar Reportes</h2>
            
            <button className="w-full h-14 bg-primary text-on-primary rounded-lg font-label-sm uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-primary-container transition-colors shadow-sm active:bg-primary-fixed-dim">
              <FileText size={20} />
              Descargar PDF
            </button>
            
            <button className="w-full h-14 bg-surface text-primary border border-primary rounded-lg font-label-sm uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-surface-container transition-colors active:bg-surface-variant">
              <Table size={20} />
              Exportar Excel
            </button>
            
            <div className="h-px bg-outline-variant w-full my-2"></div>
            
            <button className="w-full h-14 bg-secondary-container text-on-secondary-container rounded-lg font-label-sm uppercase tracking-wide flex items-center justify-center gap-3 hover:bg-secondary-fixed transition-colors">
              <Send size={20} />
              Enviar Reporte Mensual
            </button>
          </div>

          {/* System Status / Log Mini Widget */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 flex-1 flex flex-col">
            <h3 className="font-label-sm text-on-surface-variant uppercase tracking-wide mb-4">Registro de Actividad (Hoy)</h3>
            <ul className="space-y-4 flex-1">
              <li className="flex gap-3 items-start">
                <div className="mt-1 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                <div>
                  <p className="font-body-md text-sm text-on-surface">Cierre de ruta completado - Ana R.</p>
                  <p className="font-label-sm text-on-surface-variant font-normal">Hace 15 min</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="mt-1 w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                <div>
                  <p className="font-body-md text-sm text-on-surface">Depósito registrado: $14,300.00</p>
                  <p className="font-label-sm text-on-surface-variant font-normal">Hace 45 min</p>
                </div>
              </li>
              <li className="flex gap-3 items-start">
                <div className="mt-1 w-2 h-2 rounded-full bg-outline shrink-0"></div>
                <div>
                  <p className="font-body-md text-sm text-on-surface">Apertura de sistema contable</p>
                  <p className="font-label-sm text-on-surface-variant font-normal">06:00 AM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
