import { SessionNotes, Session, ApiResponse } from '../types';

class NotesService {
  private autoSaveTimeout: NodeJS.Timeout | null = null;
  private readonly AUTO_SAVE_DELAY = 2000; // 2 seconds

  async saveNotes(sessionId: string, notes: SessionNotes): Promise<ApiResponse<SessionNotes>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock save to localStorage for demo
    const storageKey = `session-notes-${sessionId}`;
    localStorage.setItem(storageKey, JSON.stringify(notes));

    return {
      success: true,
      message: 'Notes saved successfully',
      data: notes
    };
  }

  async getNotes(sessionId: string): Promise<ApiResponse<SessionNotes | null>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const storageKey = `session-notes-${sessionId}`;
    const notesStr = localStorage.getItem(storageKey);
    
    if (!notesStr) {
      return {
        success: true,
        message: 'No notes found',
        data: null
      };
    }

    try {
      const notes = JSON.parse(notesStr);
      return {
        success: true,
        message: 'Notes retrieved successfully',
        data: notes
      };
    } catch {
      return {
        success: false,
        message: 'Error parsing notes',
        data: null
      };
    }
  }

  autoSaveNotes(sessionId: string, notes: SessionNotes, callback?: (success: boolean) => void): void {
    // Clear existing timeout
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }

    // Set new timeout for auto-save
    this.autoSaveTimeout = setTimeout(async () => {
      try {
        await this.saveNotes(sessionId, notes);
        callback?.(true);
      } catch {
        callback?.(false);
      }
    }, this.AUTO_SAVE_DELAY);
  }

  async exportToPDF(session: Session, notes: SessionNotes): Promise<ApiResponse<{ downloadUrl: string }>> {
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock PDF generation - in real app, this would call a PDF service
    const mockPdfUrl = `data:application/pdf;base64,mock-pdf-content-${session.id}`;

    return {
      success: true,
      message: 'PDF generated successfully',
      data: { downloadUrl: mockPdfUrl }
    };
  }

  async getNotesTemplate(sessionType: Session['type']): Promise<ApiResponse<Partial<SessionNotes>>> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));

    const templates: Record<Session['type'], Partial<SessionNotes>> = {
      individual: {
        presentingConcerns: '',
        interventions: ['Active listening', 'Cognitive restructuring'],
        clientResponse: '',
        homework: [],
        riskAssessment: 'low',
        nextSessionPlan: '',
        privateNotes: ''
      },
      group: {
        presentingConcerns: 'Group dynamics and individual progress',
        interventions: ['Group discussion', 'Peer support', 'Skill building'],
        clientResponse: '',
        homework: ['Practice skills discussed in group'],
        riskAssessment: 'low',
        nextSessionPlan: 'Continue group participation',
        privateNotes: ''
      },
      family: {
        presentingConcerns: 'Family system dynamics',
        interventions: ['Family therapy techniques', 'Communication skills'],
        clientResponse: '',
        homework: ['Family communication exercises'],
        riskAssessment: 'low',
        nextSessionPlan: 'Continue family work',
        privateNotes: ''
      },
      consultation: {
        presentingConcerns: 'Professional consultation',
        interventions: ['Assessment', 'Recommendations'],
        clientResponse: '',
        homework: [],
        riskAssessment: 'low',
        nextSessionPlan: 'Follow-up as needed',
        privateNotes: ''
      },
      intake: {
        presentingConcerns: 'Initial assessment and intake',
        interventions: ['Clinical interview', 'Assessment tools'],
        clientResponse: '',
        homework: ['Complete intake forms'],
        riskAssessment: 'low',
        nextSessionPlan: 'Begin treatment planning',
        privateNotes: ''
      }
    };

    return {
      success: true,
      message: 'Template retrieved successfully',
      data: templates[sessionType]
    };
  }

  async searchNotes(query: string, sessionIds?: string[]): Promise<ApiResponse<{ sessionId: string; matches: string[] }[]>> {
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock search results
    const mockResults = [
      {
        sessionId: '3',
        matches: ['anxiety management', 'breathing techniques']
      },
      {
        sessionId: '4',
        matches: ['career transitions', 'communication skills']
      }
    ];

    return {
      success: true,
      message: 'Search completed',
      data: mockResults
    };
  }

  cancelAutoSave(): void {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
      this.autoSaveTimeout = null;
    }
  }
}

export const notesService = new NotesService();