import React from 'react';
import { useStore } from '../store/StoreContext';
import { ViewType } from '../types';
import { LayoutDashboard, Package, BarChart2, Users, Settings, Store, Bell, Wallet, LogOut } from 'lucide-react';

interface LayoutProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  children: React.ReactNode;
}

export function Layout({ currentView, setCurrentView, children }: LayoutProps) {
  const [storeName, setStoreName] = React.useState(() => localStorage.getItem('setting_store_name') || 'Pos Venta de Nuez');
  const { activeEmployee, setActiveEmployee } = useStore();

  React.useEffect(() => {
    const handleStorageChange = () => {
      setStoreName(localStorage.getItem('setting_store_name') || 'Pos Venta de Nuez');
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const baseDesktopNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Punto de Venta', icon: Store },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'cash', label: 'Caja (Corte)', icon: Wallet },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'employees', label: 'Empleados', icon: Users },
    { id: 'reports', label: 'Reportes', icon: BarChart2 },
    { id: 'settings', label: 'Ajustes', icon: Settings },
  ] as const;

  const desktopNavItems = activeEmployee?.role === 'Admin'
    ? [
        ...baseDesktopNavItems.slice(0, 4),
        { id: 'cash_history', label: 'Historial Caja', icon: Wallet },
        ...baseDesktopNavItems.slice(4)
      ]
    : baseDesktopNavItems;

  const mobileNavItems = [
    { id: 'sales', label: 'Ventas', icon: Store },
    { id: 'inventory', label: 'Inventario', icon: Package },
    { id: 'cash', label: 'Caja', icon: Wallet },
    { id: 'customers', label: 'Clientes', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background overflow-x-hidden">
      {/* NavigationDrawer (Desktop) */}
      <nav className="hidden md:flex flex-col h-screen py-margin-desktop bg-surface-container-low text-primary w-64 fixed left-0 top-0 border-r border-outline-variant z-50">
        <div className="px-4 mb-8">
          <h2 className="font-headline-lg text-headline-lg text-primary font-bold tracking-tight">{storeName}</h2>
        </div>

        <div className="px-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-outline-variant">
              {activeEmployee?.name.charAt(0)}
            </div>
            <div>
              <p className="font-label-sm text-on-surface font-bold">{activeEmployee?.name}</p>
              <p className="font-label-sm text-on-surface-variant font-normal">{activeEmployee?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveEmployee(null)}
            className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>

        <ul className="flex flex-col gap-2 flex-grow">
          {desktopNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${isActive
                      ? 'bg-secondary-container text-on-secondary-container font-semibold translate-x-1'
                      : 'text-on-surface-variant hover:bg-surface-container-highest'
                    }`}
                >
                  <Icon size={20} className={isActive ? 'fill-current' : ''} />
                  <span className="font-body-md text-left flex-grow">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
        <div className="px-6 mt-auto">
          <span className="font-label-sm text-outline">v2.4.0</span>
        </div>
      </nav>

      {/* TopAppBar (Mobile) */}
      <header className="md:hidden flex justify-between items-center px-margin-mobile h-touch-target-min w-full fixed top-0 z-50 bg-surface border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary border border-outline-variant text-sm">
            {activeEmployee?.name.charAt(0)}
          </div>
          <span className="font-headline-lg-mobile font-bold text-primary tracking-tight">{storeName}</span>
        </div>
        <button 
          onClick={() => setActiveEmployee(null)}
          className="text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors rounded-full h-10 w-10 flex items-center justify-center"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pt-[calc(var(--spacing-touch-target-min)+1rem)] md:pt-0 pb-24 md:pb-0 min-h-screen">
        {children}
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden flex flex-row fixed bottom-0 w-full z-50 justify-around items-center px-2 py-3 bg-surface-container-lowest text-secondary rounded-t-xl border-t border-outline-variant shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center justify-center px-4 py-1 transition-all rounded-lg ${isActive ? 'bg-secondary-container text-on-secondary-container scale-105' : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
            >
              <Icon size={24} className={isActive ? 'fill-current' : ''} />
              <span className="font-label-sm mt-1">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  );
}
