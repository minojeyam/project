import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminCalendarView from '../Calendar/AdminCalendarView';
import TeacherCalendarView from '../Calendar/TeacherCalendarView';
import StudentCalendarView from '../Calendar/StudentCalendarView';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();

  const renderCalendarView = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminCalendarView />;
      case 'teacher':
        return <TeacherCalendarView />;
      case 'student':
        return <StudentCalendarView />;
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Access denied. Invalid user role.</p>
          </div>
        );
    }
  };

  return renderCalendarView();
};

export default CalendarPage;