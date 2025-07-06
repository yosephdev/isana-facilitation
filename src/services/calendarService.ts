import { CalendarEvent, Session, ApiResponse } from '../types';
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

const calendarEventsCollectionRef = collection(db, 'calendarEvents');

class CalendarService {
  async getEvents(startDate: string, endDate: string, userId: string): Promise<ApiResponse<CalendarEvent[]>> {
    try {
      const q = query(
        calendarEventsCollectionRef,
        where('userId', '==', userId),
        where('start', '>=', startDate),
        where('end', '<=', endDate)
      );
      const querySnapshot = await getDocs(q);
      const events: CalendarEvent[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<CalendarEvent, 'id'>),
      }));
      return {
        success: true,
        message: 'Events retrieved successfully',
        data: events,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to retrieve events',
        data: [],
      };
    }
  }

  async createEvent(event: Omit<CalendarEvent, 'id'>, userId: string): Promise<ApiResponse<CalendarEvent>> {
    try {
      const newEvent = {
        ...event,
        userId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };
      const docRef = await addDoc(calendarEventsCollectionRef, newEvent);
      return {
        success: true,
        message: 'Event created successfully',
        data: { ...newEvent, id: docRef.id } as CalendarEvent,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to create event',
        data: {} as CalendarEvent,
      };
    }
  }

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<ApiResponse<CalendarEvent>> {
    try {
      const eventDoc = doc(db, 'calendarEvents', id);
      await updateDoc(eventDoc, { ...updates, updatedAt: Timestamp.now() });
      // For simplicity, we're returning a partial event. In a real app, you might fetch the full updated event.
      return {
        success: true,
        message: 'Event updated successfully',
        data: { id, ...updates } as CalendarEvent,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to update event',
        data: {} as CalendarEvent,
      };
    }
  }

  async deleteEvent(id: string): Promise<ApiResponse<null>> {
    try {
      const eventDoc = doc(db, 'calendarEvents', id);
      await deleteDoc(eventDoc);
      return {
        success: true,
        message: 'Event deleted successfully',
        data: null,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to delete event',
        data: null,
      };
    }
  }

  async syncWithGoogleCalendar(): Promise<ApiResponse<{ syncedEvents: number }>> {
    // This would involve Google API integration, which is beyond the scope of this task.
    // Simulating success for now.
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      message: 'Calendar synced with Google Calendar (simulated)',
      data: { syncedEvents: 0 },
    };
  }

  async getAvailableSlots(date: string, duration: number = 60): Promise<ApiResponse<string[]>> {
    // This would involve complex scheduling logic and checking existing events.
    // Simulating available slots for now.
    await new Promise(resolve => setTimeout(resolve, 500));
    const availableSlots = [
      '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
    ];
    return {
      success: true,
      message: 'Available slots retrieved (simulated)',
      data: availableSlots,
    };
  }

  convertSessionToEvent(session: Session): CalendarEvent {
    return {
      id: `session-${session.id}`,
      title: `${session.clientName} - ${session.type} Session`,
      start: `${session.date}T${session.startTime}:00`,
      end: `${session.date}T${session.endTime}:00`,
      clientId: session.clientId,
      sessionId: session.id,
      type: 'session',
      color: this.getSessionTypeColor(session.type),
      editable: session.status === 'scheduled',
    };
  }

  private getSessionTypeColor(type: Session['type']): string {
    const colors = {
      individual: '#3B82F6',
      group: '#10B981',
      family: '#F59E0B',
      consultation: '#8B5CF6',
      intake: '#EF4444',
    };
    return colors[type] || '#6B7280';
  }
}

export const calendarService = new CalendarService();