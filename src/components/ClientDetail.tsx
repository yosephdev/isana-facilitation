import React from 'react';
import { ArrowLeft, Phone, Mail, Calendar, FileText, User, Target, Heart, Clock } from 'lucide-react';
import { Client, Session } from '../types';
import { mockSessions } from '../data/mockData';

interface ClientDetailProps {
  client: Client;
  onBack: () => void;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ client, onBack }) => {
  const clientSessions = mockSessions.filter(session => session.clientId === client.id);
  const recentSessions = clientSessions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

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
                  {session.notes && (
                    <p className="text-sm text-gray-700 line-clamp-2">{session.notes}</p>
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