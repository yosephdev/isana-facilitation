import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, User, Target, CheckCircle, ArrowRight, FileText, UploadCloud, Download, Trash2 } from 'lucide-react';
import { Session } from '../types';
import { useNotes } from '../hooks/useNotes';
import { useAppStore } from '../store/useAppStore';
import { documentService } from '../services/documentService';

interface SessionDetailProps {
  session: Session;
  onBack: () => void;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ session, onBack }) => {
  const { notes, isSaving, lastSaved, loadNotes, updateNotes, exportToPDF } = useNotes(session.id);
  const [editableNotesContent, setEditableNotesContent] = useState<string>('');
  const { getDocumentsBySessionId, addDocument, removeDocument, updateSession, setError } = useAppStore();

  const handleMarkComplete = async (sessionId: string) => {
    try {
      await updateSession(sessionId, { status: 'completed' });
      // Optionally, add a success message or re-fetch data
    } catch (err: any) {
      setError(err.message || 'Failed to mark session complete');
    }
  };

  const handleAddNotes = (sessionId: string) => {
    // For now, this just focuses the notes textarea. 
    // In a real app, you might open a dedicated notes modal or navigate.
    const notesTextarea = document.getElementById('session-notes-textarea');
    if (notesTextarea) {
      notesTextarea.focus();
    }
  };
  const sessionDocuments = getDocumentsBySessionId(session.id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  useEffect(() => {
    if (notes?.content !== undefined) {
      setEditableNotesContent(notes.content);
    } else {
      setEditableNotesContent('');
    }
  }, [notes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setEditableNotesContent(newContent);
    updateNotes({ content: newContent });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const response = await documentService.uploadDocument(selectedFile, [], [session.id]);
      if (response.success) {
        addDocument(response.data);
        setSelectedFile(null);
      } else {
        console.error('Upload failed:', response.message);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await documentService.deleteDocument(documentId);
        if (response.success) {
          removeDocument(documentId);
        } else {
          console.error('Delete failed:', response.message);
        }
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'no-show': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'neutral': return 'bg-gray-400';
      case 'difficult': return 'bg-orange-500';
      case 'concerning': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session Details</h1>
          <p className="text-gray-600">Session with {session.clientName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Session Overview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Session Overview</h2>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(session.status)}`}>
                {session.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3">
                <User size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Client</p>
                  <p className="font-medium text-gray-900">{session.clientName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium text-gray-900">{new Date(session.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Time</p>
                  <p className="font-medium text-gray-900">{session.startTime} - {session.endTime}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FileText size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium text-gray-900 capitalize">{session.type}</p>
                </div>
              </div>
            </div>

            {session.status === 'completed' && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${getMoodColor(session.mood)}`}></div>
                  <div>
                    <p className="text-sm text-gray-600">Session Mood</p>
                    <p className="font-medium text-gray-900 capitalize">{session.mood}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Session Objectives */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="mr-2" size={20} />
              Session Objectives
            </h2>
            <div className="space-y-3">
              {session.objectives.map((objective, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-900">{objective}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Session Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FileText className="mr-2" size={20} />
                Session Notes
              </h2>
              <button
                onClick={() => exportToPDF(session)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Export to PDF
              </button>
            </div>
            <textarea
              className="w-full h-64 p-4 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 leading-relaxed resize-y"
              value={editableNotesContent}
              onChange={handleNotesChange}
              placeholder="Start typing session notes here..."
            ></textarea>
            <div className="text-right text-sm text-gray-500 mt-2">
              {isSaving ? 'Saving...' : lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <UploadCloud className="mr-2" size={20} />
              Documents
            </h2>
            <div className="flex items-center space-x-3 mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                aria-label="Upload document"
                className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              />
              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
            {sessionDocuments.length === 0 ? (
              <p className="text-gray-600 text-sm">No documents uploaded for this session.</p>
            ) : (
              <ul className="space-y-2">
                {sessionDocuments.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText size={20} className="text-gray-500" />
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {doc.name} ({ (doc.fileSize / 1024 / 1024).toFixed(2) } MB)
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(doc.url, '_blank')}
                        className="p-1 rounded-full hover:bg-gray-200 text-gray-600"
                        title="Download Document"
                      >
                        <Download size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="p-1 rounded-full hover:bg-red-100 text-red-600"
                        title="Delete Document"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Outcomes (if completed) */}
          {session.status === 'completed' && session.outcomes.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="mr-2" size={20} />
                Session Outcomes
              </h2>
              <div className="space-y-3">
                {session.outcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-gray-900">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps (if completed) */}
          {session.status === 'completed' && session.nextSteps.length > 0 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ArrowRight className="mr-2" size={20} />
                Next Steps
              </h2>
              <div className="space-y-3">
                {session.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg">
                    <ArrowRight size={16} className="text-teal-600" />
                    <span className="text-gray-900">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {session.status === 'scheduled' && (
                <>
                  <button
                    onClick={() => handleMarkComplete(session.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Mark Complete
                  </button>
                  <button
                    onClick={() => handleAddNotes(session.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Notes
                  </button>
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Reschedule
                  </button>
                  <button className="w-full border border-red-300 hover:bg-red-50 text-red-700 px-4 py-2 rounded-lg transition-colors">
                    Cancel Session
                  </button>
                </>
              )}
              {session.status === 'completed' && (
                <>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Edit Notes
                  </button>
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Schedule Follow-up
                  </button>
                  <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                    Generate Report
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Session Info */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Information</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Session ID</span>
                <span className="font-mono text-gray-900">#{session.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Duration</span>
                <span className="text-gray-900">60 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="text-gray-900 capitalize">{session.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
                  {session.status}
                </span>
              </div>
            </div>
          </div>

          {/* Client Quick Info */}
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {session.clientName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">{session.clientName}</p>
                <p className="text-sm text-gray-600">Active Client</p>
              </div>
            </div>
            <button className="w-full bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-200">
              View Client Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDetail;