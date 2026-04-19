import React from 'react';
import { AppProvider, useApp } from './hooks/useApp';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import FlightsPage from './pages/FlightsPage';
import TrackerPage from './pages/TrackerPage';
import ProfilePage from './pages/ProfilePage';

function AppContent() {
  const { tab } = useApp();

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar />
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'flights' && <FlightsPage />}
        {tab === 'tracker' && <TrackerPage />}
        {tab === 'profile' && <ProfilePage />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
