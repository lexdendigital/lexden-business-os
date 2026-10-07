import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { TopBar } from '@/components/layout/TopBar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ToastProvider } from '@/components/common/Toast';
import { useBusinessStore } from '@/state/businessStore';
import { Onboarding } from '@/routes/Onboarding';
import { Dashboard } from '@/routes/Dashboard';
import { Sales } from '@/routes/Sales';
import { Inventory } from '@/routes/Inventory';
import { Customers } from '@/routes/Customers';
import { Grow } from '@/routes/Grow';
import { Settings } from '@/routes/Settings';
import { About } from '@/routes/About';

function RequireBusiness({ children }: { children: React.ReactElement }) {
  const { business } = useBusinessStore();
  if (!business) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  const { business } = useBusinessStore();

  return (
    <ToastProvider>
      <div className="app-shell">
        <TopBar />
        <Routes>
          <Route path="/onboarding" element={business ? <Navigate to="/" replace /> : <Onboarding />} />
          <Route
            path="/"
            element={
              <RequireBusiness>
                <Dashboard />
              </RequireBusiness>
            }
          />
          <Route
            path="/sales"
            element={
              <RequireBusiness>
                <Sales />
              </RequireBusiness>
            }
          />
          <Route
            path="/inventory"
            element={
              <RequireBusiness>
                <Inventory />
              </RequireBusiness>
            }
          />
          <Route
            path="/customers"
            element={
              <RequireBusiness>
                <Customers />
              </RequireBusiness>
            }
          />
          <Route
            path="/grow"
            element={
              <RequireBusiness>
                <Grow />
              </RequireBusiness>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireBusiness>
                <Settings />
              </RequireBusiness>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {business && <BottomNav />}
      </div>
    </ToastProvider>
  );
}
