import React, { useEffect, lazy, Suspense } from 'react';
import { useAppStore } from './store/useAppStore';
import { mockClients, mockSessions, mockReminders, mockUser } from './data/mockData';
import Navigation from './components/Navigation';
import LoadingSkeleton from './components/ui/LoadingSkeleton';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ClientsPage = lazy(() => import('./components/Clients'));
const SessionsPage = lazy(() => import('./components/Sessions'));
const ClientDetailPage = lazy(() => import('./components/ClientDetail'));
const SessionDetailPage = lazy(() => import('./components/SessionDetail'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function App() {
  const {
    user,
    setUser,
    setClients,
    setSessions,
    setReminders,
    selectedClient,
    selectedSession,
    activeView,
    setActiveView,
    setSelectedClient,
    setSelectedSession,
    isMobileMenuOpen,
    setMobileMenuOpen,
    darkMode
  } = useAppStore();

  // Initialize app data
  useEffect(() => {
    // Set mock user
    setUser(mockUser);
    
    // Load mock data
    setClients(mockClients);
    setSessions(mockSessions);
    setReminders(mockReminders);
  }, [setUser, setClients, setSessions, setReminders]);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setSelectedClient(null);
    setSelectedSession(null);
    setMobileMenuOpen(false);
  };

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
    setActiveView('client-detail');
  };

  const handleSessionSelect = (session: any) => {
    setSelectedSession(session);
    setActiveView('session-detail');
  };

  const handleBack = () => {
    if (selectedClient) {
      setSelectedClient(null);
      setActiveView('clients');
    } else if (selectedSession) {
      setSelectedSession(null);
      setActiveView('sessions');
    }
  };

  const renderContent = () => {
    if (selectedClient) {
      return (
        <Suspense fallback={<LoadingSkeleton variant="card" className="h-96" />}>
          <ClientDetailPage client={selectedClient} onBack={handleBack} />
        </Suspense>
      );
    }
    
    if (selectedSession) {
      return (
        <Suspense fallback={<LoadingSkeleton variant="card" className="h-96" />}>
          <SessionDetailPage session={selectedSession} onBack={handleBack} />
        </Suspense>
      );
    }

    switch (activeView) {
      case 'dashboard':
        return (
          <Suspense fallback={<LoadingSkeleton variant="card" className="h-96" />}>
            <DashboardPage />
          </Suspense>
        );
      case 'clients':
        return (
          <Suspense fallback={<LoadingSkeleton variant="card" className="h-96" />}>
            <ClientsPage onClientSelect={handleClientSelect} />
          </Suspense>
        );
      case 'sessions':
        return (
          <Suspense fallback={<LoadingSkeleton variant="card" className="h-96" />}>
            <SessionsPage onSessionSelect={handleSessionSelect} />
          </Suspense>
        );
      case 'settings':
        return (
          <Suspense fallback={<LoadingSkeleton variant="card" className="h-96" />}>
            <SettingsPage />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingSkeleton variant="card" className="h-96" />}>
            <DashboardPage />
          </Suspense>
        );
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation 
        activeView={activeView}
        onViewChange={handleViewChange}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
      />
      
      <main className="flex-1 overflow-auto lg:ml-64">
        <div className="min-h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;