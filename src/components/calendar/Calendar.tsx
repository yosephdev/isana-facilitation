import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarEvent } from '../../types';
import { useCalendar } from '../../hooks/useCalendar';
import LoadingSkeleton from '../ui/LoadingSkeleton';

interface CalendarProps {
  onEventClick?: (event: CalendarEvent) => void;
  onDateSelect?: (start: string, end: string) => void;
  onEventDrop?: (eventId: string, newStart: string, newEnd: string) => void;
  height?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  onEventClick,
  onDateSelect,
  onEventDrop,
  height = '600px'
}) => {
  const calendarRef = useRef<FullCalendar>(null);
  const { events, isLoading, loadEvents } = useCalendar();

  useEffect(() => {
    // Load initial events
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
    loadEvents(today.toISOString().split('T')[0], nextMonth.toISOString().split('T')[0]);
  }, [loadEvents]);

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id);
    if (event && onEventClick) {
      onEventClick(event);
    }
  };

  const handleDateSelect = (info: any) => {
    if (onDateSelect) {
      onDateSelect(info.startStr, info.endStr);
    }
  };

  const handleEventDrop = (info: any) => {
    if (onEventDrop) {
      onEventDrop(info.event.id, info.event.startStr, info.event.endStr);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <LoadingSkeleton variant="card" className="h-96" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events.map(event => ({
          id: event.id,
          title: event.title,
          start: event.start,
          end: event.end,
          backgroundColor: event.color,
          borderColor: event.color,
          editable: event.editable !== false
        }))}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        height={height}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventResize={handleEventDrop}
        slotMinTime="08:00:00"
        slotMaxTime="19:00:00"
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
          startTime: '09:00',
          endTime: '17:00'
        }}
        eventClassNames="cursor-pointer hover:opacity-80 transition-opacity"
        dayHeaderClassNames="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium"
        slotLabelClassNames="text-gray-600 dark:text-gray-400 text-sm"
        themeSystem="standard"
      />
    </div>
  );
};

export default Calendar;