import React from 'react';
import { ArrowLeft, Calendar, Clock, User, Target, CheckCircle, ArrowRight, FileText } from 'lucide-react';
import { Session } from '../types';

interface SessionDetailProps {
  session: Session;
  onBack: () => void;
}

const SessionDetail: React.FC<SessionDetailProps> = ({ session, onBack }) => {
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
          {session.notes && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="mr-2" size={20} />
                Session Notes
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{session.notes}</p>
              </div>
            </div>
          )}

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
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                    Mark Complete
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
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