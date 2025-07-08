import React, { useState } from 'react';
import { UserIcon, FlagIcon, AlertTriangleIcon, UsersIcon, ShieldCheckIcon, CarIcon, CheckIcon, XIcon, EyeIcon, MoreVerticalIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
const AdminDashboard: React.FC = () => {
  const {
    user
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'flagged' | 'complaints'>('users');
  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  // data
  const users = [{
    id: '1',
    username: 'john_doe',
    role: 'user',
    status: 'active',
    walletConnected: true,
    vehicles: 2,
    lastActive: '2023-08-15T10:30:00'
  }, {
    id: '2',
    username: 'jane_smith',
    role: 'user',
    status: 'active',
    walletConnected: true,
    vehicles: 1,
    lastActive: '2023-08-14T15:45:00'
  }, {
    id: '3',
    username: 'officer1',
    role: 'officer',
    status: 'active',
    walletConnected: false,
    vehicles: 0,
    lastActive: '2023-08-15T09:20:00'
  }, {
    id: '4',
    username: 'robert_johnson',
    role: 'user',
    status: 'inactive',
    walletConnected: false,
    vehicles: 3,
    lastActive: '2023-07-30T11:15:00'
  }];
  const flaggedVehicles = [{
    id: 'ABC123',
    reason: 'Suspicious ownership transfer',
    date: '2023-08-10',
    status: 'pending',
    owner: 'john_doe'
  }, {
    id: 'XYZ789',
    reason: 'Document verification failed',
    date: '2023-08-12',
    status: 'investigating',
    owner: 'jane_smith'
  }, {
    id: 'DEF456',
    reason: 'Multiple rapid transfers',
    date: '2023-08-14',
    status: 'resolved',
    owner: 'robert_johnson'
  }];
  const complaints = [{
    id: '1',
    from: 'john_doe',
    subject: 'Transfer issue',
    message: 'I cannot transfer my vehicle to another wallet',
    date: '2023-08-14',
    status: 'open'
  }, {
    id: '2',
    from: 'jane_smith',
    subject: 'Document upload failing',
    message: 'The system is not accepting my insurance documents',
    date: '2023-08-13',
    status: 'in progress'
  }, {
    id: '3',
    from: 'robert_johnson',
    subject: 'Wrong vehicle information',
    message: 'The color of my vehicle is incorrect in the system',
    date: '2023-08-11',
    status: 'closed'
  }];
  return <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage system users, flagged vehicles, and complaints
          </p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('users')} className={`py-4 px-6 text-sm font-medium ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              <div className="flex items-center">
                <UsersIcon className="h-5 w-5 mr-2" />
                <span>Users</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('flagged')} className={`py-4 px-6 text-sm font-medium ${activeTab === 'flagged' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              <div className="flex items-center">
                <FlagIcon className="h-5 w-5 mr-2" />
                <span>Flagged Vehicles</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('complaints')} className={`py-4 px-6 text-sm font-medium ${activeTab === 'complaints' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              <div className="flex items-center">
                <AlertTriangleIcon className="h-5 w-5 mr-2" />
                <span>Complaints</span>
              </div>
            </button>
          </nav>
        </div>
        <div className="p-6">
          {/* Users Tab */}
          {activeTab === 'users' && <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  System Users
                </h3>
                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                  Add New User
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Wallet
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Vehicles
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.username}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {user.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : user.role === 'officer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.walletConnected ? <span className="text-green-600 dark:text-green-400 flex items-center">
                              <CheckIcon className="h-4 w-4 mr-1" />
                              Connected
                            </span> : <span className="text-gray-500 dark:text-gray-400 flex items-center">
                              <XIcon className="h-4 w-4 mr-1" />
                              Not Connected
                            </span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.vehicles}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(user.lastActive).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                              Disable
                            </button>
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>}
          {/* Flagged Vehicles Tab */}
          {activeTab === 'flagged' && <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Flagged Vehicles
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {flaggedVehicles.map(vehicle => <div key={vehicle.id} className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                      <div className="flex items-center">
                        <CarIcon className="h-5 w-5 text-red-500 mr-2" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          Vehicle ID: {vehicle.id}
                        </h4>
                      </div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${vehicle.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : vehicle.status === 'investigating' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="px-6 py-4">
                      <dl>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Flag Reason
                          </dt>
                          <dd className="text-sm text-gray-900 dark:text-white">
                            {vehicle.reason}
                          </dd>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Date Flagged
                          </dt>
                          <dd className="text-sm text-gray-900 dark:text-white">
                            {vehicle.date}
                          </dd>
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Current Owner
                          </dt>
                          <dd className="text-sm text-gray-900 dark:text-white">
                            {vehicle.owner}
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 flex justify-end space-x-3">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                        Investigate
                      </button>
                      <button className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors">
                        Resolve
                      </button>
                    </div>
                  </div>)}
              </div>
            </div>}
          {/* Complaints Tab */}
          {activeTab === 'complaints' && <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  User Complaints
                </h3>
              </div>
              <div className="space-y-4">
                {complaints.map(complaint => <div key={complaint.id} className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    <div className="px-6 py-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {complaint.subject}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          From: {complaint.from} • {complaint.date}
                        </p>
                      </div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${complaint.status === 'open' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : complaint.status === 'in progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-gray-700 dark:text-gray-300">
                        {complaint.message}
                      </p>
                    </div>
                    <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 flex justify-end space-x-3">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors">
                        Respond
                      </button>
                      {complaint.status !== 'closed' ? <button className="px-3 py-1 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors">
                          Mark as Resolved
                        </button> : <button className="px-3 py-1 bg-gray-600 text-white text-sm font-medium rounded hover:bg-gray-700 transition-colors">
                          Reopen
                        </button>}
                    </div>
                  </div>)}
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default AdminDashboard;