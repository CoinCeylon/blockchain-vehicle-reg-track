import React from 'react';
import { Link } from 'react-router-dom';
import { CarIcon, SearchIcon, ClipboardListIcon, ArrowRightIcon, ShieldIcon, AlertTriangleIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
const Dashboard: React.FC = () => {
  const {
    user
  } = useAuth();
  //  data for dashboard
  const recentActivity = [{
    id: 1,
    type: 'registration',
    vehicleId: 'ABC123',
    date: '2023-08-15',
    status: 'completed'
  }, {
    id: 2,
    type: 'transfer',
    vehicleId: 'XYZ789',
    date: '2023-08-10',
    status: 'pending'
  }, {
    id: 3,
    type: 'document',
    vehicleId: 'DEF456',
    date: '2023-08-05',
    status: 'completed'
  }];
  const userVehicles = [{
    id: 'ABC123',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    status: 'active'
  }, {
    id: 'DEF456',
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    status: 'active'
  }];
  return <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Welcome back, {user?.username}!
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Here's an overview of your vehicle registration activities
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <CarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Registered Vehicles
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {userVehicles.length}
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/dashboard/register-vehicle" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center">
                  Register a new vehicle
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            {/* Card 2 */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-100 dark:border-green-800">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <ClipboardListIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Recent Transactions
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {recentActivity.length}
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/dashboard/transactions" className="text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium flex items-center">
                  View transaction history
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            {/* Card 3 */}
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-5 border border-purple-100 dark:border-purple-800">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <SearchIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Vehicle Lookup
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Search
                  </h3>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/dashboard/search" className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-medium flex items-center">
                  Find vehicle information
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* My Vehicles Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            My Vehicles
          </h2>
          <Link to="/dashboard/register-vehicle" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
            Register New
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  License Plate
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Vehicle
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {userVehicles.map(vehicle => <tr key={vehicle.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {vehicle.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {vehicle.make} {vehicle.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {vehicle.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <Link to={`/dashboard/vehicle/${vehicle.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                      View
                    </Link>
                    <Link to={`/dashboard/transfer?id=${vehicle.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      Transfer
                    </Link>
                  </td>
                </tr>)}
              {userVehicles.length === 0 && <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    You don't have any registered vehicles yet.
                  </td>
                </tr>}
            </tbody>
          </table>
        </div>
      </div>
      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Recent Activity
          </h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {recentActivity.map(activity => <div key={activity.id} className="px-6 py-4 flex items-center">
              <div className={`flex-shrink-0 rounded-full p-2 ${activity.type === 'registration' ? 'bg-green-100 dark:bg-green-900/30' : activity.type === 'transfer' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-yellow-100 dark:bg-yellow-900/30'}`}>
                {activity.type === 'registration' ? <CarIcon className="h-5 w-5 text-green-600 dark:text-green-400" /> : activity.type === 'transfer' ? <ArrowRightIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" /> : <ClipboardListIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.type === 'registration' ? 'Vehicle Registration' : activity.type === 'transfer' ? 'Ownership Transfer' : 'Document Upload'}
                  </p>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                    {activity.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vehicle ID: {activity.vehicleId}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {activity.date}
                </p>
              </div>
            </div>)}
          {recentActivity.length === 0 && <div className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No recent activity to display.
            </div>}
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
          <Link to="/dashboard/transactions" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
            View all activity
          </Link>
        </div>
      </div>
      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            System Status
          </h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldIcon className="h-5 w-5 text-green-500" />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Blockchain Network
              </span>
            </div>
            <div className="flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Operational
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 text-yellow-500" />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Wallet Integration
              </span>
            </div>
            <div className="flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Partial Outage
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ShieldIcon className="h-5 w-5 text-green-500" />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Document Storage
              </span>
            </div>
            <div className="flex items-center">
              <span className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Operational
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;