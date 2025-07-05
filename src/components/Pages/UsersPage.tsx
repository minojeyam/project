import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, UserCheck, UserX } from 'lucide-react';
import DataTable from '../Common/DataTable';
import Modal from '../Common/Modal';

const UsersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const mockUsers = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      role: 'teacher',
      status: 'active',
      phoneNumber: '+1234567890',
      joinDate: '2024-01-15',
      locationName: 'Main Campus'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      role: 'student',
      status: 'active',
      phoneNumber: '+1234567891',
      joinDate: '2024-02-10',
      locationName: 'Downtown Branch'
    },
    {
      id: 3,
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob@example.com',
      role: 'parent',
      status: 'pending',
      phoneNumber: '+1234567892',
      joinDate: '2024-03-05',
      locationName: 'North Campus'
    }
  ];

  const columns = [
    {
      key: 'firstName',
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
          value === 'admin' ? 'bg-purple-100 text-purple-800' :
          value === 'teacher' ? 'bg-blue-100 text-blue-800' :
          value === 'student' ? 'bg-green-100 text-green-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' ? 'bg-green-100 text-green-800' :
          value === 'inactive' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
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
      key: 'joinDate',
      label: 'Join Date',
      sortable: true
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSelectedUser(row);
              setIsModalOpen(true);
            }}
            className="text-teal-600 hover:text-teal-800 transition-colors duration-200"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
            <Edit className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
            <Trash2 className="w-4 h-4" />
          </button>
          {row.status === 'pending' && (
            <>
              <button className="text-green-600 hover:text-green-800 transition-colors duration-200">
                <UserCheck className="w-4 h-4" />
              </button>
              <button className="text-red-600 hover:text-red-800 transition-colors duration-200">
                <UserX className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  const actions = (
    <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200 flex items-center space-x-2">
      <Plus className="w-4 h-4" />
      <span>Add User</span>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage teachers, students, and parents</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">Total Users: </span>
            <span className="font-semibold text-gray-900">{mockUsers.length}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200">
            <span className="text-sm text-gray-600">Pending Approval: </span>
            <span className="font-semibold text-orange-600">
              {mockUsers.filter(u => u.status === 'pending').length}
            </span>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={mockUsers}
        title="All Users"
        actions={actions}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-medium">
                  {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-gray-600">{selectedUser.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <p className="text-sm text-gray-900">{selectedUser.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <p className="text-sm text-gray-900">{selectedUser.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-sm text-gray-900">{selectedUser.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-sm text-gray-900">{selectedUser.locationName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <p className="text-sm text-gray-900">{selectedUser.joinDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <button className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-200">
                Edit User
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200">
                Delete User
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersPage;