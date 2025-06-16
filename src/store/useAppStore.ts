import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AppState, ClientProfile, Session, Reminder, TherapistUser } from '../types';

interface AppStore extends AppState {
  // Actions
  setUser: (user: TherapistUser | null) => void;
  setClients: (clients: ClientProfile[]) => void;
  addClient: (client: ClientProfile) => void;
  updateClient: (id: string, updates: Partial<ClientProfile>) => void;
  removeClient: (id: string) => void;
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Session) => void;
  updateSession: (id: string, updates: Partial<Session>) => void;
  removeSession: (id: string) => void;
  setReminders: (reminders: Reminder[]) => void;
  addReminder: (reminder: Reminder) => void;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  removeReminder: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveView: (view: string) => void;
  setSelectedClient: (client: ClientProfile | null) => void;
  setSelectedSession: (session: Session | null) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  
  // Computed values
  getClientById: (id: string) => ClientProfile | undefined;
  getSessionById: (id: string) => Session | undefined;
  getClientSessions: (clientId: string) => Session[];
  getUpcomingSessions: () => Session[];
  getActiveClients: () => ClientProfile[];
  getTodaysSessions: () => Session[];
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        clients: [],
        sessions: [],
        reminders: [],
        isLoading: false,
        error: null,
        activeView: 'dashboard',
        selectedClient: null,
        selectedSession: null,
        isMobileMenuOpen: false,
        darkMode: false,

        // Actions
        setUser: (user) => set({ user }),
        
        setClients: (clients) => set({ clients }),
        addClient: (client) => set((state) => ({ 
          clients: [...state.clients, client] 
        })),
        updateClient: (id, updates) => set((state) => ({
          clients: state.clients.map(client => 
            client.id === id ? { ...client, ...updates, updatedAt: new Date().toISOString() } : client
          )
        })),
        removeClient: (id) => set((state) => ({
          clients: state.clients.filter(client => client.id !== id)
        })),

        setSessions: (sessions) => set({ sessions }),
        addSession: (session) => set((state) => ({ 
          sessions: [...state.sessions, session] 
        })),
        updateSession: (id, updates) => set((state) => ({
          sessions: state.sessions.map(session => 
            session.id === id ? { ...session, ...updates, updatedAt: new Date().toISOString() } : session
          )
        })),
        removeSession: (id) => set((state) => ({
          sessions: state.sessions.filter(session => session.id !== id)
        })),

        setReminders: (reminders) => set({ reminders }),
        addReminder: (reminder) => set((state) => ({ 
          reminders: [...state.reminders, reminder] 
        })),
        updateReminder: (id, updates) => set((state) => ({
          reminders: state.reminders.map(reminder => 
            reminder.id === id ? { ...reminder, ...updates, updatedAt: new Date().toISOString() } : reminder
          )
        })),
        removeReminder: (id) => set((state) => ({
          reminders: state.reminders.filter(reminder => reminder.id !== id)
        })),

        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        setActiveView: (activeView) => set({ activeView }),
        setSelectedClient: (selectedClient) => set({ selectedClient }),
        setSelectedSession: (selectedSession) => set({ selectedSession }),
        setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
        setDarkMode: (darkMode) => set({ darkMode }),

        // Computed values
        getClientById: (id) => get().clients.find(client => client.id === id),
        getSessionById: (id) => get().sessions.find(session => session.id === id),
        getClientSessions: (clientId) => get().sessions.filter(session => session.clientId === clientId),
        getUpcomingSessions: () => {
          const now = new Date();
          return get().sessions
            .filter(session => session.status === 'scheduled' && new Date(session.date) >= now)
            .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime());
        },
        getActiveClients: () => get().clients.filter(client => client.status === 'active'),
        getTodaysSessions: () => {
          const today = new Date().toISOString().split('T')[0];
          return get().sessions.filter(session => session.date === today);
        }
      }),
      {
        name: 'isana-app-store',
        partialize: (state) => ({
          user: state.user,
          clients: state.clients,
          sessions: state.sessions,
          reminders: state.reminders,
          activeView: state.activeView,
          selectedClient: state.selectedClient,
          selectedSession: state.selectedSession,
          isMobileMenuOpen: state.isMobileMenuOpen,
          darkMode: state.darkMode
        })
      }
    ),
    { name: 'IsanaAppStore' }
  )
);