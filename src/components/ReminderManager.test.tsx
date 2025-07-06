import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReminderManager from './ReminderManager';
import { useAppStore } from '../store/useAppStore';
import { Reminder } from '../types';

// Mock useAppStore
vi.mock('../store/useAppStore', () => ({
  useAppStore: vi.fn(),
}));

describe('ReminderManager', () => {
  const mockReminders: Reminder[] = [
    {
      id: '1',
      clientId: 'client-1',
      title: 'Follow up with John',
      description: 'Discuss session goals',
      dueDate: '2025-07-10',
      priority: 'high',
      isCompleted: false,
      type: 'follow-up',
      createdAt: '2025-07-01T10:00:00Z',
      updatedAt: '2025-07-01T10:00:00Z',
    },
    {
      id: '2',
      clientId: 'client-2',
      title: 'Schedule next session with Jane',
      description: '',
      dueDate: '2025-07-12',
      priority: 'medium',
      isCompleted: true,
      type: 'session',
      createdAt: '2025-07-02T11:00:00Z',
      updatedAt: '2025-07-02T11:00:00Z',
    },
  ];

  const mockAddReminder = vi.fn();
  const mockUpdateReminder = vi.fn();
  const mockDeleteReminder = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useAppStore.mockReturnValue({
      reminders: mockReminders,
      addReminder: mockAddReminder,
      updateReminder: mockUpdateReminder,
      deleteReminder: mockDeleteReminder,
    });
  });

  it('renders the ReminderManager component with existing reminders', () => {
    render(<ReminderManager />);

    expect(screen.getByText('Reminders')).toBeInTheDocument();
    expect(screen.getByText('Add New Reminder')).toBeInTheDocument();
    expect(screen.getByText('Follow up with John')).toBeInTheDocument();
    expect(screen.getByText('Schedule next session with Jane')).toBeInTheDocument();
  });

  it('opens and closes the add reminder modal', async () => {
    render(<ReminderManager />);

    fireEvent.click(screen.getByText('Add New Reminder'));
    expect(screen.getByRole('heading', { name: 'Add New Reminder' })).toBeInTheDocument(); // Modal title

    fireEvent.click(screen.getByRole('button', { name: /close/i })); // Assuming a close button in Modal
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Add New Reminder' })).not.toBeInTheDocument(); // Modal title should be gone
    });
  });

  it('adds a new reminder', async () => {
    render(<ReminderManager />);

    fireEvent.click(screen.getByText('Add New Reminder'));

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New Test Reminder' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });
    fireEvent.change(screen.getByLabelText('Due Date'), { target: { value: '2025-08-01' } });
    fireEvent.change(screen.getByLabelText('Priority'), { target: { value: 'low' } });

    fireEvent.click(screen.getByText('Add Reminder'));

    await waitFor(() => {
      expect(mockAddReminder).toHaveBeenCalledTimes(1);
      expect(mockAddReminder).toHaveBeenCalledWith(expect.objectContaining({
        title: 'New Test Reminder',
        description: 'Test description',
        dueDate: '2025-08-01',
        priority: 'low',
        isCompleted: false,
        type: 'custom',
      }));
    });
  });

  it('edits an existing reminder', async () => {
    render(<ReminderManager />);

    fireEvent.click(screen.getAllByTitle('Edit Reminder')[0]); // Click edit on the first reminder

    expect(screen.getByText('Edit Reminder')).toBeInTheDocument(); // Modal title
    expect(screen.getByLabelText('Title')).toHaveValue('Follow up with John');

    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Updated Title' } });
    fireEvent.click(screen.getByLabelText('Mark as Completed'));

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockUpdateReminder).toHaveBeenCalledTimes(1);
      expect(mockUpdateReminder).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({
          title: 'Updated Title',
          isCompleted: true,
        })
      );
    });
  });

  it('deletes a reminder', async () => {
    render(<ReminderManager />);

    window.confirm = vi.fn(() => true); // Mock window.confirm to return true

    fireEvent.click(screen.getAllByTitle('Delete Reminder')[0]); // Click delete on the first reminder

    await waitFor(() => {
      expect(mockDeleteReminder).toHaveBeenCalledTimes(1);
      expect(mockDeleteReminder).toHaveBeenCalledWith('1');
    });
  });

  it('toggles reminder completion status', async () => {
    render(<ReminderManager />);

    // Mark incomplete reminder as complete
    fireEvent.click(screen.getAllByTitle('Mark as Complete')[0]);

    await waitFor(() => {
      expect(mockUpdateReminder).toHaveBeenCalledWith(
        '1',
        expect.objectContaining({ isCompleted: true })
      );
    });

    // Mark complete reminder as incomplete
    fireEvent.click(screen.getAllByTitle('Mark as Incomplete')[0]);

    await waitFor(() => {
      expect(mockUpdateReminder).toHaveBeenCalledWith(
        '2',
        expect.objectContaining({ isCompleted: false })
      );
    });
  });
});