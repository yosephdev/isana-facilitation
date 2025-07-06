import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotes } from './useNotes';
import { notesService } from '../services/notesService';
import { SessionNotes } from '../types';

// Mock notesService
vi.mock('../services/notesService', () => ({
  notesService: {
    getNotes: vi.fn(),
    saveNotes: vi.fn(),
    autoSaveNotes: vi.fn((sessionId, notes, callback) => {
      // Simulate async auto-save
      setTimeout(() => {
        callback(true);
      }, 100);
    }),
    exportToPDF: vi.fn(),
    cancelAutoSave: vi.fn(),
    getNotesTemplate: vi.fn(),
    searchNotes: vi.fn(),
  },
}));

describe('useNotes', () => {
  const mockSessionId = 'session-123';
  const mockInitialNotes: SessionNotes = {
    presentingConcerns: 'Initial concerns',
    interventions: [],
    clientResponse: '',
    homework: [],
    riskAssessment: 'low',
    nextSessionPlan: '',
    privateNotes: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load notes successfully', async () => {
    notesService.getNotes.mockResolvedValueOnce({ success: true, data: mockInitialNotes });

    const { result } = renderHook(() => useNotes(mockSessionId));

    // isLoading should be true immediately after loadNotes is called
    act(() => {
      result.current.loadNotes();
    });
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.notes).toEqual(mockInitialNotes);
    });
    expect(notesService.getNotes).toHaveBeenCalledWith(mockSessionId);
  });

  it('should handle notes loading error', async () => {
    notesService.getNotes.mockResolvedValueOnce({ success: false, message: 'Failed to fetch' });

    const { result } = renderHook(() => useNotes(mockSessionId));

    act(() => {
      result.current.loadNotes();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Failed to fetch');
    });
    expect(result.current.notes).toBeNull();
  });

  it('should save notes successfully', async () => {
    const updatedNotes = { ...mockInitialNotes, presentingConcerns: 'Updated concerns' };
    notesService.saveNotes.mockResolvedValueOnce({ success: true, data: updatedNotes });

    const { result } = renderHook(() => useNotes(mockSessionId));

    await act(async () => {
      await result.current.saveNotes(updatedNotes);
    });

    expect(result.current.isSaving).toBe(false);
    expect(result.current.notes).toEqual(updatedNotes);
    expect(result.current.lastSaved).toBeInstanceOf(Date);
    expect(notesService.saveNotes).toHaveBeenCalledWith(mockSessionId, updatedNotes);
  });

  it('should auto-save notes when updateNotes is called', async () => {
    notesService.getNotes.mockResolvedValueOnce({ success: true, data: mockInitialNotes });
    const { result } = renderHook(() => useNotes(mockSessionId));

    await act(async () => {
      await result.current.loadNotes(); // Load initial notes first
    });

    const newContent = 'New notes content';
    const updatedNotes = { ...mockInitialNotes, content: newContent };

    act(() => {
      result.current.updateNotes({ content: newContent });
    });

    await waitFor(() => {
      expect(result.current.notes?.content).toBe(newContent);
      expect(result.current.lastSaved).toBeInstanceOf(Date);
    });
    expect(notesService.autoSaveNotes).toHaveBeenCalledWith(mockSessionId, updatedNotes, expect.any(Function));
  });

  it('should export notes to PDF successfully', async () => {
    notesService.getNotes.mockResolvedValueOnce({ success: true, data: mockInitialNotes });
    notesService.exportToPDF.mockResolvedValueOnce({ success: true, data: { downloadUrl: 'mock-url' } });

    const mockSession = { id: mockSessionId, clientName: 'Test Client', date: '2023-01-01' };

    const { result } = renderHook(() => useNotes(mockSessionId));

    await act(async () => {
      await result.current.loadNotes(); // Load initial notes first
    });

    let successResult: any;
    await act(async () => {
      successResult = await result.current.exportToPDF(mockSession as any);
    });

    expect(successResult.success).toBe(true);
    expect(notesService.exportToPDF).toHaveBeenCalledWith(mockSession, mockInitialNotes);
  });
});