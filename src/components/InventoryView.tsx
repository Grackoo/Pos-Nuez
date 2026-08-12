import React from 'react';
import { Download, Plus, Warehouse, AlertTriangle, Tags, Search, MoreVertical, ChevronLeft, ChevronRight, Nut } from 'lucide-react';

export function InventoryView() {
  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-7xl mx-auto space-y-stack-md">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-headline-lg text-on-surface mb-2">Gestión de Inventario Multivariante</h1>
          <p className="text-on-surface-variant text-body-md">Control de existencias, calidades y presentaciones en tiempo real.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-touch-target-min bg-surface-container border border-outline-variant text-on-surface rounded-lg hover:bg-surface-container-high transition-colors">
            <Download size={18} />
            <span className="font-label-sm">Exportar Inventario</span>
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 h-touch-target-min bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors shadow-sm active:scale-95 duration-150">
            <Plus size={18} />
            <span className="font-label-sm">Entrada de Stock</span>
          </button>
        </div>
      </div>

      {/* Bento Grid Layout for Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
        <div className="bg-surface rounded-xl p-6 border border-outline-variant flex items-start gap-4">
          <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg">
            <Warehouse size={24} />
          </div>
          <div>
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Stock</p>
            <p className="font-data-display text-on-surface">14,250 <span className="text-body-md font-normal text-outline">Kg</span></p>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-error-container flex items-start gap-4">
          <div className="p-3 bg-error-container text-on-error-container rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="font-label-sm text-error uppercase tracking-wider mb-1">Alertas de Reorden</p>
            <p className="font-data-display text-on-surface">3 <span className="text-body-md font-normal text-outline">Lotes</span></p>
          </div>
        </div>
        <div className="bg-surface rounded-xl p-6 border border-outline-variant flex items-start gap-4">
          <div className="p-3 bg-tertiary-container text-on-tertiary-container rounded-lg">
            <Tags size={24} />
          </div>
          <div>
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Variedades Activas</p>
            <p className="font-data-display text-on-surface">12</p>
          </div>
        </div>
      </div>

      {/* Interactive Stock Table */}
      <div className="bg-surface rounded-xl border border-outline-variant overflow-hidden shadow-sm flex flex-col h-full">
        <div className="p-4 border-b border-outline-variant flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-bright">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por producto, calidad o presentación..." 
              className="w-full h-touch-target-min pl-10 pr-4 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none font-body-md text-on-surface" 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            <button className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full font-label-sm whitespace-nowrap">Todas</button>
            <button className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-full font-label-sm hover:bg-surface-container whitespace-nowrap transition-colors">Nuez Pecana</button>
            <button className="px-4 py-2 border border-outline-variant text-on-surface-variant rounded-full font-label-sm hover:bg-surface-container whitespace-nowrap transition-colors">Nuez de Castilla</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-label-sm uppercase tracking-wider">
                <th className="p-4 font-semibold w-1/3">Producto / Presentación</th>
                <th className="p-4 font-semibold text-center w-1/6">Calidad</th>
                <th className="p-4 font-semibold text-right w-1/4">Stock Actual</th>
                <th className="p-4 font-semibold text-right w-1/6">Precio Unitario</th>
                <th className="p-4 font-semibold text-center w-1/12">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-body-md">
              <tr className="bg-surface-container-lowest border-b border-surface-variant hover:bg-surface-bright transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-primary">
                      <Nut size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Nuez Pecana</p>
                      <p className="text-sm text-on-surface-variant">Mitades (1kg)</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block px-3 py-1 bg-secondary text-on-secondary rounded-full font-label-sm">Extra</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="font-data-display text-lg text-on-surface">1,250 Kg</span>
                  </div>
                  <p className="text-xs text-outline mt-1">Min: 500 Kg</p>
                </td>
                <td className="p-4 text-right">
                  <span className="font-data-display text-lg text-on-surface">$24.50</span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-outline hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>

              <tr className="bg-error-container/20 border-b border-error/20 hover:bg-error-container/30 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-primary">
                      <Nut size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Nuez Pecana</p>
                      <p className="text-sm text-on-surface-variant">Granillo #1 (500g)</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full font-label-sm">Comercial</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <AlertTriangle size={14} className="text-error" />
                    <span className="font-data-display text-lg text-error font-bold">120 Kg</span>
                  </div>
                  <p className="text-xs text-error mt-1">Min: 300 Kg</p>
                </td>
                <td className="p-4 text-right">
                  <span className="font-data-display text-lg text-on-surface">$18.00</span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-outline hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>

              <tr className="bg-surface-container-lowest border-b border-surface-variant hover:bg-surface-bright transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-primary">
                      <Nut size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">Nuez de Castilla</p>
                      <p className="text-sm text-on-surface-variant">Entera con cáscara (Costal 25kg)</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <span className="inline-block px-3 py-1 bg-surface-variant text-on-surface rounded-full font-label-sm border border-outline-variant">Regular</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary"></div>
                    <span className="font-data-display text-lg text-on-surface">8,400 Kg</span>
                  </div>
                  <p className="text-xs text-outline mt-1">Min: 2,000 Kg</p>
                </td>
                <td className="p-4 text-right">
                  <span className="font-data-display text-lg text-on-surface">$12.50</span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-outline hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container">
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-bright mt-auto">
          <span className="text-sm text-on-surface-variant">Mostrando 1 a 3 de 45 registros</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:bg-surface-container transition-colors disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-secondary-container text-on-secondary-container font-label-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container transition-colors font-label-sm">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container transition-colors font-label-sm">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-outline hover:bg-surface-container transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
