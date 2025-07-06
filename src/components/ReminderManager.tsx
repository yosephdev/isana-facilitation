import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Reminder } from '../types';
import { PlusCircle, Edit, Trash2, CheckCircle, XCircle, Bell } from 'lucide-react';
import AddEditReminderModal from './AddEditReminderModal';

const ReminderManager: React.FC = () => {
  const { reminders, deleteReminder } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Partial<Reminder> | null>(null);

  const handleAddEditClick = (reminder?: Reminder) => {
    setCurrentReminder(reminder || {
      clientId: '', // Will need to select a client
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      isCompleted: false,
      type: 'custom',
    });
    setIsModalOpen(true);
  };

  const handleSaveReminder = async (reminderToSave: Partial<Reminder>) => {
    if (reminderToSave && reminderToSave.title && reminderToSave.dueDate) {
      if (reminderToSave.id) {
        await updateReminder(reminderToSave.id, reminderToSave as Reminder);
      } else {
        await addReminder(reminderToSave);
      }
      setIsModalOpen(false);
      setCurrentReminder(null);
    }
  };

  const handleDeleteReminder = (id: string) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      deleteReminder(id);
    }
  };

  const handleToggleComplete = async (reminder: Reminder) => {
    await updateReminder(reminder.id, { ...reminder, isCompleted: !reminder.isCompleted });
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reminders</h1>
        <button
          onClick={() => handleAddEditClick()}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Add New Reminder</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        {reminders.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-10">No reminders found. Add one to get started!</p>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {reminders.map((reminder) => (
              <li key={reminder.id} className="py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {reminder.isCompleted ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <Bell size={20} className="text-blue-500" />
                    )}
                    <h3 className={`text-lg font-semibold ${reminder.isCompleted ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                      {reminder.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      reminder.priority === 'high' ? 'bg-red-100 text-red-800' :
                      reminder.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {reminder.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{reminder.description}</p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleToggleComplete(reminder)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title={reminder.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
                  >
                    {reminder.isCompleted ? (
                      <XCircle size={20} className="text-red-500" />
                    ) : (
                      <CheckCircle size={20} className="text-green-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleAddEditClick(reminder)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Edit Reminder"
                  >
                    <Edit size={20} className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                    title="Delete Reminder"
                  >
                    <Trash2 size={20} className="text-red-600" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isModalOpen && (
        <AddEditReminderModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentReminder(null);
          }}
          reminder={currentReminder}
        />
      )}
    </div>
  );
};

export default ReminderManager;
