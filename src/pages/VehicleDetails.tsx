import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CarIcon, FileTextIcon, CalendarIcon, UserIcon, CheckCircleIcon, TagIcon, PaletteIcon, HashIcon, ClockIcon, ShieldIcon, UploadIcon, ArrowRightIcon } from 'lucide-react';
import BlockchainAnimation from '../components/animations/BlockchainAnimation';
const VehicleDetails: React.FC = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const [vehicle, setVehicle] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'history'>('details');
  useEffect(() => {
    
    const fetchVehicleDetails = async () => {
      try {
        setIsLoading(true);
  
        await new Promise(resolve => setTimeout(resolve, 1500));
      
        setVehicle({
          id: id,
          licensePlate: id,
          chassisNumber: `VIN${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          color: 'Blue',
          registrationDate: '2021-05-15',
          status: 'active',
          owner: {
            username: 'john_doe',
            walletAddress: 'addr1q8v42wjda8r6mpfj40d36p2n7k7y784qgfnrxh4cs6ezl6yv7nklpf85xwjdmrr6q2a5mfsufwwtnrwklvpxmn5rl3gs6h82xj',
            ownershipDate: '2021-05-15'
          },
          documents: [{
            id: '1',
            name: 'Proof of Purchase.pdf',
            type: 'purchase',
            date: '2021-05-15',
            verified: true
          }, {
            id: '2',
            name: 'Insurance Certificate.pdf',
            type: 'insurance',
            date: '2021-06-20',
            verified: true
          }, {
            id: '3',
            name: 'Emissions Test.pdf',
            type: 'emissions',
            date: '2022-01-10',
            verified: true
          }],
          history: [{
            date: '2021-05-15',
            action: 'registration',
            description: 'Vehicle registered',
            txHash: '0x123...abc'
          }, {
            date: '2021-06-20',
            action: 'document',
            description: 'Insurance document uploaded',
            txHash: '0x456...def'
          }, {
            date: '2022-01-10',
            action: 'document',
            description: 'Emissions test uploaded',
            txHash: '0x789...ghi'
          }]
        });
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVehicleDetails();
  }, [id]);
  if (isLoading) {
    return <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]">
        <BlockchainAnimation width={150} height={150} />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading vehicle details from blockchain...
        </p>
      </div>;
  }
  if (!vehicle) {
    return <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
        <CarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
          Vehicle not found
        </h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          The vehicle with ID {id} could not be found.
        </p>
        <div className="mt-6">
          <Link to="/dashboard/search" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Search for vehicles
          </Link>
        </div>
      </div>;
  }
  return <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
          <div>
            <div className="flex items-center">
              <CarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </h2>
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              License Plate: {vehicle.licensePlate}
            </p>
          </div>
          <div className="flex space-x-3">
            <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {vehicle.status}
            </span>
            <Link to={`/dashboard/transfer?id=${vehicle.id}`} className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <ArrowRightIcon className="h-4 w-4 mr-1" />
              Transfer Ownership
            </Link>
          </div>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            <button onClick={() => setActiveTab('details')} className={`py-4 px-6 text-sm font-medium ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              <div className="flex items-center">
                <CarIcon className="h-5 w-5 mr-2" />
                <span>Vehicle Details</span>
              </div>
            </button>
            <button onClick={() => setActiveTab('documents')} className={`py-4 px-6 text-sm font-medium ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              <div className="flex items-center">
                <FileTextIcon className="h-5 w-5 mr-2" />
                <span>Documents</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {vehicle.documents.length}
                </span>
              </div>
            </button>
            <button onClick={() => setActiveTab('history')} className={`py-4 px-6 text-sm font-medium ${activeTab === 'history' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}>
              <div className="flex items-center">
                <ClockIcon className="h-5 w-5 mr-2" />
                <span>History</span>
                <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {vehicle.history.length}
                </span>
              </div>
            </button>
          </nav>
        </div>
        <div className="p-6">
          {/* Details Tab */}
          {activeTab === 'details' && <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Vehicle Information
                </h3>
                <dl className="grid grid-cols-1 gap-y-4">
                  <div className="flex items-start">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 w-36">
                      <TagIcon className="h-5 w-5 mr-2" />
                      License Plate
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white ml-2">
                      {vehicle.licensePlate}
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 w-36">
                      <HashIcon className="h-5 w-5 mr-2" />
                      Chassis Number
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white ml-2">
                      {vehicle.chassisNumber}
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 w-36">
                      <CarIcon className="h-5 w-5 mr-2" />
                      Make & Model
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white ml-2">
                      {vehicle.make} {vehicle.model}
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 w-36">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Year
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white ml-2">
                      {vehicle.year}
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 w-36">
                      <PaletteIcon className="h-5 w-5 mr-2" />
                      Color
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white ml-2">
                      {vehicle.color}
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 w-36">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Registration Date
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white ml-2">
                      {vehicle.registrationDate}
                    </dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Ownership Information
                </h3>
                <dl className="grid grid-cols-1 gap-y-4">
                  <div className="flex items-start">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 w-36">
                      <UserIcon className="h-5 w-5 mr-2" />
                      Current Owner
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white ml-2">
                      {vehicle.owner.username}
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 w-36">
                      <ShieldIcon className="h-5 w-5 mr-2" />
                      Wallet Address
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white ml-2 break-all">
                      {vehicle.owner.walletAddress}
                    </dd>
                  </div>
                  <div className="flex items-start">
                    <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 w-36">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Ownership Since
                    </dt>
                    <dd className="text-sm text-gray-900 dark:text-white ml-2">
                      {vehicle.owner.ownershipDate}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Blockchain Verified
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <p>
                          This vehicle's ownership information is securely
                          stored on the Cardano blockchain, ensuring
                          tamper-proof records and transparent history.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
          {/* Documents Tab */}
          {activeTab === 'documents' && <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Vehicle Documents
                </h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload New Document
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicle.documents.map((doc: any) => <div key={doc.id} className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    <div className="px-4 py-5 sm:p-6">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <FileTextIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="ml-4 truncate">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                            {doc.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Uploaded on {doc.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {doc.type}
                        </span>
                        {doc.verified && <span className="inline-flex items-center text-green-600 dark:text-green-400 text-sm">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Verified
                          </span>}
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 text-right sm:px-6">
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        View Document
                      </button>
                    </div>
                  </div>)}
              </div>
              {vehicle.documents.length === 0 && <div className="text-center py-12">
                  <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No documents
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Get started by uploading your first document.
                  </p>
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                      <UploadIcon className="h-4 w-4 mr-2" />
                      Upload Document
                    </button>
                  </div>
                </div>}
            </div>}
          {/* History Tab */}
          {activeTab === 'history' && <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Transaction History
              </h3>
              <div className="flow-root">
                <ul className="relative border-l border-gray-200 dark:border-gray-700">
                  {vehicle.history.map((event: any, index: number) => <li key={index} className="mb-10 ml-6">
                      <span className="absolute flex items-center justify-center w-8 h-8 rounded-full -left-4 ring-4 ring-white dark:ring-gray-800 bg-blue-100 dark:bg-blue-900">
                        {event.action === 'registration' ? <CarIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : event.action === 'document' ? <FileTextIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" /> : <ArrowRightIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      </span>
                      <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {event.description}
                          </h4>
                          <time className="text-sm text-gray-500 dark:text-gray-400">
                            {event.date}
                          </time>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          Transaction Hash:{' '}
                          <span className="font-mono">{event.txHash}</span>
                        </p>
                        <a href={`https://cardanoscan.io/transaction/${event.txHash}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          View on Cardano Explorer
                        </a>
                      </div>
                    </li>)}
                </ul>
              </div>
              {vehicle.history.length === 0 && <div className="text-center py-12">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No history
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    This vehicle has no recorded history yet.
                  </p>
                </div>}
            </div>}
        </div>
      </div>
    </div>;
};
export default VehicleDetails;