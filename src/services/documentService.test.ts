import { describe, it, expect, beforeEach, vi } from 'vitest';
import { documentService } from './documentService';
import { Document } from '../types';

describe('DocumentService', () => {
  const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

  // Mock URL.createObjectURL
  beforeAll(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: vi.fn(() => 'blob:mock-url'),
    });
  });

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset the documents array in the service
    (documentService as any).documents = [];
    vi.clearAllMocks();
  });

  it('should upload a document successfully', async () => {
    const clientId = 'client-1';
    const response = await documentService.uploadDocument(mockFile, [clientId]);

    expect(response.success).toBe(true);
    expect(response.data).toBeDefined();
    expect(response.data?.name).toBe('test.pdf');
    expect(response.data?.associatedClientIds).toEqual([clientId]);

    const retrievedDocs = await documentService.getDocuments(clientId);
    expect(retrievedDocs.data?.length).toBe(1);
    expect(retrievedDocs.data?.[0].name).toBe('test.pdf');
  });

  it('should retrieve documents by client ID', async () => {
    const clientId1 = 'client-a';
    const clientId2 = 'client-b';

    await documentService.uploadDocument(mockFile, [clientId1]);
    await documentService.uploadDocument(mockFile, [clientId1, clientId2]);
    await documentService.uploadDocument(mockFile, [clientId2]);

    const docsClient1 = await documentService.getDocuments(clientId1);
    expect(docsClient1.data?.length).toBe(2);

    const docsClient2 = await documentService.getDocuments(clientId2);
    expect(docsClient2.data?.length).toBe(2);
  });

  it('should retrieve documents by session ID', async () => {
    const sessionId1 = 'session-x';
    const sessionId2 = 'session-y';

    await documentService.uploadDocument(mockFile, [], [sessionId1]);
    await documentService.uploadDocument(mockFile, [], [sessionId1, sessionId2]);
    await documentService.uploadDocument(mockFile, [], [sessionId2]);

    const docsSession1 = await documentService.getDocuments(undefined, sessionId1);
    expect(docsSession1.data?.length).toBe(2);

    const docsSession2 = await documentService.getDocuments(undefined, sessionId2);
    expect(docsSession2.data?.length).toBe(2);
  });

  it('should delete a document successfully', async () => {
    const responseUpload = await documentService.uploadDocument(mockFile);
    const docId = responseUpload.data?.id as string;

    const responseDelete = await documentService.deleteDocument(docId);
    expect(responseDelete.success).toBe(true);
    expect(responseDelete.data).toBe(true);

    const retrievedDocs = await documentService.getDocuments();
    expect(retrievedDocs.data?.length).toBe(0);
  });

  it('should return false if document to delete is not found', async () => {
    const response = await documentService.deleteDocument('non-existent-id');
    expect(response.success).toBe(false);
    expect(response.data).toBe(false);
  });
});