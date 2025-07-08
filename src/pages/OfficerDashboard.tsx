import React, { useState } from 'react';
import { ClipboardCheckIcon, FileTextIcon, CheckCircleIcon, XCircleIcon, EyeIcon, CarIcon, UserIcon, CalendarIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
const OfficerDashboard: React.FC = () => {
  const {
    user
  } = useAuth();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  // Redirect if not officer
  if (user?.role !== 'officer' && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  // data
  const pendingRegistrations = [{
    id: '1',
    vehicleId: 'ABC123',
    owner: 'john_doe',
    date: '2023-08-15',
    type: 'New Registration',
    documents: 3
  }, {
    id: '2',
    vehicleId: 'XYZ789',
    owner: 'jane_smith',
    date: '2023-08-14',
    type: 'Ownership Transfer',
    documents: 2
  }, {
    id: '3',
    vehicleId: 'DEF456',
    owner: 'robert_johnson',
    date: '2023-08-13',
    type: 'Document Update',
    documents: 1
  }];
  const approvedRegistrations = [{
    id: '4',
    vehicleId: 'GHI789',
    owner: 'alice_williams',
    date: '2023-08-12',
    type: 'New Registration',
    approvedBy: 'officer1'
  }, {
    id: '5',
    vehicleId: 'JKL012',
    owner: 'bob_miller',
    date: '2023-08-11',
    type: 'Ownership Transfer',
    approvedBy: 'officer1'
  }];
  const rejectedRegistrations = [{
    id: '6',
    vehicleId: 'MNO345',
    owner: 'charlie_davis',
    date: '2023-08-10',
    type: 'New Registration',
    reason: 'Incomplete documentation'
  }, {
    id: '7',
    vehicleId: 'PQR678',
    owner: 'david_wilson',
    date: '2023-08-09',
    type: 'Document Update',
    reason: 'Invalid information provided'
  }];
  return <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Officer Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Verify and manage vehicle registrations
          </p>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('pending')} className={`py-4 px-6 text-sm font-medium ${activeTab === 'pending' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              <div className="flex items-center">
                <ClipboardCheckIcon className="h-5 w-5 mr-2" />
                <span>Pending Approvals</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  {pendingRegistrations.length}
                </span>
              </div>
            </button>
            <button onClick={() => setActiveTab('approved')} className={`py-4 px-6 text-sm font-medium ${activeTab === 'approved' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                <span>Approved</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('rejected')} className={`py-4 px-6 text-sm font-medium ${activeTab === 'rejected' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              <div className="flex items-center">
                <XCircleIcon className="h-5 w-5 mr-2" />
                <span>Rejected</span>
              </div>
            </button>
          </nav>
        </div>
        <div className="p-6">
          {/* Pending Tab */}
          {activeTab === 'pending' && <div>
              <div className="grid grid-cols-1 gap-6">
                {pendingRegistrations.map(registration => <div key={registration.id} className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
                      <div className="flex items-center">
                        <CarIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                          {registration.type}
                        </h4>
                      </div>
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Pending
                      </span>
                    </div>
                    <div className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <dl className="grid grid-cols-1 gap-y-3">
                            <div className="flex items-center">
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1 flex items-center">
                                <CarIcon className="h-4 w-4 mr-1" />
                                Vehicle ID:
                              </dt>
                              <dd className="text-sm text-gray-900 dark:text-white font-medium">
                                {registration.vehicleId}
                              </dd>
                            </div>
                            <div className="flex items-center">
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1 flex items-center">
                                <UserIcon className="h-4 w-4 mr-1" />
                                Owner:
                              </dt>
                              <dd className="text-sm text-gray-900 dark:text-white">
                                {registration.owner}
                              </dd>
                            </div>
                            <div className="flex items-center">
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1 flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                Submitted:
                              </dt>
                              <dd className="text-sm text-gray-900 dark:text-white">
                                {registration.date}
                              </dd>
                            </div>
                            <div className="flex items-center">
                              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-1 flex items-center">
                                <FileTextIcon className="h-4 w-4 mr-1" />
                                Documents:
                              </dt>
                              <dd className="text-sm text-gray-900 dark:text-white">
                                {registration.documents} attached
                              </dd>
                            </div>
                          </dl>
                        </div>
                        <div className="flex flex-col justify-end space-y-3">
                          <button className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                            <EyeIcon className="h-4 w-4 mr-2" />
                            View Documents
                          </button>
                          <button className="flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors">
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Approve
                          </button>
                          <button className="flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors">
                            <XCircleIcon className="h-4 w-4 mr-2" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>)}
                {pendingRegistrations.length === 0 && <div className="text-center py-8">
                    <ClipboardCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                      No pending registrations
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      There are no registrations waiting for your approval.
                    </p>
                  </div>}
              </div>
            </div>}
          {/* Approved Tab */}
          {activeTab === 'approved' && <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Owner
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Approved By
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {approvedRegistrations.map(registration => <tr key={registration.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {registration.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {registration.vehicleId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {registration.owner}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {registration.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {registration.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {registration.approvedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                            View
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
              {approvedRegistrations.length === 0 && <div className="text-center py-8">
                  <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No approved registrations
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    There are no approved registrations to display.
                  </p>
                </div>}
            </div>}
          {/* Rejected Tab */}
          {activeTab === 'rejected' && <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Owner
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Reason
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {rejectedRegistrations.map(registration => <tr key={registration.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {registration.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {registration.vehicleId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {registration.owner}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {registration.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {registration.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                          {registration.reason}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              View
                            </button>
                            <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                              Reconsider
                            </button>
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
              {rejectedRegistrations.length === 0 && <div className="text-center py-8">
                  <XCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No rejected registrations
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    There are no rejected registrations to display.
                  </p>
                </div>}
            </div>}
        </div>
      </div>
    </div>;
};
export default OfficerDashboard;