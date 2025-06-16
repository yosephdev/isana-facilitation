import { ClientProfile, Session, Reminder, TherapistUser } from '../types';

export const mockUser: TherapistUser = {
  id: 'therapist-1',
  name: 'Dr. Rachel Smith',
  email: 'dr.smith@isana.com',
  phone: '(555) 123-4567',
  license: {
    number: 'LPC-12345',
    type: 'Licensed Professional Counselor',
    state: 'CA',
    expirationDate: '2025-12-31'
  },
  specializations: ['Anxiety Disorders', 'Depression', 'Trauma Therapy', 'Cognitive Behavioral Therapy'],
  credentials: ['LPC', 'EMDR', 'CBT'],
  avatar: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
  preferences: {
    workingHours: {
      start: '09:00',
      end: '17:00',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    defaultSessionDuration: 60,
    timezone: 'America/Los_Angeles'
  },
  createdAt: '2023-01-15T00:00:00Z',
  updatedAt: '2024-01-20T00:00:00Z'
};

export const mockClients: ClientProfile[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '(555) 123-4567',
    dateOfBirth: '1985-03-15',
    emergencyContact: {
      name: 'Michael Johnson',
      phone: '(555) 987-6543',
      relationship: 'Spouse',
      email: 'michael.johnson@email.com'
    },
    notes: 'Client is making excellent progress with anxiety management techniques. Shows strong commitment to therapy goals.',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    lastSession: '2024-01-20',
    totalSessions: 12,
    diagnosis: 'Generalized Anxiety Disorder',
    goals: ['Reduce anxiety symptoms', 'Improve coping strategies', 'Enhance work-life balance'],
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BC123456789',
      groupNumber: 'GRP001'
    },
    preferences: {
      preferredTime: 'morning',
      communicationMethod: 'email',
      sessionType: 'in-person'
    }
  },
  {
    id: '2',
    name: 'Marcus Thompson',
    email: 'marcus.t@email.com',
    phone: '(555) 234-5678',
    dateOfBirth: '1992-07-22',
    emergencyContact: {
      name: 'Lisa Thompson',
      phone: '(555) 876-5432',
      relationship: 'Mother'
    },
    notes: 'Working through grief counseling. Client shows resilience and openness to healing process.',
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    lastSession: '2024-01-18',
    totalSessions: 8,
    diagnosis: 'Adjustment Disorder with Depressed Mood',
    goals: ['Process grief', 'Build support network', 'Develop healthy coping mechanisms'],
    preferences: {
      preferredTime: 'afternoon',
      communicationMethod: 'phone',
      sessionType: 'virtual'
    }
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily.chen@email.com',
    phone: '(555) 345-6789',
    dateOfBirth: '1978-11-08',
    emergencyContact: {
      name: 'David Chen',
      phone: '(555) 765-4321',
      relationship: 'Partner'
    },
    notes: 'Successfully completed treatment goals. Maintaining progress with monthly check-ins.',
    status: 'completed',
    createdAt: '2023-09-10T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    lastSession: '2024-01-05',
    totalSessions: 24,
    diagnosis: 'Major Depressive Disorder',
    goals: ['Mood stabilization', 'Return to work', 'Strengthen relationships'],
    preferences: {
      preferredTime: 'evening',
      communicationMethod: 'email',
      sessionType: 'hybrid'
    }
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    email: 'alex.r@email.com',
    phone: '(555) 456-7890',
    dateOfBirth: '1995-05-12',
    emergencyContact: {
      name: 'Maria Rodriguez',
      phone: '(555) 654-3210',
      relationship: 'Sister'
    },
    notes: 'Young adult navigating career transitions and relationship challenges. Highly motivated.',
    status: 'active',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z',
    lastSession: '2024-01-19',
    totalSessions: 6,
    goals: ['Career clarity', 'Improve communication skills', 'Build confidence'],
    preferences: {
      preferredTime: 'afternoon',
      communicationMethod: 'text',
      sessionType: 'virtual'
    }
  }
];

export const mockSessions: Session[] = [
  {
    id: '1',
    clientId: '1',
    clientName: 'Sarah Johnson',
    date: '2024-01-22',
    startTime: '10:00',
    endTime: '11:00',
    type: 'individual',
    status: 'scheduled',
    objectives: ['Review progress on anxiety management', 'Practice breathing techniques'],
    outcomes: [],
    nextSteps: [],
    mood: 'neutral',
    meta: {
      duration: 60,
      location: 'Office Room A',
      sessionNumber: 13,
      billingCode: '90834',
      copayAmount: 25
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    clientId: '2',
    clientName: 'Marcus Thompson',
    date: '2024-01-22',
    startTime: '14:00',
    endTime: '15:00',
    type: 'individual',
    status: 'scheduled',
    objectives: ['Explore recent triggers', 'Discuss support system'],
    outcomes: [],
    nextSteps: [],
    mood: 'neutral',
    meta: {
      duration: 60,
      location: 'Office Room B',
      sessionNumber: 9,
      billingCode: '90834'
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    clientId: '1',
    clientName: 'Sarah Johnson',
    date: '2024-01-20',
    startTime: '10:00',
    endTime: '11:00',
    type: 'individual',
    status: 'completed',
    objectives: ['Review progress on anxiety management', 'Assess sleep quality improvements'],
    outcomes: ['Reduced anxiety levels', 'Improved sleep patterns', 'Consistent meditation practice'],
    nextSteps: ['Continue meditation routine', 'Introduce progressive muscle relaxation', 'Schedule next session'],
    mood: 'good',
    meta: {
      duration: 60,
      location: 'Office Room A',
      sessionNumber: 12,
      billingCode: '90834',
      copayAmount: 25
    },
    notes: {
      presentingConcerns: 'Client reported significant improvement in sleep quality. Anxiety levels decreased from 7/10 to 4/10 over the past week.',
      interventions: ['Mindfulness meditation', 'Cognitive restructuring', 'Sleep hygiene education'],
      clientResponse: 'Very engaged and motivated. Successfully implemented daily meditation practice.',
      homework: ['Continue 10-minute daily meditation', 'Practice progressive muscle relaxation before bed'],
      riskAssessment: 'low',
      nextSessionPlan: 'Introduce advanced anxiety management techniques',
      privateNotes: 'Client showing excellent progress. Consider reducing session frequency.'
    },
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '4',
    clientId: '4',
    clientName: 'Alex Rodriguez',
    date: '2024-01-19',
    startTime: '16:00',
    endTime: '17:00',
    type: 'individual',
    status: 'completed',
    objectives: ['Debrief job interview', 'Build confidence'],
    outcomes: ['Increased self-awareness', 'Better communication skills', 'Clear career direction'],
    nextSteps: ['Apply to 3 more positions', 'Practice interview skills', 'Continue confidence-building exercises'],
    mood: 'excellent',
    meta: {
      duration: 60,
      location: 'Virtual Session',
      sessionNumber: 6,
      billingCode: '90834'
    },
    notes: {
      presentingConcerns: 'Recent job interview experience and career uncertainty.',
      interventions: ['Cognitive behavioral techniques', 'Confidence building exercises', 'Career exploration'],
      clientResponse: 'Showed increased confidence and better communication skills during session.',
      homework: ['Apply to 3 more positions', 'Practice interview scenarios', 'Complete career values assessment'],
      riskAssessment: 'low',
      nextSessionPlan: 'Continue career-focused work and confidence building',
      privateNotes: 'Significant improvement in self-confidence. Ready for more challenging goals.'
    },
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-19T00:00:00Z'
  },
  {
    id: '5',
    clientId: '2',
    clientName: 'Marcus Thompson',
    date: '2024-01-18',
    startTime: '14:00',
    endTime: '15:00',
    type: 'individual',
    status: 'completed',
    objectives: ['Process anniversary reactions', 'Strengthen coping strategies'],
    outcomes: ['Healthy processing of grief', 'Utilized support network', 'Demonstrated resilience'],
    nextSteps: ['Continue journaling', 'Schedule time with support network', 'Monitor mood patterns'],
    mood: 'good',
    meta: {
      duration: 60,
      location: 'Office Room B',
      sessionNumber: 8,
      billingCode: '90834'
    },
    notes: {
      presentingConcerns: 'Anniversary of loss approaching, increased emotional distress.',
      interventions: ['Grief processing techniques', 'Support network activation', 'Coping skills reinforcement'],
      clientResponse: 'Demonstrated healthy coping strategies and reached out to support network as discussed.',
      homework: ['Continue daily journaling', 'Schedule weekly check-ins with support network'],
      riskAssessment: 'low',
      nextSessionPlan: 'Continue grief work and monitor anniversary reaction',
      privateNotes: 'Client showing good progress in grief work. Support network is strong.'
    },
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z'
  }
];

export const mockReminders: Reminder[] = [
  {
    id: '1',
    clientId: '1',
    sessionId: '1',
    type: 'session',
    title: 'Session Reminder - Sarah Johnson',
    description: 'Individual therapy session tomorrow at 10:00 AM',
    dueDate: '2024-01-21T10:00:00Z',
    isCompleted: false,
    priority: 'medium',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    clientId: '3',
    type: 'follow-up',
    title: 'Follow-up Check - Emily Chen',
    description: 'Monthly check-in call scheduled',
    dueDate: '2024-01-25T00:00:00Z',
    isCompleted: false,
    priority: 'low',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    clientId: '2',
    type: 'insurance',
    title: 'Insurance Authorization',
    description: 'Renew insurance authorization for Marcus Thompson',
    dueDate: '2024-01-30T00:00:00Z',
    isCompleted: false,
    priority: 'high',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '4',
    type: 'custom',
    title: 'License Renewal',
    description: 'Professional license renewal due in 6 months',
    dueDate: '2024-07-31T00:00:00Z',
    isCompleted: false,
    priority: 'medium',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];