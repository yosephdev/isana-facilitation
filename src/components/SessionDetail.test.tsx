import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SessionDetail from './SessionDetail';
import { useAppStore } from '../store/useAppStore';
import { documentService } from '../services/documentService';
import { useNotes } from '../hooks/useNotes';
import { Session, Document } from '../types';

// Mock dependencies
vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

vi.mock('../services/documentService', () => ({
  documentService: {
    uploadDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

vi.mock('../hooks/useNotes', () => ({
  useNotes: vi.fn(),
}));

describe('SessionDetail', () => {
  const mockSession: Session = {
    id: 'session-1',
    clientId: 'client-1',
    clientName: 'John Doe',
    date: '2025-07-08',
    startTime: '10:00',
    endTime: '11:00',
    type: 'individual',
    status: 'scheduled',
    objectives: ['Discuss progress'],
    outcomes: [],
    nextSteps: [],
    mood: 'neutral',
    meta: { duration: 60, location: 'online', sessionNumber: 1 },
    createdAt: '2025-07-01T00:00:00Z',
    updatedAt: '2025-07-01T00:00:00Z',
  };

  const mockDocuments: Document[] = [
    {
      id: 'doc-s1',
      name: 'Session Plan.pdf',
      url: 'http://example.com/session-plan.pdf',
      fileType: 'application/pdf',
      fileSize: 1024 * 50, // 50KB
      uploadedBy: 'therapist-1',
      associatedSessionIds: ['session-1'],
      createdAt: '2025-07-07T00:00:00Z',
      updatedAt: '2025-07-07T00:00:00Z',
    },
  ];

  const mockAddDocument = vi.fn();
  const mockRemoveDocument = vi.fn();
  const mockGetDocumentsBySessionId = vi.fn(() => mockDocuments);
  const mockLoadNotes = vi.fn();
  const mockUpdateNotes = vi.fn();
  const mockExportToPDF = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.mockReturnValue({
      getDocumentsBySessionId: mockGetDocumentsBySessionId,
      addDocument: mockAddDocument,
      removeDocument: mockRemoveDocument,
    });
    useNotes.mockReturnValue({
      notes: { content: 'Mock notes content' },
      isSaving: false,
      lastSaved: new Date(),
      loadNotes: mockLoadNotes,
      updateNotes: mockUpdateNotes,
      exportToPDF: mockExportToPDF,
    });
    // Mock URL.createObjectURL for File objects
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: vi.fn(() => 'blob:mock-url'),
    });
  });

  it('renders session details and document section', () => {
    render(<SessionDetail session={mockSession} onBack={vi.fn()} />);

    expect(screen.getByText('Session Details')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByText('Session Plan.pdf')).toBeInTheDocument();
  });

  it('handles document upload', async () => {
    const file = new File(['file content'], 'new-session-doc.txt', { type: 'text/plain' });
    documentService.uploadDocument.mockResolvedValueOnce({ success: true, data: { id: 'new-doc-s', name: file.name, url: 'mock-url', fileType: file.type, fileSize: file.size, uploadedBy: 'test', createdAt: '', updatedAt: '', associatedSessionIds: [mockSession.id] } });

    render(<SessionDetail session={mockSession} onBack={vi.fn()} />);

    const fileInput = screen.getByLabelText('Upload document');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(documentService.uploadDocument).toHaveBeenCalledWith(file, [], [mockSession.id]);
      expect(mockAddDocument).toHaveBeenCalledTimes(1);
    });
  });

  it('handles document deletion', async () => {
    window.confirm = vi.fn(() => true); // Mock window.confirm dialog
    documentService.deleteDocument.mockResolvedValueOnce({ success: true, data: true });

    render(<SessionDetail session={mockSession} onBack={vi.fn()} />);

    const deleteButtons = screen.getAllByTitle('Delete Document');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(documentService.deleteDocument).toHaveBeenCalledWith('doc-s1');
      expect(mockRemoveDocument).toHaveBeenCalledWith('doc-s1');
    });
  });
});