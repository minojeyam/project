import React from 'react';
import { Users, BookOpen, Calendar, Clock, CheckCircle, AlertCircle, DollarSign, FileText } from 'lucide-react';
import StatsCard from './StatsCard';

const TeacherDashboard: React.FC = () => {
  const stats = [
    {
      title: 'My Classes',
      value: '4',
      icon: BookOpen,
      color: 'teal' as const,
    },
    {
      title: 'Total Students',
      value: '128',
      icon: Users,
      color: 'coral' as const,
    },
    {
      title: 'Today\'s Classes',
      value: '3',
      icon: Calendar,
      color: 'green' as const,
    },
    {
      title: 'Attendance Rate',
      value: '96.5%',
      icon: CheckCircle,
      color: 'blue' as const,
    }
  ];

  const todaySchedule = [
    { id: 1, class: 'Mathematics Grade 7', time: '9:00 AM - 10:30 AM', students: 32, status: 'completed' },
    { id: 2, class: 'Physics Grade 8', time: '11:00 AM - 12:30 PM', students: 28, status: 'ongoing' },
    { id: 3, class: 'Chemistry Grade 9', time: '2:00 PM - 3:30 PM', students: 35, status: 'upcoming' },
    { id: 4, class: 'Mathematics Grade 8', time: '4:00 PM - 5:30 PM', students: 30, status: 'upcoming' },
  ];

  const recentSubmissions = [
    { id: 1, student: 'Alice Johnson', assignment: 'Physics Lab Report', submitted: '2 hours ago', grade: 'A' },
    { id: 2, student: 'Bob Smith', assignment: 'Math Problem Set', submitted: '4 hours ago', grade: 'B+' },
    { id: 3, student: 'Carol Davis', assignment: 'Chemistry Essay', submitted: '1 day ago', grade: 'A-' },
    { id: 4, student: 'David Wilson', assignment: 'Physics Quiz', submitted: '2 days ago', grade: 'B' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              View Full Calendar
            </button>
          </div>
          <div className="space-y-4">
            {todaySchedule.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{schedule.class}</p>
                  <p className="text-xs text-gray-500 mt-1">{schedule.time}</p>
                  <p className="text-xs text-gray-500">{schedule.students} students</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                  {schedule.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Submissions</h3>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{submission.student}</p>
                  <p className="text-xs text-gray-500 mt-1">{submission.assignment}</p>
                  <p className="text-xs text-gray-500">{submission.submitted}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-teal-600">{submission.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors duration-200">
            <CheckCircle className="w-8 h-8 text-teal-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Mark Attendance</p>
          </button>
          <button className="p-4 bg-coral-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
            <FileText className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm font-medium text-gray-900">Upload Material</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Record Payment</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <AlertCircle className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Send Notice</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;