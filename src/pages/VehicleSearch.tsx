import React, { useState } from 'react';
import { SearchIcon, AlertCircleIcon, ScanIcon } from 'lucide-react';

const mockVehicles = [{
  id: 'ABC123',
  licensePlate: 'ABC123',
  chassisNumber: 'VIN1234567890',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  color: 'Blue',
  owner: {
    walletAddress: 'addr1q8v42wjda8r6mpfj40d36p2n7k7y784qgfnrxh4cs6ezl6yv7nklpf85xwjdmrr6q2a5mfsufwwtnrwklvpxmn5rl3gs6h82xj',
    ownershipDate: '2021-05-15'
  },
  status: 'active',
  transactions: [{
    type: 'registration',
    date: '2021-05-15',
    txHash: '0x123...abc'
  }, {
    type: 'document_upload',
    date: '2021-06-20',
    txHash: '0x456...def'
  }]
}, {
  id: 'XYZ789',
  licensePlate: 'XYZ789',
  chassisNumber: 'VIN9876543210',
  make: 'Honda',
  model: 'Civic',
  year: 2019,
  color: 'Red',
  owner: {
    walletAddress: 'addr1q9v42wjda8r6mpfj40d36p2n7k7y784qgfnrxh4cs6ezl6yv7nklpf85xwjdmrr6q2a5mfsufwwtnrwklvpxmn5rl3gs6h82xj',
    ownershipDate: '2020-11-30'
  },
  status: 'active',
  transactions: [{
    type: 'registration',
    date: '2020-11-30',
    txHash: '0x789...ghi'
  }, {
    type: 'transfer',
    date: '2022-03-15',
    txHash: '0x012...jkl'
  }]
}];
const VehicleSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'license' | 'chassis'>('license');
  const [searchResult, setSearchResult] = useState<(typeof mockVehicles)[0] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSearched(true);
    
    setTimeout(() => {
      let result = null;
      if (searchType === 'license') {
        result = mockVehicles.find(v => v.licensePlate.toLowerCase() === searchQuery.toLowerCase());
      } else {
        result = mockVehicles.find(v => v.chassisNumber.toLowerCase() === searchQuery.toLowerCase());
      }
      if (result) {
        setSearchResult(result);
      } else {
        setSearchResult(null);
        setError(`No vehicle found with this ${searchType === 'license' ? 'license plate' : 'chassis number'}`);
      }
      setIsLoading(false);
    }, 1500);
  };

    alert('QR scanning would open the device camera in a real implementation');
  };

    return <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Vehicle Search
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Search for vehicle information by license plate or chassis number
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="searchType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Search By
                </label>
                <select id="searchType" value={searchType} onChange={e => setSearchType(e.target.value as 'license' | 'chassis')} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="license">License Plate</option>
                  <option value="chassis">Chassis Number</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {searchType === 'license' ? 'License Plate' : 'Chassis Number'}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input type="text" name="searchQuery" id="searchQuery" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder={searchType === 'license' ? 'e.g., ABC123' : 'e.g., VIN1234567890'} />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={isLoading} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </> : <>
                    <SearchIcon className="-ml-1 mr-2 h-4 w-4" />
                    Search
                  </>}
              </button>
              <button type="button" onClick={handleScanQR} className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <ScanIcon className="-ml-1 mr-2 h-4 w-4" />
                Scan QR Code
              </button>
            </div>
          </form>
        </div>
      </div>
      {searched && <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Search Results
            </h2>
          </div>
          <div className="p-6">
            {error ? <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      {error}
                    </h3>
                  </div>
                </div>
              </div> : searchResult ? <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Vehicle Information
                    </h3>
                    <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        License Plate
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {searchResult.licensePlate}
                      </dd>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Chassis Number
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {searchResult.chassisNumber}
                      </dd>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Make
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {searchResult.make}
                      </dd>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Model
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {searchResult.model}
                      </dd>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Year
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {searchResult.year}
                      </dd>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Color
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {searchResult.color}
                      </dd>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </dt>
                      <dd className="text-sm">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {searchResult.status}
                        </span>
                      </dd>
                    </dl>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      Ownership Information
                    </h3>
                    <dl className="mt-4 grid grid-cols-1 gap-y-3">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Current Owner (Wallet Address)
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white break-all">
                        {searchResult.owner.walletAddress}
                      </dd>
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Ownership Since
                      </dt>
                      <dd className="text-sm text-gray-900 dark:text-white">
                        {searchResult.owner.ownershipDate}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Transaction History
                  </h3>
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Type
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Transaction Hash
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {searchResult.transactions.map((tx, index) => <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                              {tx.type.replace('_', ' ')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {tx.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                              <a href="#" className="hover:underline">
                                {tx.txHash}
                              </a>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div> : <div className="text-center py-6">
                <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No results
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try a different search term or search type.
                </p>
              </div>}
          </div>
        </div>}
    </div>;
};
export default VehicleSearch;