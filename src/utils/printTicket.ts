import { Sale, Employee, Customer, Product } from '../types';

export const printTicket = (sale: Sale, employees: Employee[], customers: Customer[], products: Product[]) => {
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (!printWindow) {
    alert('Por favor permite las ventanas emergentes (pop-ups) para imprimir tickets.');
    return;
  }

  const employee = employees.find(e => e.id === sale.employeeId)?.name || 'Cajero';
  const customer = customers.find(c => c.id === sale.customerId)?.name;

  const itemsHtml = sale.items.map(item => {
    const prod = products.find(p => p.id === item.productId);
    const qty = Number.isInteger(item.quantity) ? item.quantity : item.quantity.toFixed(3);
    return `
      <tr>
        <td style="padding: 4px 0; vertical-align: top;">${qty}</td>
        <td style="padding: 4px 5px; vertical-align: top;">
          ${prod?.name || 'Producto'}<br/>
          <small>$${item.priceAtSale.toFixed(2)} c/u</small>
        </td>
        <td style="padding: 4px 0; text-align: right; vertical-align: top;">$${item.subtotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ticket ${sale.id}</title>
        <style>
          body {
            font-family: 'Courier New', Courier, monospace;
            font-size: 12px;
            color: #000;
            margin: 0;
            padding: 10px;
            width: 300px; /* Standard 80mm thermal printer */
          }
          .header { text-align: center; margin-bottom: 10px; }
          .header h2 { margin: 0 0 5px 0; font-size: 16px; }
          .header p { margin: 2px 0; }
          .divider { border-bottom: 1px dashed #000; margin: 5px 0; }
          table { width: 100%; border-collapse: collapse; margin: 10px 0; }
          th { border-bottom: 1px dashed #000; padding-bottom: 4px; text-align: left; }
          .totals { text-align: right; margin-top: 10px; }
          .totals p { margin: 2px 0; }
          .totals h3 { margin: 5px 0; font-size: 16px; }
          .footer { text-align: center; margin-top: 15px; font-size: 11px; }
          @media print {
            @page { margin: 0; }
            body { margin: 10px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>POS Venta de Nuez</h2>
          <p>${new Date(sale.date).toLocaleString()}</p>
          <p>Folio: ${sale.id}</p>
          <p>Atendió: ${employee}</p>
          ${customer ? \`<p>Cliente: \${customer}</p>\` : ''}
        </div>
        
        <div class="divider"></div>
        
        <table>
          <thead>
            <tr>
              <th>Cant</th>
              <th>Descripción</th>
              <th style="text-align: right">Importe</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div class="divider"></div>
        
        <div class="totals">
          <p>Método de pago: ${sale.paymentMethod}</p>
          <h3>Total: $${sale.total.toFixed(2)}</h3>
        </div>
        
        <div class="footer">
          <p>¡Gracias por su compra!</p>
          <p>*** Este documento no es un comprobante fiscal ***</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
