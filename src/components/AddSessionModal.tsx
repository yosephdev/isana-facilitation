import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Session } from '../types';
import Modal from './ui/Modal';

interface AddSessionModalProps {
  onClose: () => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({ onClose }) => {
  const { addSession, isLoading, error, clients } = useAppStore();
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [type, setType] = useState<Session['type']>('individual');
  const [objectives, setObjectives] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find(c => c.id === clientId);
    if (!client) {
      alert('Please select a valid client.');
      return;
    }

    const newSession: Omit<Session, 'id' | 'createdAt' | 'updatedAt'> = {
      clientId,
      clientName: client.name,
      date,
      startTime,
      endTime,
      type,
      status: 'scheduled',
      objectives: objectives.split(',').map(o => o.trim()).filter(o => o !== ''),
      outcomes: [],
      nextSteps: [],
      mood: 'neutral',
      meta: {
        duration: 0,
        location,
        sessionNumber: 0,
      },
    };
    await addSession(newSession);
    onClose();
  };

  return (
    <Modal title="Schedule New Session" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Client</label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="">Select a client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>{client.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Session Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as Session['type'])} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
            <option value="individual">Individual</option>
            <option value="group">Group</option>
            <option value="family">Family</option>
            <option value="consultation">Consultation</option>
            <option value="intake">Intake</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Objectives (comma-separated)</label>
          <input type="text" value={objectives} onChange={(e) => setObjectives(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">{isLoading ? 'Scheduling...' : 'Schedule Session'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddSessionModal;