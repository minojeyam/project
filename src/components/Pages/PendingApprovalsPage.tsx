import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, User } from 'lucide-react';
import DataTable from '../Common/DataTable';
import { authAPI } from '../../utils/api';

const PendingApprovalsPage: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch('http://localhost:5000/api/auth/pending', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch pending users');
      }
      
      setPendingUsers(data.data.pendingUsers || []);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending users');
      setLoading(false);
    }
  };

  const handleApprove = async (userId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve user');
      }
      
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      // Show success message or notification
      alert('User approved successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to approve user');
    }
  };

  const handleReject = async (userId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`http://localhost:5000/api/users/${userId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject user');
      }
      
      setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      
      // Show success message or notification
      alert('User rejected successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to reject user');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, row: any) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {row.firstName.charAt(0)}{row.lastName.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{row.firstName} {row.lastName}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'teacher' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'phoneNumber',
      label: 'Phone',
      sortable: true
    },
    {
      key: 'locationName',
      label: 'Location',
      sortable: true
    },
    {
      key: 'parentEmail',
      label: 'Parent Email',
      sortable: true,
      render: (value: string) => value || '-'
    },
    {
      key: 'createdAt',
      label: 'Requested On',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleApprove(row.id)}
            className="p-1 bg-green-50 rounded-md hover:bg-green-100 text-green-600 transition-colors duration-200"
            title="Approve"
          >
            <UserCheck className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleReject(row.id)}
            className="p-1 bg-red-50 rounded-md hover:bg-red-100 text-red-600 transition-colors duration-200"
            title="Reject"
          >
            <UserX className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pending Approvals</h2>
          <p className="text-gray-600 mt-1">Review and approve new user registrations</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">Pending Users: </span>
            <span className="font-semibold text-gray-900">{pendingUsers.length}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      ) : pendingUsers.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center h-64">
          <User className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No Pending Approvals</h3>
          <p className="text-gray-500 mt-1">All user registrations have been processed</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={pendingUsers}
          title="Pending User Registrations"
        />
      )}
    </div>
  );
};

export default PendingApprovalsPage;