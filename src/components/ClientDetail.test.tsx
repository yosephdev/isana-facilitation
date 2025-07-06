import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ClientDetail from './ClientDetail';
import { useAppStore } from '../store/useAppStore';
import { documentService } from '../services/documentService';
import { ClientProfile, Document } from '../types';

// Mock useAppStore and documentService
vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

vi.mock('../services/documentService', () => ({
  documentService: {
    uploadDocument: vi.fn(),
    deleteDocument: vi.fn(),
  },
}));

describe('ClientDetail', () => {
  const mockClient: ClientProfile = {
    id: 'client-1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    dateOfBirth: '1990-01-01',
    emergencyContact: { name: 'Jane Doe', phone: '098-765-4321', relationship: 'Sister' },
    notes: 'Some client notes.',
    status: 'active',
    totalSessions: 10,
    goals: ['Reduce anxiety', 'Improve communication'],
    preferences: { preferredTime: 'morning', communicationMethod: 'email', sessionType: 'virtual' },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockDocuments: Document[] = [
    {
      id: 'doc-1',
      name: 'Consent Form.pdf',
      url: 'http://example.com/consent.pdf',
      fileType: 'application/pdf',
      fileSize: 1024 * 100, // 100KB
      uploadedBy: 'therapist-1',
      associatedClientIds: ['client-1'],
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'doc-2',
      name: 'Intake Form.docx',
      url: 'http://example.com/intake.docx',
      fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      fileSize: 1024 * 200, // 200KB
      uploadedBy: 'therapist-1',
      associatedClientIds: ['client-1'],
      createdAt: '2023-01-02T00:00:00Z',
      updatedAt: '2023-01-02T00:00:00Z',
    },
  ];

  const mockAddDocument = vi.fn();
  const mockRemoveDocument = vi.fn();
  const mockGetDocumentsByClientId = vi.fn(() => mockDocuments);

  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.mockReturnValue({
      getDocumentsByClientId: mockGetDocumentsByClientId,
      addDocument: mockAddDocument,
      removeDocument: mockRemoveDocument,
    });
    // Mock URL.createObjectURL for File objects
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: vi.fn(() => 'blob:mock-url'),
    });
  });

  it('renders client details and document section', () => {
    render(<ClientDetail client={mockClient} onBack={vi.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Documents')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Consent Form.pdf (0.10 MB)' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Intake Form.docx (0.20 MB)' })).toBeInTheDocument();
  });

  it('handles document upload', async () => {
    const file = new File(['file content'], 'new-document.txt', { type: 'text/plain' });
    documentService.uploadDocument.mockResolvedValueOnce({ success: true, data: { id: 'new-doc', name: file.name, url: 'mock-url', fileType: file.type, fileSize: file.size, uploadedBy: 'test', createdAt: '', updatedAt: '' } });

    render(<ClientDetail client={mockClient} onBack={vi.fn()} />);

    const fileInput = screen.getByLabelText('Upload document');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(documentService.uploadDocument).toHaveBeenCalledWith(file, [mockClient.id]);
      expect(mockAddDocument).toHaveBeenCalledTimes(1);
    });
  });

  it('handles document deletion', async () => {
    window.confirm = vi.fn(() => true); // Mock confirm dialog
    documentService.deleteDocument.mockResolvedValueOnce({ success: true, data: true });

    render(<ClientDetail client={mockClient} onBack={vi.fn()} />);

    const deleteButtons = screen.getAllByTitle('Delete Document');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(documentService.deleteDocument).toHaveBeenCalledWith('doc-1');
      expect(mockRemoveDocument).toHaveBeenCalledWith('doc-1');
    });
  });
});