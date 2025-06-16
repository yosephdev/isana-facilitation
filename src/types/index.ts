export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  email?: string;
}

export interface ClientProfile extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: EmergencyContact;
  notes: string;
  status: 'active' | 'inactive' | 'completed' | 'on-hold';
  lastSession?: string;
  totalSessions: number;
  diagnosis?: string;
  goals: string[];
  insuranceInfo?: {
    provider: string;
    policyNumber: string;
    groupNumber?: string;
  };
  preferences: {
    preferredTime: string;
    communicationMethod: 'email' | 'phone' | 'text';
    sessionType: 'in-person' | 'virtual' | 'hybrid';
  };
}

export interface SessionMeta {
  duration: number; // in minutes
  location: string;
  sessionNumber: number;
  billingCode?: string;
  copayAmount?: number;
}

export interface SessionNotes {
  presentingConcerns: string;
  interventions: string[];
  clientResponse: string;
  homework: string[];
  riskAssessment: 'low' | 'moderate' | 'high';
  nextSessionPlan: string;
  privateNotes: string; // therapist-only notes
}

export interface Session extends BaseEntity {
  clientId: string;
  clientName: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'individual' | 'group' | 'family' | 'consultation' | 'intake';
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  objectives: string[];
  outcomes: string[];
  nextSteps: string[];
  mood: 'excellent' | 'good' | 'neutral' | 'difficult' | 'concerning';
  meta: SessionMeta;
  notes?: SessionNotes;
  attachments?: string[]; // file URLs
}

export interface TherapistUser extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  license: {
    number: string;
    type: string;
    state: string;
    expirationDate: string;
  };
  specializations: string[];
  credentials: string[];
  avatar?: string;
  preferences: {
    workingHours: {
      start: string;
      end: string;
      days: string[];
    };
    defaultSessionDuration: number;
    timezone: string;
  };
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  sessionsThisWeek: number;
  upcomingSessions: number;
  completionRate: number;
  averageSessionsPerClient: number;
  revenueThisMonth: number;
  cancelledSessions: number;
}

export interface Reminder extends BaseEntity {
  clientId: string;
  sessionId?: string;
  type: 'session' | 'follow-up' | 'insurance' | 'custom';
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  clientId?: string;
  sessionId?: string;
  type: 'session' | 'break' | 'admin' | 'personal';
  color?: string;
  editable?: boolean;
}

export interface AppState {
  user: TherapistUser | null;
  clients: ClientProfile[];
  sessions: Session[];
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  activeView: string;
  selectedClient: ClientProfile | null;
  selectedSession: Session | null;
  isMobileMenuOpen: boolean;
  darkMode: boolean;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  emergencyContact: EmergencyContact;
  diagnosis?: string;
  goals: string[];
  insuranceInfo?: ClientProfile['insuranceInfo'];
  preferences: ClientProfile['preferences'];
}

export interface SessionFormData {
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: Session['type'];
  objectives: string[];
  location: string;
}

// Filter and search types
export interface ClientFilters {
  status?: ClientProfile['status'];
  search?: string;
  sortBy?: 'name' | 'lastSession' | 'totalSessions' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SessionFilters {
  status?: Session['status'];
  type?: Session['type'];
  clientId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  sortBy?: 'date' | 'clientName' | 'type' | 'status';
  sortOrder?: 'asc' | 'desc';
}