import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Reminder } from '../types';
import Modal from './ui/Modal';

interface AddEditReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminder?: Partial<Reminder> | null;
}

const AddEditReminderModal: React.FC<AddEditReminderModalProps> = ({ isOpen, onClose, reminder }) => {
  const { addReminder, updateReminder, isLoading, error } = useAppStore();
  const [currentReminder, setCurrentReminder] = useState<Partial<Reminder>>(() => reminder || {
    clientId: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    isCompleted: false,
    type: 'custom',
  });

  useEffect(() => {
    setCurrentReminder(reminder || {
      clientId: '',
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      isCompleted: false,
      type: 'custom',
    });
  }, [reminder]);

  const handleSaveReminder = async () => {
    if (currentReminder && currentReminder.title && currentReminder.dueDate) {
      if (currentReminder.id) {
        await updateReminder(currentReminder.id, currentReminder as Reminder);
      } else {
        await addReminder(currentReminder);
      }
      onClose();
    }
  };

  return (
    <Modal title="Add New Reminder" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            type="text"
            id="title"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={currentReminder?.title || ''}
            onChange={(e) => setCurrentReminder({ ...currentReminder, title: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={currentReminder?.description || ''}
            onChange={(e) => setCurrentReminder({ ...currentReminder, description: e.target.value })}
          ></textarea>
        </div>
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Due Date</label>
          <input
            type="date"
            id="dueDate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={currentReminder?.dueDate || ''}
            onChange={(e) => setCurrentReminder({ ...currentReminder, dueDate: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority</label>
          <select
            id="priority"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={currentReminder?.priority || 'medium'}
            onChange={(e) => setCurrentReminder({ ...currentReminder, priority: e.target.value as 'low' | 'medium' | 'high' })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        {currentReminder?.id && (
          <div className="flex items-center">
            <input
              id="isCompleted"
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={currentReminder?.isCompleted || false}
              onChange={(e) => setCurrentReminder({ ...currentReminder, isCompleted: e.target.checked })}
            />
            <label htmlFor="isCompleted" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Mark as Completed</label>
          </div>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="pt-4">
          <button
            onClick={handleSaveReminder}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            {currentReminder?.id ? 'Save Changes' : 'Add Reminder'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditReminderModal;