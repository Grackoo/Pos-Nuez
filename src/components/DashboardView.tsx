import React from 'react';
import { TrendingUp, Scale, Banknote, Warehouse, Truck, AlertTriangle, Bell } from 'lucide-react';
import { useStore } from '../store/StoreContext';

export function DashboardView() {
  const { sales, products, employees } = useStore();

  const today = new Date().toISOString().split('T')[0];
  
  // Calculate KPIs
  const todaySales = sales.filter(s => s.date.startsWith(today));
  const totalRevenueToday = todaySales.reduce((sum, sale) => sum + sale.total, 0);
  
  const totalUnitsSoldToday = todaySales.reduce((sum, sale) => {
    return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
  }, 0);

  const totalInventoryStock = products.reduce((sum, product) => sum + product.stock, 0);
  const lowStockProducts = products.filter(p => p.stock < 10);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 relative z-10 max-w-7xl mx-auto">
      <header className="mb-8 hidden md:flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-primary">Dashboard Principal</h2>
          <p className="text-on-surface-variant mt-1 text-sm">Resumen de operaciones del día</p>
        </div>
        <button className="text-on-surface-variant hover:bg-surface-container transition-colors p-2 rounded-full flex items-center justify-center">
          <Bell size={24} />
        </button>
      </header>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-on-surface-variant font-medium">Ventas del Día (Ingresos)</span>
            <div className="bg-primary/10 text-primary p-1.5 rounded-lg">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-on-surface">${totalRevenueToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className="text-xs text-on-surface-variant mt-1">{todaySales.length} transacciones hoy</p>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-on-surface-variant font-medium">Unidades Vendidas Hoy</span>
            <div className="bg-secondary/10 text-secondary p-1.5 rounded-lg">
              <Scale size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-on-surface">{totalUnitsSoldToday.toLocaleString()}</div>
          <p className="text-xs text-on-surface-variant mt-1">Total de productos desplazados</p>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-outline-variant shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-on-surface-variant font-medium">Productos en Stock</span>
            <div className="bg-tertiary/10 text-tertiary p-1.5 rounded-lg">
              <Warehouse size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-on-surface">{totalInventoryStock.toLocaleString()}</div>
          <p className="text-xs text-on-surface-variant mt-1">En inventario global</p>
        </div>

        <div className="bg-surface rounded-xl p-4 border border-error/20 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-error font-medium">Alertas de Inventario</span>
            <div className="bg-error/10 text-error p-1.5 rounded-lg">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-error">{lowStockProducts.length}</div>
          <p className="text-xs text-error mt-1">Productos con stock bajo (&lt; 10)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales Activity */}
        <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col max-h-[400px]">
          <h3 className="font-semibold text-on-surface mb-4">Últimas Ventas</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {sales.slice().reverse().slice(0, 10).map(sale => {
              const employee = employees.find(e => e.id === sale.employeeId);
              return (
                <div key={sale.id} className="flex gap-3 items-center border-b border-outline-variant pb-3 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Banknote size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-on-surface">Venta {sale.id.toUpperCase()}</p>
                    <p className="text-xs text-on-surface-variant">
                      Por: {employee?.name || 'Desconocido'} • {new Date(sale.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary">${sale.total.toFixed(2)}</div>
                    <div className="text-xs text-on-surface-variant">{sale.items.length} articulos</div>
                  </div>
                </div>
              )
            })}
            {sales.length === 0 && (
              <div className="text-center text-on-surface-variant py-8">
                No hay ventas registradas aún.
              </div>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col max-h-[400px]">
          <h3 className="font-semibold text-on-surface mb-4">Productos por Agotarse</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {lowStockProducts.map(product => (
              <div key={product.id} className="flex gap-3 items-center border-b border-outline-variant pb-3 last:border-0">
                <div className="w-10 h-10 rounded-full bg-error/10 text-error flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-on-surface">{product.name}</p>
                  <p className="text-xs text-error font-medium">Stock: {product.stock} {product.unit}</p>
                </div>
                <div className="text-right">
                  <button className="text-xs bg-surface-container px-3 py-1.5 rounded-lg font-medium hover:bg-surface-container-high">
                    Reabastecer
                  </button>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <div className="text-center text-on-surface-variant py-8">
                Todos los productos tienen buen nivel de stock.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
