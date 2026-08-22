/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { DashboardView } from './components/DashboardView';
import { InventoryView } from './components/InventoryView';
import { SalesView } from './components/SalesView';
import { CustomersView } from './components/CustomersView';
import { ReportsView } from './components/ReportsView';
import { EmployeesView } from './components/EmployeesView';
import { SettingsView } from './components/SettingsView';
import { CashRegisterView } from './components/CashRegisterView';
import { ViewType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'inventory' && <InventoryView />}
      {currentView === 'sales' && <SalesView />}
      {currentView === 'customers' && <CustomersView />}
      {currentView === 'reports' && <ReportsView />}
      {currentView === 'employees' && <EmployeesView />}
      {currentView === 'settings' && <SettingsView />}
      {currentView === 'cash' && <CashRegisterView />}
    </Layout>
  );
}
