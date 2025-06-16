import { CalendarEvent, Session, ApiResponse } from '../types';

class CalendarService {
  async getEvents(startDate: string, endDate: string): Promise<ApiResponse<CalendarEvent[]>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock calendar events
    const mockEvents: CalendarEvent[] = [
      {
        id: 'event-1',
        title: 'Sarah Johnson - Individual Session',
        start: '2024-01-22T10:00:00',
        end: '2024-01-22T11:00:00',
        clientId: '1',
        sessionId: '1',
        type: 'session',
        color: '#3B82F6'
      },
      {
        id: 'event-2',
        title: 'Marcus Thompson - Individual Session',
        start: '2024-01-22T14:00:00',
        end: '2024-01-22T15:00:00',
        clientId: '2',
        sessionId: '2',
        type: 'session',
        color: '#10B981'
      },
      {
        id: 'event-3',
        title: 'Lunch Break',
        start: '2024-01-22T12:00:00',
        end: '2024-01-22T13:00:00',
        type: 'break',
        color: '#F59E0B',
        editable: false
      },
      {
        id: 'event-4',
        title: 'Administrative Time',
        start: '2024-01-23T09:00:00',
        end: '2024-01-23T10:00:00',
        type: 'admin',
        color: '#8B5CF6'
      }
    ];

    return {
      success: true,
      message: 'Events retrieved successfully',
      data: mockEvents
    };
  }

  async createEvent(event: Omit<CalendarEvent, 'id'>): Promise<ApiResponse<CalendarEvent>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newEvent: CalendarEvent = {
      ...event,
      id: 'event-' + Date.now()
    };

    return {
      success: true,
      message: 'Event created successfully',
      data: newEvent
    };
  }

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<ApiResponse<CalendarEvent>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock updated event
    const updatedEvent: CalendarEvent = {
      id,
      title: 'Updated Event',
      start: '2024-01-22T10:00:00',
      end: '2024-01-22T11:00:00',
      type: 'session',
      ...updates
    };

    return {
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    };
  }

  async deleteEvent(id: string): Promise<ApiResponse<null>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      message: 'Event deleted successfully',
      data: null
    };
  }

  async syncWithGoogleCalendar(): Promise<ApiResponse<{ syncedEvents: number }>> {
    // Simulate Google Calendar sync
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      success: true,
      message: 'Calendar synced with Google Calendar',
      data: { syncedEvents: 5 }
    };
  }

  async getAvailableSlots(date: string, duration: number = 60): Promise<ApiResponse<string[]>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock available time slots
    const availableSlots = [
      '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
    ];

    return {
      success: true,
      message: 'Available slots retrieved',
      data: availableSlots
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
      editable: session.status === 'scheduled'
    };
  }

  private getSessionTypeColor(type: Session['type']): string {
    const colors = {
      individual: '#3B82F6',
      group: '#10B981',
      family: '#F59E0B',
      consultation: '#8B5CF6',
      intake: '#EF4444'
    };
    return colors[type] || '#6B7280';
  }
}

export const calendarService = new CalendarService();