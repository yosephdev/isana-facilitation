import React, { useState, useEffect } from 'react';
import { ArrowLeft, Phone, Mail, Calendar, FileText, User, Target, Heart, Clock, UploadCloud, Download, Trash2 } from 'lucide-react';
import { ClientProfile, Session } from '../types';
import { useAppStore } from '../store/useAppStore';
import { documentService } from '../services/documentService';

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ client, onBack }) => {
  const { getDocumentsByClientId, addDocument, removeDocument, sessions } = useAppStore();
  const clientDocuments = getDocumentsByClientId(client.id);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const clientSessions = sessions.filter(session => session.clientId === client.id);
  const recentSessions = clientSessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const response = await documentService.uploadDocument(selectedFile, [client.id]);
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
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
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
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xl">
            {client.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
          <div className="flex items-center space-x-3 mt-1">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(client.status)}`}>
              {client.status}
            </span>
            <span className="text-gray-600">{client.diagnosis || 'No diagnosis listed'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Information */}
        <div className="xl:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{client.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{client.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Date of Birth</p>
                  <p className="font-medium text-gray-900">{new Date(client.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Heart size={18} className="text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Emergency Contact</p>
                  <p className="font-medium text-gray-900">{client.emergencyContact.name}</p>
                  <p className="text-sm text-gray-600">{client.emergencyContact.phone} ({client.emergencyContact.relationship})</p>
                </div>
              </div>
            </div>
          </div>

          {/* Treatment Goals */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="mr-2" size={20} />
              Treatment Goals
            </h2>
            <div className="space-y-3">
              {client.goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">{goal}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="mr-2" size={20} />
              Clinical Notes
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{client.notes}</p>
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
            {clientDocuments.length === 0 ? (
              <p className="text-gray-600 text-sm">No documents uploaded for this client.</p>
            ) : (
              <ul className="space-y-2">
                {clientDocuments.map((doc) => (
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

          {/* Recent Sessions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="mr-2" size={20} />
              Recent Sessions
            </h2>
            <div className="space-y-4">
              {recentSessions.map((session) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {session.startTime} - {session.endTime}
                      </span>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {session.type}
                      </span>
                    </div>
                    {session.status === 'completed' && (
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getMoodColor(session.mood)}`}></div>
                        <span className="text-sm text-gray-600 capitalize">{session.mood}</span>
                      </div>
                    )}
                  </div>
                  {session.notes?.presentingConcerns && (
                    <p className="text-sm text-gray-700 line-clamp-2">{session.notes.presentingConcerns}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Sessions</span>
                <span className="font-semibold text-gray-900">{client.totalSessions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Client Since</span>
                <span className="font-semibold text-gray-900">
                  {new Date(client.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Session</span>
                <span className="font-semibold text-gray-900">
                  {client.lastSession ? new Date(client.lastSession).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                Schedule Session
              </button>
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors">
                Add Note
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                Edit Client
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                View All Sessions
              </button>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Progress</h3>
            <div className="space-y-4">
              {client.goals.map((goal, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{goal}</span>
                    <span className="text-gray-900">{Math.floor(Math.random() * 40 + 60)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;