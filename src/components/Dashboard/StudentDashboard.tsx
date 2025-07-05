import React from 'react';
import { BookOpen, Calendar, FileText, DollarSign, Clock, CheckCircle, AlertCircle, Trophy } from 'lucide-react';
import StatsCard from './StatsCard';

const StudentDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Enrolled Classes',
      value: '6',
      icon: BookOpen,
      color: 'teal' as const,
    },
    {
      title: 'Attendance Rate',
      value: '98.5%',
      icon: CheckCircle,
      color: 'green' as const,
    },
    {
      title: 'Assignments Due',
      value: '3',
      icon: Clock,
      color: 'orange' as const,
    },
    {
      title: 'Overall Grade',
      value: 'A-',
      icon: Trophy,
      color: 'purple' as const,
    }
  ];

  const todaySchedule = [
    { id: 1, subject: 'Mathematics', time: '9:00 AM - 10:30 AM', teacher: 'Mrs. Johnson', room: 'Room 101' },
    { id: 2, subject: 'Physics', time: '11:00 AM - 12:30 PM', teacher: 'Mr. Smith', room: 'Lab 204' },
    { id: 3, subject: 'Chemistry', time: '2:00 PM - 3:30 PM', teacher: 'Dr. Davis', room: 'Lab 301' },
    { id: 4, subject: 'English', time: '4:00 PM - 5:30 PM', teacher: 'Ms. Wilson', room: 'Room 205' },
  ];

  const upcomingAssignments = [
    { id: 1, title: 'Math Problem Set 5', subject: 'Mathematics', due: 'Tomorrow', priority: 'high' },
    { id: 2, title: 'Physics Lab Report', subject: 'Physics', due: 'March 15', priority: 'medium' },
    { id: 3, title: 'Chemistry Essay', subject: 'Chemistry', due: 'March 18', priority: 'low' },
    { id: 4, title: 'Literature Analysis', subject: 'English', due: 'March 22', priority: 'medium' },
  ];

  const recentGrades = [
    { id: 1, subject: 'Mathematics', assignment: 'Quiz 3', grade: 'A', date: '2 days ago' },
    { id: 2, subject: 'Physics', assignment: 'Lab Report 2', grade: 'B+', date: '3 days ago' },
    { id: 3, subject: 'Chemistry', assignment: 'Test 1', grade: 'A-', date: '1 week ago' },
    { id: 4, subject: 'English', assignment: 'Essay 1', grade: 'A', date: '1 week ago' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
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
              View Full Timetable
            </button>
          </div>
          <div className="space-y-4">
            {todaySchedule.map((schedule) => (
              <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{schedule.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{schedule.time}</p>
                  <p className="text-xs text-gray-500">{schedule.teacher} • {schedule.room}</p>
                </div>
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h3>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{assignment.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{assignment.subject}</p>
                  <p className="text-xs text-gray-500">Due: {assignment.due}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(assignment.priority)}`}>
                  {assignment.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Grades</h3>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              View Report Card
            </button>
          </div>
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{grade.subject}</p>
                  <p className="text-xs text-gray-500 mt-1">{grade.assignment}</p>
                  <p className="text-xs text-gray-500">{grade.date}</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-teal-600">{grade.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fee Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Monthly Fee</p>
                <p className="text-xs text-gray-500">March 2024</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-green-600">Paid</span>
                <p className="text-xs text-gray-500">$450</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Lab Fee</p>
                <p className="text-xs text-gray-500">Semester 1</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-orange-600">Due Soon</span>
                <p className="text-xs text-gray-500">$120</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Total Outstanding</p>
                <p className="text-xs text-gray-500">All fees</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-teal-600">$120</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors duration-200">
            <Calendar className="w-8 h-8 text-teal-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">View Timetable</p>
          </button>
          <button className="p-4 bg-coral-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
            <FileText className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm font-medium text-gray-900">Study Materials</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <DollarSign className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Pay Fees</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <Trophy className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">View Grades</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;