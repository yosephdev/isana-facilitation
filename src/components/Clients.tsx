import React, { useState } from 'react';
import { Search, Plus, Phone, Mail, Calendar, FileText, Filter, MoreVertical } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { ClientProfile } from '../types';
import Modal from './ui/Modal';
import AddClientModal from './AddClientModal';

interface ClientsProps {
  onClientSelect: (client: ClientProfile) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-yellow-100 text-yellow-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const ClientCard: React.FC<{ client: ClientProfile; onClientSelect: (client: ClientProfile) => void }> = ({ client, onClientSelect }) => (
  <div 
    onClick={() => onClientSelect(client)}
    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-200 cursor-pointer"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {client.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
          <p className="text-sm text-gray-600">{client.diagnosis || 'No diagnosis listed'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
          {client.status}
        </span>
        <button className="p-1 hover:bg-gray-100 rounded">
          <MoreVertical size={16} className="text-gray-400" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-4">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Mail size={14} />
        <span>{client.email}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Phone size={14} />
        <span>{client.phone}</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Calendar size={14} />
        <span>{client.totalSessions} sessions</span>
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <FileText size={14} />
        <span>Last: {client.lastSession ? new Date(client.lastSession).toLocaleDateString() : 'N/A'}</span>
      </div>
    </div>

    {client.goals.length > 0 && (
      <div className="border-t pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Treatment Goals:</p>
        <div className="flex flex-wrap gap-1">
          {client.goals.slice(0, 3).map((goal, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full">
              {goal}
            </span>
          ))}
          {client.goals.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
              +{client.goals.length - 3} more
            </span>
          )}
        </div>
      </div>
    )}
  </div>
);

const Clients: React.FC<ClientsProps> = ({ onClientSelect }) => {
  const { clients, addClient, isLoading, error } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddClient, setShowAddClient] = useState(false);

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-600">Manage your client relationships and treatment plans</p>
        </div>
        <button 
          onClick={() => setShowAddClient(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <Plus size={20} />
          <span>Add Client</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search clients by name or email..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-600">Total Clients</p>
          <p className="text-2xl font-bold text-blue-900">{clients.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm font-medium text-green-600">Active</p>
          <p className="text-2xl font-bold text-green-900">
            {clients.filter(c => c.status === 'active').length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm font-medium text-yellow-600">Inactive</p>
          <p className="text-2xl font-bold text-yellow-900">
            {clients.filter(c => c.status === 'inactive').length}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-600">Completed</p>
          <p className="text-2xl font-bold text-purple-900">
            {clients.filter(c => c.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <ClientCard key={client.id} client={client} onClientSelect={onClientSelect} />
        ))}
      </div>

      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </div>
      )}

      {showAddClient && (
        <AddClientModal onClose={() => setShowAddClient(false)} />
      )}
    </div>
  );
};

export default Clients;