import React, { useState } from 'react';
import { Settings, RefreshCw, Download, Upload, ShieldAlert, Check } from 'lucide-react';

export function SettingsView() {
  const [storeName, setStoreName] = useState(() => localStorage.getItem('setting_store_name') || 'Pos Venta de Nuez');
  const [currency, setCurrency] = useState(() => localStorage.getItem('setting_currency') || 'MXN ($)');
  const [taxRate, setTaxRate] = useState(() => localStorage.getItem('setting_tax_rate') || '16');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('setting_store_name', storeName);
    localStorage.setItem('setting_currency', currency);
    localStorage.setItem('setting_tax_rate', taxRate);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    // Optionally trigger a window event or reload to update layout name
    window.dispatchEvent(new Event('storage'));
  };

  const handleResetDatabase = () => {
    if (window.confirm('¿Está seguro de que desea restablecer la base de datos? Esto eliminará todos los cambios y cargará los datos iniciales.')) {
      localStorage.removeItem('employees');
      localStorage.removeItem('categories');
      localStorage.removeItem('products');
      localStorage.removeItem('sales');
      localStorage.removeItem('customers');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      employees: JSON.parse(localStorage.getItem('employees') || '[]'),
      categories: JSON.parse(localStorage.getItem('categories') || '[]'),
      products: JSON.parse(localStorage.getItem('products') || '[]'),
      sales: JSON.parse(localStorage.getItem('sales') || '[]'),
      customers: JSON.parse(localStorage.getItem('customers') || '[]'),
      settings: { storeName, currency, taxRate }
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `pos_nuez_respaldo_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed.employees || parsed.products || parsed.sales) {
            if (parsed.employees) localStorage.setItem('employees', JSON.stringify(parsed.employees));
            if (parsed.categories) localStorage.setItem('categories', JSON.stringify(parsed.categories));
            if (parsed.products) localStorage.setItem('products', JSON.stringify(parsed.products));
            if (parsed.sales) localStorage.setItem('sales', JSON.stringify(parsed.sales));
            if (parsed.customers) localStorage.setItem('customers', JSON.stringify(parsed.customers));
            if (parsed.settings) {
              if (parsed.settings.storeName) localStorage.setItem('setting_store_name', parsed.settings.storeName);
              if (parsed.settings.currency) localStorage.setItem('setting_currency', parsed.settings.currency);
              if (parsed.settings.taxRate) localStorage.setItem('setting_tax_rate', parsed.settings.taxRate);
            }
            alert('Datos importados con éxito. La página se recargará para aplicar los cambios.');
            window.location.reload();
          } else {
            alert('Formato de archivo inválido.');
          }
        } catch (err) {
          alert('Error al leer el archivo. Asegúrese de que sea un JSON válido.');
        }
      };
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary flex items-center gap-2 font-headline-lg">
          <Settings size={28} />
          <span>Ajustes del Sistema</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Forms */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
            <h2 className="text-lg font-semibold border-b border-outline-variant pb-2 text-secondary">
              Información de la Tienda
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-on-surface-variant">Nombre de la Tienda</label>
                <input
                  required
                  type="text"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  className="w-full p-2.5 bg-background border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface-variant">Moneda</label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="w-full p-2.5 bg-background border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="MXN ($)">MXN ($)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-on-surface-variant">Tasa de Impuesto / IVA (%)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={e => setTaxRate(e.target.value)}
                    className="w-full p-2.5 bg-background border border-outline rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-primary text-on-primary font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/95 transition-all shadow-md active:scale-95"
              >
                {savedSuccess ? <Check size={18} /> : null}
                <span>{savedSuccess ? 'Guardado con éxito' : 'Guardar Ajustes'}</span>
              </button>
            </div>
          </form>

          {/* Backup & Import section */}
          <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
            <h2 className="text-lg font-semibold border-b border-outline-variant pb-2 text-secondary">
              Respaldo y Transferencia de Datos
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Exporte toda la información (ventas, clientes, inventario y empleados) a un archivo de respaldo o impórtela a otro dispositivo.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 border border-outline hover:border-primary text-on-surface hover:text-primary px-4 py-2.5 rounded-lg transition-all active:scale-95 bg-background/50"
              >
                <Download size={18} />
                <span>Exportar Respaldo</span>
              </button>

              <label className="flex items-center gap-2 border border-outline hover:border-primary text-on-surface hover:text-primary px-4 py-2.5 rounded-lg transition-all active:scale-95 bg-background/50 cursor-pointer">
                <Upload size={18} />
                <span>Importar Respaldo</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Operations & System info */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm space-y-4">
            <h2 className="text-lg font-semibold border-b border-outline-variant pb-2 text-error flex items-center gap-2">
              <ShieldAlert size={20} />
              <span>Zona de Peligro</span>
            </h2>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Si el sistema presenta problemas de consistencia o si desea comenzar de cero, puede restablecer por completo la base de datos local.
            </p>

            <button
              onClick={handleResetDatabase}
              className="w-full flex items-center justify-center gap-2 bg-error-container text-on-error-container border border-error/20 hover:bg-error/20 px-4 py-3 rounded-lg transition-all font-semibold active:scale-95 cursor-pointer"
            >
              <RefreshCw size={18} />
              <span>Restablecer Base de Datos</span>
            </button>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-outline-variant shadow-sm space-y-3">
            <h2 className="text-sm font-label-sm text-outline tracking-wider">Acerca del Sistema</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-outline-variant pb-1.5">
                <span className="text-on-surface-variant">Versión POS</span>
                <span className="font-semibold text-secondary">v2.4.0</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-1.5">
                <span className="text-on-surface-variant">Tecnología</span>
                <span className="text-secondary font-medium">React + Vite + Tailwind</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-1.5">
                <span className="text-on-surface-variant">Desarrollado por</span>
                <span className="text-primary font-medium">Grackoo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Estado de Almacenamiento</span>
                <span className="text-green-500 font-semibold">Activo (Local)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
