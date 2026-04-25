import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './lib/store';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CRMPage from './pages/CRMPage';
import PipelinePage from './pages/PipelinePage';
import RevenuePage from './pages/RevenuePage';
import TasksPage from './pages/TasksPage';
import AutomationPage from './pages/AutomationPage';
import TeamPage from './pages/TeamPage';
import PublicLeadFormPage from './pages/PublicLeadFormPage';
import SettingsPage from './pages/SettingsPage';
import { Toaster } from './components/ui/sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/apply" element={<PublicLeadFormPage />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/clients" element={<CRMPage />} />
                  <Route path="/pipeline" element={<PipelinePage />} />
                  <Route path="/revenue" element={<RevenuePage />} />
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/automation" element={<AutomationPage />} />
                  <Route path="/team" element={<TeamPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </Router>
  );
}
