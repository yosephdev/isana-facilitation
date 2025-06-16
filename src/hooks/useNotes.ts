import { useState, useCallback } from 'react';
import { notesService } from '../services/notesService';
import { SessionNotes, Session } from '../types';

export const useNotes = (sessionId: string) => {
  const [notes, setNotes] = useState<SessionNotes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await notesService.getNotes(sessionId);
      if (response.success) {
        setNotes(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const saveNotes = async (notesToSave: SessionNotes) => {
    setIsSaving(true);
    setError(null);
    
    try {
      const response = await notesService.saveNotes(sessionId, notesToSave);
      if (response.success) {
        setNotes(response.data);
        setLastSaved(new Date());
        return { success: true };
      } else {
        setError(response.message);
        return { success: false, message: response.message };
      }
    } catch (err) {
      const message = 'Failed to save notes';
      setError(message);
      return { success: false, message };
    } finally {
      setIsSaving(false);
    }
  };

  const autoSave = useCallback((notesToSave: SessionNotes) => {
    notesService.autoSaveNotes(sessionId, notesToSave, (success) => {
      if (success) {
        setLastSaved(new Date());
        setNotes(notesToSave);
      }
    });
  }, [sessionId]);

  const exportToPDF = async (session: Session) => {
    if (!notes) return { success: false, message: 'No notes to export' };
    
    setIsLoading(true);
    try {
      const response = await notesService.exportToPDF(session, notes);
      if (response.success) {
        // Trigger download
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `session-notes-${session.clientName}-${session.date}.pdf`;
        link.click();
        return { success: true };
      }
      return { success: false, message: response.message };
    } catch (err) {
      return { success: false, message: 'Failed to export PDF' };
    } finally {
      setIsLoading(false);
    }
  };

  const getTemplate = async (sessionType: Session['type']) => {
    try {
      const response = await notesService.getNotesTemplate(sessionType);
      return response.success ? response.data : null;
    } catch (err) {
      return null;
    }
  };

  const updateNotes = (updates: Partial<SessionNotes>) => {
    if (notes) {
      const updatedNotes = { ...notes, ...updates };
      setNotes(updatedNotes);
      autoSave(updatedNotes);
    }
  };

  const cancelAutoSave = () => {
    notesService.cancelAutoSave();
  };

  return {
    notes,
    isLoading,
    isSaving,
    lastSaved,
    error,
    loadNotes,
    saveNotes,
    autoSave,
    exportToPDF,
    getTemplate,
    updateNotes,
    cancelAutoSave
  };
};