import React from 'react';
import { TrendingUp, Scale, Banknote, Warehouse, Truck, AlertTriangle, Bell } from 'lucide-react';

export function DashboardView() {
  return (
    <div className="flex-1 overflow-y-auto p-margin-mobile md:p-margin-desktop relative z-10">
      <header className="mb-8 hidden md:flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-primary">Dashboard Principal</h2>
          <p className="text-on-surface-variant mt-1">Resumen de operaciones del día</p>
        </div>
        <button className="text-on-surface-variant hover:bg-surface-container transition-colors p-2 rounded-full flex items-center justify-center">
          <Bell size={24} />
        </button>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-on-surface-variant font-medium">Ventas del Día</span>
            <div className="bg-secondary-container text-secondary p-1 rounded-full">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="font-data-display text-on-surface">$142,500</div>
          <p className="text-xs text-on-surface-variant mt-1">+12% vs ayer</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-on-surface-variant font-medium">Kilos Vendidos Hoy</span>
            <div className="bg-primary-container text-on-primary-container p-1 rounded-full">
              <Scale size={16} />
            </div>
          </div>
          <div className="font-data-display text-on-surface">1,240 <span className="text-sm">Kg</span></div>
          <p className="text-xs text-on-surface-variant mt-1">45 sacos procesados</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-on-surface-variant font-medium">Cobranza / Abonos</span>
            <div className="bg-tertiary-fixed text-on-tertiary-container p-1 rounded-full">
              <Banknote size={16} />
            </div>
          </div>
          <div className="font-data-display text-on-surface">$89,200</div>
          <p className="text-xs text-on-surface-variant mt-1">62% recuperado</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-on-surface-variant font-medium">Inv. Total Disponible</span>
            <div className="bg-surface-container-highest text-on-surface-variant p-1 rounded-full">
              <Warehouse size={16} />
            </div>
          </div>
          <div className="font-data-display text-on-surface">15,800 <span className="text-sm">Kg</span></div>
          <p className="text-xs text-on-surface-variant mt-1">Bodega Norte</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-body-md font-semibold text-on-surface">Ventas por Calidad y Presentación</h3>
            <div className="flex gap-2">
              <span className="flex items-center text-xs text-on-surface-variant gap-1">
                <span className="w-3 h-3 rounded-full bg-secondary block"></span> Extra
              </span>
              <span className="flex items-center text-xs text-on-surface-variant gap-1">
                <span className="w-3 h-3 rounded-full bg-on-primary-container block"></span> Comercial
              </span>
            </div>
          </div>
          
          {/* Simulated Bar Chart */}
          <div className="h-64 flex items-end gap-2 sm:gap-6 justify-between px-2 sm:px-6 relative border-b border-l border-outline-variant pb-1 pl-1 ml-6">
            <div className="absolute left-[-24px] top-0 h-full flex flex-col justify-between text-[10px] text-on-surface-variant py-1">
              <span>10k</span>
              <span>8k</span>
              <span>6k</span>
              <span>4k</span>
              <span>2k</span>
              <span>0</span>
            </div>
            
            {/* Grid lines */}
            <div className="absolute w-full h-full left-0 top-0 pointer-events-none flex flex-col justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-full border-t border-outline-variant opacity-30"></div>
              ))}
              <div></div>
            </div>

            {/* Data Bars */}
            {[
              { extra: '80%', comercial: '40%' },
              { extra: '60%', comercial: '50%' },
              { extra: '90%', comercial: '30%' },
              { extra: '75%', comercial: '65%' }
            ].map((data, i) => (
              <div key={i} className="w-full flex justify-center items-end gap-1 z-10 group">
                <div 
                  className="w-8 bg-secondary rounded-t-sm hover:opacity-80 transition-opacity" 
                  style={{ height: data.extra }}
                ></div>
                <div 
                  className="w-8 bg-on-primary-container rounded-t-sm hover:opacity-80 transition-opacity" 
                  style={{ height: data.comercial }}
                ></div>
              </div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between px-2 sm:px-6 mt-2 text-xs text-on-surface-variant ml-6">
            <span className="w-full text-center">Lunes</span>
            <span className="w-full text-center">Martes</span>
            <span className="w-full text-center">Miércoles</span>
            <span className="w-full text-center">Jueves</span>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
          <h3 className="font-body-md font-semibold text-on-surface mb-4">Actividad Reciente</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <Truck size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Venta - R. Martinez</p>
                <p className="text-xs text-on-surface-variant">250 Kg Extra • Hace 10 min</p>
              </div>
              <div className="ml-auto text-sm font-data-display text-primary">$28,500</div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-container flex items-center justify-center shrink-0">
                <Banknote size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Abono - Dist. del Norte</p>
                <p className="text-xs text-on-surface-variant">Transferencia • Hace 45 min</p>
              </div>
              <div className="ml-auto text-sm font-data-display text-primary">$15,000</div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0">
                <AlertTriangle size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Alerta Inventario</p>
                <p className="text-xs text-on-surface-variant">Comercial por debajo de 500 Kg</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                <Truck size={16} />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Venta - AgroSur</p>
                <p className="text-xs text-on-surface-variant">100 Kg Comercial • Hace 2 hrs</p>
              </div>
              <div className="ml-auto text-sm font-data-display text-primary">$9,800</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
