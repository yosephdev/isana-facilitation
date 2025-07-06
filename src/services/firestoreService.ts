import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { ClientProfile, Session, Reminder } from '../types';

const clientsCollectionRef = collection(db, 'clients');
const sessionsCollectionRef = collection(db, 'sessions');
const remindersCollectionRef = collection(db, 'reminders');

export const firestoreService = {
  // Clients
  getClients: async (userId: string): Promise<ClientProfile[]> => {
    const q = query(clientsCollectionRef, where('userId', '==', userId));
    const data = await getDocs(q);
    return data.docs.map((doc) => ({
      ...(doc.data() as ClientProfile),
      id: doc.id,
    }));
  },

  addClient: async (client: Omit<ClientProfile, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<ClientProfile> => {
    const newClient = {
      ...client,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(clientsCollectionRef, newClient);
    return { ...newClient, id: docRef.id };
  },

  updateClient: async (id: string, updates: Partial<ClientProfile>): Promise<void> => {
    const clientDoc = doc(db, 'clients', id);
    await updateDoc(clientDoc, { ...updates, updatedAt: new Date().toISOString() });
  },

  deleteClient: async (id: string): Promise<void> => {
    const clientDoc = doc(db, 'clients', id);
    await deleteDoc(clientDoc);
  },

  // Sessions
  getSessions: async (userId: string): Promise<Session[]> => {
    const q = query(sessionsCollectionRef, where('userId', '==', userId));
    const data = await getDocs(q);
    return data.docs.map((doc) => ({
      ...(doc.data() as Session),
      id: doc.id,
    }));
  },

  addSession: async (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Session> => {
    const newSession = {
      ...session,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(sessionsCollectionRef, newSession);
    return { ...newSession, id: docRef.id };
  },

  updateSession: async (id: string, updates: Partial<Session>): Promise<void> => {
    const sessionDoc = doc(db, 'sessions', id);
    await updateDoc(sessionDoc, { ...updates, updatedAt: new Date().toISOString() });
  },

  deleteSession: async (id: string): Promise<void> => {
    const sessionDoc = doc(db, 'sessions', id);
    await deleteDoc(sessionDoc);
  },

  // Reminders
  getReminders: async (userId: string): Promise<Reminder[]> => {
    const q = query(remindersCollectionRef, where('userId', '==', userId));
    const data = await getDocs(q);
    return data.docs.map((doc) => ({
      ...(doc.data() as Reminder),
      id: doc.id,
    }));
  },

  addReminder: async (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Reminder> => {
    const newReminder = {
      ...reminder,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docRef = await addDoc(remindersCollectionRef, newReminder);
    return { ...newReminder, id: docRef.id };
  },

  updateReminder: async (id: string, updates: Partial<Reminder>): Promise<void> => {
    const reminderDoc = doc(db, 'reminders', id);
    await updateDoc(reminderDoc, { ...updates, updatedAt: new Date().toISOString() });
  },

  deleteReminder: async (id: string): Promise<void> => {
    const reminderDoc = doc(db, 'reminders', id);
    await deleteDoc(reminderDoc);
  },
};