import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Bell, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import StatsCard from './StatsCard';

const ParentDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Children Enrolled',
      value: '2',
      icon: Users,
      color: 'teal' as const,
    },
    {
      title: 'Average Attendance',
      value: '96.8%',
      icon: CheckCircle,
      color: 'green' as const,
    },
    {
      title: 'Pending Payments',
      value: '$240',
      icon: DollarSign,
      color: 'orange' as const,
    },
    {
      title: 'Unread Notices',
      value: '3',
      icon: Bell,
      color: 'coral' as const,
    }
  ];

  const children = [
    {
      id: 1,
      name: 'Emma Johnson',
      class: 'Grade 7A',
      attendance: '98.5%',
      lastGrade: 'A',
      feeStatus: 'Paid',
      upcomingEvents: 2
    },
    {
      id: 2,
      name: 'Liam Johnson',
      class: 'Grade 5B',
      attendance: '95.2%',
      lastGrade: 'B+',
      feeStatus: 'Due',
      upcomingEvents: 1
    }
  ];

  const recentNotices = [
    {
      id: 1,
      title: 'Parent-Teacher Meeting',
      message: 'Scheduled for tomorrow at 2:00 PM. Please confirm your attendance.',
      type: 'urgent',
      date: '1 hour ago',
      child: 'Emma Johnson'
    },
    {
      id: 2,
      title: 'Mid-term Results',
      message: 'Mid-term examination results are now available for download.',
      type: 'general',
      date: '2 days ago',
      child: 'Liam Johnson'
    },
    {
      id: 3,
      title: 'Fee Payment Reminder',
      message: 'Monthly fee payment is due on March 15th.',
      type: 'urgent',
      date: '3 days ago',
      child: 'Both Children'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Science Fair',
      date: 'March 20, 2024',
      time: '10:00 AM - 2:00 PM',
      child: 'Emma Johnson'
    },
    {
      id: 2,
      title: 'Sports Day',
      date: 'March 25, 2024',
      time: '9:00 AM - 4:00 PM',
      child: 'Liam Johnson'
    },
    {
      id: 3,
      title: 'Annual Function',
      date: 'April 2, 2024',
      time: '6:00 PM - 9:00 PM',
      child: 'Both Children'
    }
  ];

  const getNoticeTypeColor = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'general':
        return 'bg-blue-100 text-blue-800';
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
            <h3 className="text-lg font-semibold text-gray-900">Children Overview</h3>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              View Details
            </button>
          </div>
          <div className="space-y-4">
            {children.map((child) => (
              <div key={child.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{child.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    child.feeStatus === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {child.feeStatus}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Class</p>
                    <p className="font-medium">{child.class}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Attendance</p>
                    <p className="font-medium">{child.attendance}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Grade</p>
                    <p className="font-medium">{child.lastGrade}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Notices</h3>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentNotices.map((notice) => (
              <div key={notice.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{notice.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNoticeTypeColor(notice.type)}`}>
                    {notice.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{notice.message}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{notice.child}</span>
                  <span>{notice.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
          <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">
            View Calendar
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-4 bg-teal-50 rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <Calendar className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{event.date}</p>
              <p className="text-sm text-gray-600 mb-2">{event.time}</p>
              <p className="text-xs text-teal-600 font-medium">{event.child}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors duration-200">
            <DollarSign className="w-8 h-8 text-teal-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Pay Fees</p>
          </button>
          <button className="p-4 bg-coral-50 rounded-lg hover:bg-red-100 transition-colors duration-200">
            <FileText className="w-8 h-8 text-red-500 mb-2" />
            <p className="text-sm font-medium text-gray-900">View Reports</p>
          </button>
          <button className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <Calendar className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">School Calendar</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors duration-200">
            <Bell className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Contact Teacher</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;