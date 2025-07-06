import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { ClientProfile } from '../types';
import Modal from './ui/Modal';

interface AddClientModalProps {
  onClose: () => void;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose }) => {
  const { addClient, isLoading, error } = useAppStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [goals, setGoals] = useState<string>('');
  const [preferredTime, setPreferredTime] = useState('');
  const [communicationMethod, setCommunicationMethod] = useState('email');
  const [sessionType, setSessionType] = useState('in-person');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newClient: Omit<ClientProfile, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      email,
      phone,
      dateOfBirth,
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relationship: emergencyContactRelationship,
      },
      notes: '',
      status: 'active',
      totalSessions: 0,
      diagnosis,
      goals: goals.split(',').map(g => g.trim()).filter(g => g !== ''),
      preferences: {
        preferredTime,
        communicationMethod: communicationMethod as 'email' | 'phone' | 'text',
        sessionType: sessionType as 'in-person' | 'virtual' | 'hybrid',
      },
    };
    await addClient(newClient);
    onClose();
  };

  return (
    <Modal title="Add New Client" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold text-gray-900">Emergency Contact</legend>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" value={emergencyContactName} onChange={(e) => setEmergencyContactName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="tel" value={emergencyContactPhone} onChange={(e) => setEmergencyContactPhone(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Relationship</label>
            <input type="text" value={emergencyContactRelationship} onChange={(e) => setEmergencyContactRelationship(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
        </fieldset>
        <div>
          <label className="block text-sm font-medium text-gray-700">Diagnosis (Optional)</label>
          <input type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Goals (comma-separated)</label>
          <input type="text" value={goals} onChange={(e) => setGoals(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
        </div>
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold text-gray-900">Preferences</legend>
          <div>
            <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
            <input type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Communication Method</label>
            <select value={communicationMethod} onChange={(e) => setCommunicationMethod(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="text">Text</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Session Type</label>
            <select value={sessionType} onChange={(e) => setSessionType(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
              <option value="in-person">In-person</option>
              <option value="virtual">Virtual</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </fieldset>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">{isLoading ? 'Adding...' : 'Add Client'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default AddClientModal;
