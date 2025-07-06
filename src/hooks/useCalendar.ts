import { useState, useEffect } from 'react';
import { calendarService } from '../services/calendarService';
import { CalendarEvent, Session } from '../types';
import { useAppStore } from '../store/useAppStore';

export const useCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { sessions, user } = useAppStore();

  const loadEvents = async (startDate: string, endDate: string) => {
    if (!user?.id) {
      setError('User not authenticated.');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await calendarService.getEvents(startDate, endDate, user.id);
      if (response.success) {
        // Combine API events with session events
        const sessionEvents = sessions.map(session => 
          calendarService.convertSessionToEvent(session)
        );
        setEvents([...response.data, ...sessionEvents]);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load calendar events');
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (event: Omit<CalendarEvent, 'id'>) => {
    try {
      const response = await calendarService.createEvent(event);
      if (response.success) {
        setEvents(prev => [...prev, response.data]);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: 'Failed to create event' };
    }
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>) => {
    try {
      const response = await calendarService.updateEvent(id, updates);
      if (response.success) {
        setEvents(prev => prev.map(event => 
          event.id === id ? response.data : event
        ));
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: 'Failed to update event' };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const response = await calendarService.deleteEvent(id);
      if (response.success) {
        setEvents(prev => prev.filter(event => event.id !== id));
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: 'Failed to delete event' };
    }
  };

  const syncWithGoogle = async () => {
    setIsLoading(true);
    try {
      const response = await calendarService.syncWithGoogleCalendar();
      if (response.success) {
        // Reload events after sync
        const today = new Date();
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
        await loadEvents(today.toISOString().split('T')[0], nextMonth.toISOString().split('T')[0]);
        return { success: true, syncedEvents: response.data.syncedEvents };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: 'Failed to sync with Google Calendar' };
    } finally {
      setIsLoading(false);
    }
  };

  const getAvailableSlots = async (date: string, duration: number = 60) => {
    try {
      const response = await calendarService.getAvailableSlots(date, duration);
      return response.success ? response.data : [];
    } catch (err) {
      return [];
    }
  };

  return {
    events,
    isLoading,
    error,
    loadEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    syncWithGoogle,
    getAvailableSlots
  };
};