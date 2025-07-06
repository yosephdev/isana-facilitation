import { ApiResponse, Document } from '../types';

class DocumentService {
  private documents: Document[] = []; // Mock storage

  constructor() {
    // Load mock documents from localStorage if available
    if (typeof window !== 'undefined') {
      const storedDocs = localStorage.getItem('mockDocuments');
      if (storedDocs) {
        this.documents = JSON.parse(storedDocs);
      }
    }
  }

  private saveToLocalStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockDocuments', JSON.stringify(this.documents));
    }
  }

  async uploadDocument(file: File, associatedClientIds: string[] = [], associatedSessionIds: string[] = []): Promise<ApiResponse<Document>> {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    const newDocument: Document = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file), // Mock URL
      fileType: file.type,
      fileSize: file.size,
      uploadedBy: 'mock-user-id', // Replace with actual user ID
      associatedClientIds,
      associatedSessionIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.documents.push(newDocument);
    this.saveToLocalStorage();

    return {
      success: true,
      message: 'Document uploaded successfully',
      data: newDocument,
    };
  }

  async getDocuments(clientId?: string, sessionId?: string): Promise<ApiResponse<Document[]>> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    let filteredDocs = this.documents;

    if (clientId) {
      filteredDocs = filteredDocs.filter(doc => doc.associatedClientIds?.includes(clientId));
    }
    if (sessionId) {
      filteredDocs = filteredDocs.filter(doc => doc.associatedSessionIds?.includes(sessionId));
    }

    return {
      success: true,
      message: 'Documents retrieved successfully',
      data: filteredDocs,
    };
  }

  async deleteDocument(id: string): Promise<ApiResponse<boolean>> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const initialLength = this.documents.length;
    this.documents = this.documents.filter(doc => doc.id !== id);
    this.saveToLocalStorage();

    if (this.documents.length < initialLength) {
      return { success: true, message: 'Document deleted successfully', data: true };
    } else {
      return { success: false, message: 'Document not found', data: false };
    }
  }
}

export const documentService = new DocumentService();