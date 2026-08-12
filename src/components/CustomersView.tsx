import React from 'react';
import { Search, AlertTriangle, CheckCircle2, Banknote, MoreHorizontal, Receipt, Phone } from 'lucide-react';

export function CustomersView() {
  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-5xl mx-auto flex flex-col gap-stack-md h-full">
      {/* Header & Search */}
      <div className="flex flex-col gap-stack-sm mb-2">
        <h1 className="font-headline-lg-mobile text-primary">Directorio de Clientes</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant" size={20} />
          <input 
            type="text" 
            placeholder="Buscar cliente..." 
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline bg-surface-container-lowest focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-body-md" 
          />
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0 mt-2 no-scrollbar">
          <button className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-sm whitespace-nowrap flex items-center gap-1 shrink-0">
            Todos
          </button>
          <button className="px-4 py-2 rounded-full border border-outline text-on-surface bg-surface-container-lowest hover:bg-surface-container font-label-sm whitespace-nowrap flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-error"></span> Saldo Pendiente
          </button>
          <button className="px-4 py-2 rounded-full border border-outline text-on-surface bg-surface-container-lowest hover:bg-surface-container font-label-sm whitespace-nowrap flex items-center gap-1 shrink-0">
            <span className="w-2 h-2 rounded-full bg-secondary"></span> Al Día
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="flex flex-col gap-stack-md">
        
        {/* Customer Card 1: Saldo Pendiente */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-error relative shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-surface-variant overflow-hidden border border-outline shrink-0">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpHrW16azT31xhve-SrsNUgsW6h-ElxuFigV-zb5aUaFDT9XfPs3SU9NTqg9zYbYOXFgwydqqo5v2rLglq8708o_IkOphzuDEiN-IuLpklTt_cS0hbDMuQvaWV8nmgVf5IMgnQ4_Cx6SVerjRDzYBusEVyVQPPW_LCRE-2mNeMGLulU8hURUDh6hSh2CoB68mLWzCrrLGy4VREf00ezgdd2aQYvwGpaT5GebWswvK9A_Z7DyVknaI" 
                  alt="Agro Industrias" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h2 className="font-body-md font-bold text-on-surface">Agro Industrias del Norte</h2>
                <p className="font-label-sm text-on-surface-variant">ID: 001-492</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-error-container text-on-error-container font-label-sm gap-1">
              <AlertTriangle size={14} />
              Pendiente
            </span>
          </div>

          <div className="bg-surface-container-low rounded-lg p-3 mb-4 border border-outline-variant">
            <div className="flex justify-between items-center mb-1">
              <span className="font-label-sm text-on-surface-variant">Deuda Total</span>
              <span className="font-data-display text-error">$14,500.00</span>
            </div>
            <div className="text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant flex justify-between">
              <span>Último abono: 12/Oct</span>
              <span>$5,000.00</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-primary text-on-primary rounded-lg font-label-sm h-12 hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 relative overflow-hidden active:scale-95">
              <Banknote size={18} />
              Nuevo Abono
            </button>
            <button className="w-12 border border-outline text-on-surface rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

        {/* Customer Card 2: Al Día */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-secondary relative shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-surface-variant overflow-hidden border border-outline flex items-center justify-center text-on-surface-variant font-bold text-lg shrink-0">
                D
              </div>
              <div>
                <h2 className="font-body-md font-bold text-on-surface">Distribuidora La Cosecha</h2>
                <p className="font-label-sm text-on-surface-variant">ID: 001-118</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-sm gap-1">
              <CheckCircle2 size={14} />
              Al Día
            </span>
          </div>

          <div className="bg-surface-container-low rounded-lg p-3 mb-4 border border-outline-variant">
            <div className="flex justify-between items-center mb-1">
              <span className="font-label-sm text-on-surface-variant">Balance</span>
              <span className="font-data-display text-[20px] font-semibold text-secondary">$0.00</span>
            </div>
            <div className="text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant flex justify-between">
              <span>Última compra: Hoy</span>
              <span>$2,300.00 (Pagado)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 border border-primary text-primary rounded-lg font-label-sm h-12 hover:bg-surface-container transition-colors flex items-center justify-center gap-2 active:scale-95">
              <Receipt size={18} />
              Ver Historial
            </button>
            <button className="w-12 border border-outline text-on-surface rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors">
              <Phone size={20} />
            </button>
          </div>
        </div>

        {/* Customer Card 3: Parcial */}
        <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline relative shadow-sm hover:border-primary transition-colors">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3 items-center">
              <div className="w-12 h-12 rounded-full bg-surface-variant overflow-hidden border border-outline shrink-0">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1SjZEHmwYIZD0XnZNlqLFOWck8D9N1gf0iHdRg9s-glmZHQlTAqyhhM7425gfMt19fZC7ZR7ioivhoZfhBYOrHEIDbRu5N8Cd-6t6VqZcK-oYYWtRt0xSMvJqEWD1oPpc3t6o4TwNZR3IFqeiew7-beHomvJjt2aelPC0JBsyDX0jb5CHbajV1J0pvCsMFdV7hhU2DjLbBDWHYQABH2hLnmhn-sOvDXuRJg067uWokTpVhT0oKeU" 
                  alt="Exportaciones Nogal" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h2 className="font-body-md font-bold text-on-surface">Exportaciones Nogal</h2>
                <p className="font-label-sm text-on-surface-variant">ID: 002-045</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-surface-variant text-on-surface-variant font-label-sm gap-1">
              Parcial
            </span>
          </div>

          <div className="bg-surface-container-low rounded-lg p-3 mb-4 border border-outline-variant">
            <div className="flex justify-between items-center mb-1">
              <span className="font-label-sm text-on-surface-variant">Deuda Restante</span>
              <span className="font-data-display text-[20px] font-semibold text-primary">$850.00</span>
            </div>
            <div className="text-xs text-on-surface-variant mt-2 pt-2 border-t border-outline-variant flex justify-between">
              <span>Último abono: Ayer</span>
              <span>$1,000.00</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-primary text-on-primary rounded-lg font-label-sm h-12 hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 relative overflow-hidden active:scale-95">
              <Banknote size={18} />
              Nuevo Abono
            </button>
            <button className="w-12 border border-outline text-on-surface rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
