import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AppState, ClientProfile, Session, Reminder, TherapistUser, Document } from '../types';
import { authService } from '../services/authService';
import { firestoreService } from '../services/firestoreService';

interface AppStore extends AppState {
  // Actions
  setUser: (user: TherapistUser | null) => void;
  setClients: (clients: ClientProfile[]) => void;
  addClient: (client: Omit<ClientProfile, 'id' | 'createdAt' | 'updatedAt'>) => Promise<ClientProfile | undefined>;
  updateClient: (id: string, updates: Partial<ClientProfile>) => Promise<void>;
  removeClient: (id: string) => Promise<void>;
  setSessions: (sessions: Session[]) => void;
  addSession: (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Session | undefined>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  removeSession: (id: string) => Promise<void>;
  setReminders: (reminders: Reminder[]) => void;
  addReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Reminder | undefined>;
  updateReminder: (id: string, updates: Partial<Reminder>) => Promise<void>;
  removeReminder: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveView: (view: string) => void;
  setSelectedClient: (client: ClientProfile | null) => void;
  setSelectedSession: (session: Session | null) => void;
  setMobileMenuOpen: (open: boolean) => void;
  setDarkMode: (enabled: boolean) => void;
  setDocuments: (documents: Document[]) => void;
  addDocument: (document: Document) => void;
  removeDocument: (id: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  fetchUserData: (userId: string) => Promise<void>;
  
  // Computed values
  getClientById: (id: string) => ClientProfile | undefined;
  getSessionById: (id: string) => Session | undefined;
  getClientSessions: (clientId: string) => Session[];
  getUpcomingSessions: () => Session[];
  getActiveClients: () => ClientProfile[];
  getTodaysSessions: () => Session[];
  getDocumentsByClientId: (clientId: string) => Document[];
  getDocumentsBySessionId: (sessionId: string) => Document[];
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
        documents: [], // New state for documents
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
        addClient: async (client) => {
          const userId = get().user?.id;
          if (!userId) {
            set({ error: 'User not authenticated.' });
            return undefined;
          }
          try {
            const newClient = await firestoreService.addClient(client, userId);
            set((state) => ({ clients: [...state.clients, newClient] }));
            return newClient;
          } catch (error: any) {
            set({ error: error.message });
            return undefined;
          }
        },
        updateClient: async (id, updates) => {
          try {
            await firestoreService.updateClient(id, updates);
            set((state) => ({
              clients: state.clients.map(client => 
                client.id === id ? { ...client, ...updates, updatedAt: new Date().toISOString() } : client
              )
            }));
          } catch (error: any) {
            set({ error: error.message });
          }
        },
        removeClient: async (id) => {
          try {
            await firestoreService.deleteClient(id);
            set((state) => ({
              clients: state.clients.filter(client => client.id !== id)
            }));
          } catch (error: any) {
            set({ error: error.message });
          }
        },

        setSessions: (sessions) => set({ sessions }),
        addSession: async (session) => {
          const userId = get().user?.id;
          if (!userId) {
            set({ error: 'User not authenticated.' });
            return undefined;
          }
          try {
            const newSession = await firestoreService.addSession(session, userId);
            set((state) => ({ sessions: [...state.sessions, newSession] }));
            return newSession;
          } catch (error: any) {
            set({ error: error.message });
            return undefined;
          }
        },
        updateSession: async (id, updates) => {
          try {
            await firestoreService.updateSession(id, updates);
            set((state) => ({
              sessions: state.sessions.map(session => 
                session.id === id ? { ...session, ...updates, updatedAt: new Date().toISOString() } : session
              )
            }));
          } catch (error: any) {
            set({ error: error.message });
          }
        },
        removeSession: async (id) => {
          try {
            await firestoreService.deleteSession(id);
            set((state) => ({
              sessions: state.sessions.filter(session => session.id !== id)
            }));
          } catch (error: any) {
            set({ error: error.message });
          }
        },

        setReminders: (reminders) => set({ reminders }),
        addReminder: async (reminder) => {
          const userId = get().user?.id;
          if (!userId) {
            set({ error: 'User not authenticated.' });
            return undefined;
          }
          try {
            const newReminder = await firestoreService.addReminder(reminder, userId);
            set((state) => ({ reminders: [...state.reminders, newReminder] }));
            return newReminder;
          } catch (error: any) {
            set({ error: error.message });
            return undefined;
          }
        },
        updateReminder: async (id, updates) => {
          try {
            await firestoreService.updateReminder(id, updates);
            set((state) => ({
              reminders: state.reminders.map(reminder => 
                reminder.id === id ? { ...reminder, ...updates, updatedAt: new Date().toISOString() } : reminder
              )
            }));
          } catch (error: any) {
            set({ error: error.message });
          }
        },
        removeReminder: async (id) => {
          try {
            await firestoreService.deleteReminder(id);
            set((state) => ({
              reminders: state.reminders.filter(reminder => reminder.id !== id)
            }));
          } catch (error: any) {
            set({ error: error.message });
          }
        },

        setDocuments: (documents) => set({ documents }),
        addDocument: (document) => set((state) => ({ 
          documents: [...state.documents, document] 
        })),
        removeDocument: (id) => set((state) => ({
          documents: state.documents.filter(document => document.id !== id)
        })),

        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        setActiveView: (activeView) => set({ activeView }),
        setSelectedClient: (selectedClient) => set({ selectedClient }),
        setSelectedSession: (selectedSession) => set({ selectedSession }),
        setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
        setDarkMode: (darkMode) => set({ darkMode }),

        login: async (email, password) => {
          set({ isLoading: true, error: null });
          const response = await authService.login(email, password);
          if (response.success) {
            set({ user: response.data.user, isLoading: false });
            if (response.data.user?.id) {
              await get().fetchUserData(response.data.user.id);
            }
            return true;
          } else {
            set({ error: response.message, isLoading: false });
            return false;
          }
        },

        logout: async () => {
          set({ isLoading: true, error: null });
          const response = await authService.logout();
          if (response.success) {
            set({ user: null, clients: [], sessions: [], reminders: [], isLoading: false }); // Clear data on logout
          } else {
            set({ error: response.message, isLoading: false });
          }
        },

        initializeAuth: async () => {
          set({ isLoading: true });
          const user = await authService.getCurrentUser();
          set({ user, isLoading: false });
          if (user?.id) {
            await get().fetchUserData(user.id);
          }
        },

        fetchUserData: async (userId: string) => {
          set({ isLoading: true, error: null });
          try {
            const clients = await firestoreService.getClients(userId);
            const sessions = await firestoreService.getSessions(userId);
            const reminders = await firestoreService.getReminders(userId);
            set({ clients, sessions, reminders, isLoading: false });
          } catch (error: any) {
            set({ error: error.message, isLoading: false });
          }
        },

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
        },
        getDocumentsByClientId: (clientId) => get().documents.filter(doc => doc.associatedClientIds?.includes(clientId)),
        getDocumentsBySessionId: (sessionId) => get().documents.filter(doc => doc.associatedSessionIds?.includes(sessionId))
      }),
      {
        name: 'isana-app-store',
        partialize: (state) => ({
          user: state.user,
          clients: state.clients,
          sessions: state.sessions,
          reminders: state.reminders,
          documents: state.documents, // Persist documents
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