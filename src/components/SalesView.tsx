import React, { useState } from 'react';
import { Search, ArrowRight, Minus, Plus } from 'lucide-react';

export function SalesView() {
  const [quality, setQuality] = useState('Extra');
  const [quantity, setQuantity] = useState(25.5);

  const pricePerKg = 135.29; // approximate to get $3450 for 25.5kg
  const total = quantity * pricePerKg;

  return (
    <div className="flex flex-col h-full relative p-margin-mobile md:p-margin-desktop max-w-4xl mx-auto w-full">
      <div className="flex-grow flex flex-col gap-6 mb-24 md:mb-32">
        {/* Smart Search Bar */}
        <section className="flex flex-col gap-2">
          <label className="font-label-sm text-on-surface-variant">Buscar Cliente</label>
          <div className="relative w-full h-14">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
            <input 
              type="text" 
              placeholder="Nombre o ID del cliente..." 
              className="w-full h-full pl-12 pr-4 rounded-xl border border-outline bg-surface-container-lowest focus:ring-2 focus:ring-secondary focus:border-transparent outline-none font-body-md text-on-surface transition-shadow"
            />
          </div>
        </section>

        {/* Product Catalog (Nuez) */}
        <section className="flex flex-col gap-4">
          <h2 className="font-headline-lg-mobile text-primary">Catálogo</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-surface-container-lowest rounded-xl border border-outline hover:border-secondary transition-colors p-3 flex flex-col gap-2 text-left relative active:scale-95 shadow-sm">
              <div className="aspect-square bg-surface-container rounded-lg overflow-hidden relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-_jslRQiOAOnUDvuZFxwIAv8F6o5tVAM4IROrIr0zpzrFrJSaBw-xDkvm47PSZ2HCkRrjm2DOcGzAo00Zef1q956bwZGcihjjkFOXFUw0kow9ewBTIvbkabFTa8QeXTGcUmPmGGRzl8NApqH4N8kbXuleeCoT2pLyU1xV01kKZfYNptGat7LXlDWJrxAc0M8EpuYFPgIkeIElYF4pOleYGrnfcosmxRlaKG-uOTBYQqZF3FRnvoo" 
                  alt="Nuez Mitades"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-secondary text-on-secondary font-label-sm px-2 py-1 rounded-full shadow-sm">
                  450 KG
                </div>
              </div>
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Nuez Pecana</span>
              <span className="font-headline-lg-mobile text-primary leading-none">Corazón</span>
            </button>

            <button className="bg-surface-container-lowest rounded-xl border-2 border-secondary p-3 flex flex-col gap-2 text-left relative active:scale-95 shadow-sm">
              <div className="aspect-square bg-surface-container rounded-lg overflow-hidden relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0ifAgdOTCC10xB8JFnDEVz8UjzBjJwXpG0nsOzJCpxOx4-akTRwL3MZqIMGxtpZr4ufSuBKYgqvxhvEI6UHbOGFQ_huLAgBGC_j1gkx2TyGQx2ZWGWxpVbEJNVQvg_Bb7jZlRtYYQAA0wur_OC4Zsm4WQsI8LGzB0N64P7zW7rXrkBB-rcCy7mcsWiWQKQagsGGG6f9zZBRDjMrVV-NpM8Bc3GSaiSJ-lKPvlpaLFyJbs1VKOJSo" 
                  alt="Nuez Pedacería"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-surface-variant text-on-surface-variant font-label-sm px-2 py-1 rounded-full border border-outline-variant">
                  120 KG
                </div>
              </div>
              <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Nuez Pecana</span>
              <span className="font-headline-lg-mobile text-primary leading-none">Pedacería</span>
            </button>
          </div>
        </section>

        {/* Quality Selectors */}
        <section className="flex flex-col gap-2">
          <h3 className="font-label-sm text-on-surface-variant">Calidad</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-margin-mobile px-margin-mobile md:mx-0 md:px-0">
            {['Extra', 'Comercial', 'Regular'].map((q) => (
              <button 
                key={q}
                onClick={() => setQuality(q)}
                className={`px-4 h-12 rounded-full font-label-sm flex-shrink-0 flex items-center justify-center border transition-colors ${
                  quality === q 
                    ? 'bg-secondary text-on-secondary border-transparent shadow-sm'
                    : q === 'Comercial'
                      ? 'bg-tertiary-fixed text-on-tertiary-fixed border-outline-variant hover:bg-tertiary-fixed-dim'
                      : 'bg-surface-container text-on-surface border-outline-variant hover:bg-surface-container-highest'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </section>

        {/* Cut/Presentation Selector */}
        <section className="flex flex-col gap-2">
          <label className="font-label-sm text-on-surface-variant">Presentación / Corte</label>
          <div className="relative w-full">
            <select className="w-full h-14 pl-4 pr-10 rounded-xl border border-outline bg-surface-container-lowest appearance-none focus:ring-2 focus:ring-secondary focus:border-transparent outline-none font-body-md text-on-surface">
              <option>Granillo #1</option>
              <option selected>Granillo #2</option>
              <option>Granillo #3</option>
              <option>En pedazo</option>
              <option>Entera</option>
            </select>
          </div>
        </section>

        {/* Quantity Input */}
        <section className="flex flex-col gap-2 pb-6">
          <label className="font-label-sm text-on-surface-variant">Cantidad (KG)</label>
          <div className="flex items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant">
            <button 
              onClick={() => setQuantity(Math.max(0, quantity - 0.5))}
              className="w-14 h-14 rounded-full bg-surface-container-lowest border border-outline flex items-center justify-center text-primary active:bg-surface-variant transition-colors shadow-sm"
            >
              <Minus size={24} />
            </button>
            <input 
              type="number" 
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="flex-grow h-16 bg-transparent border-none text-center font-data-display text-display-lg text-primary focus:ring-0 p-0 m-0 w-full" 
            />
            <button 
              onClick={() => setQuantity(quantity + 0.5)}
              className="w-14 h-14 rounded-full bg-surface-container-lowest border border-outline flex items-center justify-center text-primary active:bg-surface-variant transition-colors shadow-sm"
            >
              <Plus size={24} />
            </button>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed md:absolute bottom-16 md:bottom-0 left-0 right-0 md:left-auto md:right-auto md:w-full z-40 bg-surface-container-lowest border-t border-outline-variant shadow-[0_-4px_20px_rgba(49,23,1,0.05)] p-margin-mobile flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="font-label-sm text-on-surface-variant">Total Kilos</span>
            <span className="font-data-display text-primary">{quantity} KG</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="font-label-sm text-on-surface-variant">Total Estimado</span>
            <span className="font-data-display text-secondary font-bold">
              ${total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <button className="w-full h-14 bg-primary text-on-primary rounded-xl font-label-sm flex items-center justify-center gap-2 shadow-sm hover:bg-surface-tint active:scale-[0.98] transition-all relative overflow-hidden group">
          <span className="absolute inset-0 bg-white/10 opacity-0 group-active:opacity-100 transition-opacity"></span>
          Continuar al Cobro
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
