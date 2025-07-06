import React, { useState } from 'react';
import { Calendar, Clock, User, Plus, Filter, Search, MoreVertical } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Session } from '../types';
import AddSessionModal from './AddSessionModal';

interface SessionsProps {
  onSessionSelect: (session: Session) => void;
}

const Sessions: React.FC<SessionsProps> = ({ onSessionSelect }) => {
  const { sessions, isLoading, error } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAddSession, setShowAddSession] = useState(false);

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || session.status === statusFilter;
    const matchesType = typeFilter === 'all' || session.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

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

  const SessionCard: React.FC<{ session: Session }> = ({ session }) => (
    <div 
      onClick={() => onSessionSelect(session)}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{session.clientName}</h3>
          <p className="text-sm text-gray-600 capitalize">{session.type} session</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(session.status)}`}>
            {session.status}
          </span>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar size={14} />
          <span>{new Date(session.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock size={14} />
          <span>{session.startTime} - {session.endTime}</span>
        </div>
      </div>

      {session.status === 'completed' && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-700">Session Mood:</p>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getMoodColor(session.mood)}`}></div>
              <span className="text-sm text-gray-600 capitalize">{session.mood}</span>
            </div>
          </div>
          {session.notes && typeof session.notes === 'object' && session.notes.presentingConcerns && (
            <p className="text-sm text-gray-600 line-clamp-2">{session.notes.presentingConcerns}</p>
          )}
          {session.notes && typeof session.notes === 'string' && (
            <p className="text-sm text-gray-600 line-clamp-2">{session.notes}</p>
          )}
        </div>
      )}

      {session.objectives.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Session Objectives:</p>
          <div className="flex flex-wrap gap-1">
            {session.objectives.slice(0, 2).map((objective, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-teal-50 text-teal-700 rounded-full">
                {objective}
              </span>
            ))}
            {session.objectives.length > 2 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                +{session.objectives.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const upcomingSessions = filteredSessions.filter(s => s.status === 'scheduled').length;
  const completedSessions = filteredSessions.filter(s => s.status === 'completed').length;
  const cancelledSessions = filteredSessions.filter(s => s.status === 'cancelled').length;

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-600">Manage and track your therapy sessions</p>
        </div>
        <button 
          onClick={() => setShowAddSession(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sessions by client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="individual">Individual</option>
            <option value="group">Group</option>
            <option value="family">Family</option>
            <option value="consultation">Consultation</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-600">Total Sessions</p>
          <p className="text-2xl font-bold text-blue-900">{sessions.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-medium text-green-600">Upcoming</p>
          <p className="text-2xl font-bold text-green-900">{upcomingSessions}</p>
        </div>
        <div className="bg-teal-50 rounded-lg p-4">
          <p className="text-sm font-medium text-teal-600">Completed</p>
          <p className="text-2xl font-bold text-teal-900">{completedSessions}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4">
          <p className="text-sm font-medium text-orange-600">Cancelled</p>
          <p className="text-2xl font-bold text-orange-900">{cancelledSessions}</p>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSessions
          .sort((a, b) => new Date(b.date + ' ' + b.startTime).getTime() - new Date(a.date + ' ' + a.startTime).getTime())
          .map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}

      {showAddSession && (
        <AddSessionModal onClose={() => setShowAddSession(false)} />
      )}
    </div>
  );
};

export default Sessions;