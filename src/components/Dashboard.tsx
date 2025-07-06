import React, { lazy, Suspense } from 'react';
import { Users, Calendar, TrendingUp, Clock, Award, Activity, Bell, FolderSync as Sync } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { DashboardStats } from '../types';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

// Lazy load heavy components
const SessionChart = lazy(() => import('../components/analytics/SessionChart'));
const LazyCalendar = lazy(() => import('../components/calendar/Calendar'));

const Dashboard: React.FC = () => {
  const { clients, sessions, reminders, getUpcomingSessions, getActiveClients, getTodaysSessions, darkMode } = useAppStore();

  // Calculate dashboard statistics
  const stats: DashboardStats = {
    totalClients: clients.length,
    activeClients: getActiveClients().length,
    sessionsThisWeek: sessions.filter(session => {
      const sessionDate = new Date(session.date);
      const today = new Date();
      const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
      return sessionDate >= startOfWeek && session.status === 'completed';
    }).length,
    upcomingSessions: getUpcomingSessions().length,
    completionRate: Math.round((sessions.filter(session => session.status === 'completed').length / sessions.length) * 100) || 0,
    averageSessionsPerClient: Math.round(clients.reduce((sum, client) => sum + client.totalSessions, 0) / clients.length) || 0,
    revenueThisMonth: 12450, // Mock data
    cancelledSessions: sessions.filter(s => s.status === 'cancelled').length
  };

  const upcomingSessions = getUpcomingSessions().slice(0, 5);
  const todaysSessions = getTodaysSessions();
  const activeReminders = reminders.filter(r => !r.isCompleted).slice(0, 4);

  const StatCard: React.FC<{ 
    icon: React.ElementType; 
    title: string; 
    value: string | number; 
    subtitle: string; 
    color: string;
    trend?: { value: number; isPositive: boolean };
  }> = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <div className="flex items-center mt-1 space-x-2">
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
            {trend && (
              <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, Dr. Smith. Here's what's happening with your practice today.</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Sync size={16} />
            <span>Sync Calendar</span>
          </button>
          <div className="relative">
            <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Bell size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            {activeReminders.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {activeReminders.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Clients"
          value={stats.totalClients}
          subtitle={`${stats.activeClients} active`}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          icon={Calendar}
          title="Sessions This Week"
          value={stats.sessionsThisWeek}
          subtitle={`${stats.upcomingSessions} upcoming`}
          color="bg-gradient-to-br from-teal-500 to-teal-600"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          icon={TrendingUp}
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          subtitle="This month"
          color="bg-gradient-to-br from-green-500 to-green-600"
          trend={{ value: 3, isPositive: true }}
        />
        <StatCard
          icon={Award}
          title="Revenue"
          value={`${stats.revenueThisMonth.toLocaleString()}`}
          subtitle="This month"
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Today's Overview */}
      {todaysSessions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="mr-2" size={20} />
            Today's Sessions ({todaysSessions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todaysSessions.map((session) => (
              <div key={session.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900 dark:text-white">{session.clientName}</p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    session.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                    session.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                  }`}>
                    {session.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{session.startTime} - {session.endTime}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 capitalize">{session.type} session</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Analytics Chart */}
        <div className="xl:col-span-2">
          <Suspense fallback={<LoadingSkeleton variant="card" className="h-80" />}>
            <SessionChart type="bar" period="month" height={320} />
          </Suspense>
        </div>

        {/* Reminders & Quick Actions */}
        <div className="space-y-6">
          {/* Active Reminders */}
          {activeReminders.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Bell className="mr-2" size={20} />
                  Reminders ({activeReminders.length})
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {activeReminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-100 dark:border-yellow-800">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      reminder.priority === 'high' ? 'bg-red-500' :
                      reminder.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <p className="font-medium text-gray-900 dark:text-white">{reminder.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{reminder.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Due: {new Date(reminder.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Users size={18} />
                <span>Add New Client</span>
              </button>
              <button className="w-full bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <Calendar size={18} />
                <span>Schedule Session</span>
              </button>
              <button className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <TrendingUp size={18} />
                <span>View Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Calendar className="mr-2" size={20} />
              Upcoming Sessions
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-900 dark:text-white">{session.clientName}</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      session.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                      session.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(session.date).toLocaleDateString()} at {session.startTime}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 dark:text-green-400">Scheduled</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Preview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Calendar Overview</h2>
        </div>
        <div className="p-6">
          <Suspense fallback={<LoadingSkeleton variant="card" className="h-96" />}>
            <LazyCalendar height="400px" />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;