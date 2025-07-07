import { useEffect, lazy, Suspense } from 'react';
import { useAppStore } from './store/useAppStore';
import Navigation from './components/Navigation';
import LoadingSkeleton from './components/ui/LoadingSkeleton';

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ClientsPage = lazy(() => import('./components/Clients'));
const SessionsPage = lazy(() => import('./components/Sessions'));
const ClientDetailPage = lazy(() => import('./components/ClientDetail'));
const SessionDetailPage = lazy(() => import('./components/SessionDetail'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ReminderManager = lazy(() => import('./components/ReminderManager'));

function App() {
  const {
    user,
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
    darkMode,
    isLoading,
    initializeAuth
  } = useAppStore();

  // Initialize app data and authentication
  useEffect(() => {
    initializeAuth();
    
    // Data is now fetched via initializeAuth and fetchUserData
  }, [initializeAuth, setClients, setSessions, setReminders]);

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
      case 'reminders':
        return (
          <Suspense fallback={<LoadingSkeleton variant="card" className="h-96" />}>
            <ReminderManager />
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Navigation 
        activeView={activeView}
        onViewChange={handleViewChange}
        isMobileOpen={isMobileMenuOpen}
        onMobileToggle={() => setMobileMenuOpen(!isMobileMenuOpen)}
        user={user}
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