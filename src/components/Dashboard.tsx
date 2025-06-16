import React from 'react';
import { Users, Calendar, TrendingUp, Clock, Award, Activity } from 'lucide-react';
import { mockClients, mockSessions } from '../data/mockData';
import { DashboardStats } from '../types';

const Dashboard: React.FC = () => {
  // Calculate dashboard statistics
  const stats: DashboardStats = {
    totalClients: mockClients.length,
    activeClients: mockClients.filter(client => client.status === 'active').length,
    sessionsThisWeek: mockSessions.filter(session => {
      const sessionDate = new Date(session.date);
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      return sessionDate >= startOfWeek;
    }).length,
    upcomingSessions: mockSessions.filter(session => session.status === 'scheduled').length,
    completionRate: Math.round((mockSessions.filter(session => session.status === 'completed').length / mockSessions.length) * 100),
    averageSessionsPerClient: Math.round(mockClients.reduce((sum, client) => sum + client.totalSessions, 0) / mockClients.length)
  };

  const upcomingSessions = mockSessions
    .filter(session => session.status === 'scheduled')
    .sort((a, b) => new Date(a.date + ' ' + a.startTime).getTime() - new Date(b.date + ' ' + b.startTime).getTime())
    .slice(0, 5);

  const recentClients = mockClients
    .filter(client => client.status === 'active')
    .sort((a, b) => new Date(b.lastSession || '').getTime() - new Date(a.lastSession || '').getTime())
    .slice(0, 4);

  const StatCard: React.FC<{ icon: React.ElementType; title: string; value: string | number; subtitle: string; color: string }> = 
    ({ icon: Icon, title, value, subtitle, color }) => (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Dr. Smith. Here's what's happening with your practice today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          title="Total Clients"
          value={stats.totalClients}
          subtitle={`${stats.activeClients} active`}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={Calendar}
          title="Sessions This Week"
          value={stats.sessionsThisWeek}
          subtitle={`${stats.upcomingSessions} upcoming`}
          color="bg-gradient-to-br from-teal-500 to-teal-600"
        />
        <StatCard
          icon={TrendingUp}
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          subtitle="This month"
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          icon={Award}
          title="Avg Sessions/Client"
          value={stats.averageSessionsPerClient}
          subtitle="All time"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          icon={Activity}
          title="Practice Health"
          value="Excellent"
          subtitle="92% efficiency"
          color="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          icon={Clock}
          title="Available Hours"
          value="24"
          subtitle="This week"
          color="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="mr-2" size={20} />
              Upcoming Sessions
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-semibold text-gray-900">{session.clientName}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(session.date).toLocaleDateString()} at {session.startTime}
                  </p>
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                    {session.type}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-teal-600">Scheduled</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Users className="mr-2" size={20} />
              Recent Active Clients
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {recentClients.map((client) => (
              <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {client.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-600">
                      {client.totalSessions} sessions • Last: {client.lastSession ? new Date(client.lastSession).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Add New Client</p>
                <p className="text-sm text-gray-600">Create a new client profile</p>
              </div>
            </div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Calendar size={20} className="text-teal-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Schedule Session</p>
                <p className="text-sm text-gray-600">Book a new appointment</p>
              </div>
            </div>
          </button>
          <button className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">View Reports</p>
                <p className="text-sm text-gray-600">Practice analytics</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;