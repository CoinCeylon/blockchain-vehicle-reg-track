import React, { useEffect, useState } from 'react';
import { HistoryIcon, ArrowRightIcon, CarIcon, FileTextIcon, SearchIcon, FilterIcon, ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getTransactionHistory } from '../services/blockfrost';
import BlockchainAnimation from '../components/animations/BlockchainAnimation';
const TransactionHistory: React.FC = () => {
  const {
    user
  } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'registration' | 'transfer' | 'document'>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true);
        setError(null);
   
        const address = user?.walletAddress || 'address';
        const txHistory = await getTransactionHistory(address);
    
        const enhancedTxs = txHistory.map((tx, index) => ({
          ...tx,
          type: index % 3 === 0 ? 'registration' : index % 3 === 1 ? 'transfer' : 'document',
          vehicleId: `VEH${Math.floor(Math.random() * 1000)}`,
          description: index % 3 === 0 ? 'Vehicle registration' : index % 3 === 1 ? 'Ownership transfer' : 'Document update'
        }));
        setTransactions(enhancedTxs);
      } catch (err) {
        setError('Failed to load transaction history');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [user]);
  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type === filter;
  }).sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.block_time - b.block_time;
    } else {
      return b.block_time - a.block_time;
    }
  });
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'registration':
        return <CarIcon className="h-5 w-5 text-green-500" />;
      case 'transfer':
        return <ArrowRightIcon className="h-5 w-5 text-blue-500" />;
      case 'document':
        return <FileTextIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <HistoryIcon className="h-5 w-5 text-gray-500" />;
    }
  };
  const getTransactionTypeClass = (type: string) => {
    switch (type) {
      case 'registration':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'transfer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'document':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };
  return <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Transaction History
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View your blockchain transaction history
          </p>
        </div>
        <div className="p-6">
          {/* Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <FilterIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Filter by:
              </span>
              <div className="relative inline-block">
                <select value={filter} onChange={e => setFilter(e.target.value as any)} className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="all">All Transactions</option>
                  <option value="registration">Registrations</option>
                  <option value="transfer">Transfers</option>
                  <option value="document">Documents</option>
                </select>
              </div>
            </div>
            <button onClick={toggleSortDirection} className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              <span>Sort by Date</span>
              {sortDirection === 'asc' ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </button>
          </div>
          {isLoading ? <div className="py-12 flex flex-col items-center justify-center">
              <BlockchainAnimation width={150} height={150} />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading transaction history...
              </p>
            </div> : error ? <div className="py-12 text-center">
              <HistoryIcon className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                Error loading transactions
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">{error}</p>
              <button className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Try Again
              </button>
            </div> : filteredTransactions.length === 0 ? <div className="py-12 text-center">
              <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                No transactions found
              </h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                {filter === 'all' ? "You don't have any blockchain transactions yet." : `You don't have any ${filter} transactions.`}
              </p>
            </div> : <div className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Transaction
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Vehicle
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Fee
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Details
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredTransactions.map(tx => <tr key={tx.hash} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                              {getTransactionTypeIcon(tx.type)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {tx.description}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                <span className="truncate max-w-xs">
                                  {tx.hash}
                                </span>
                                <a href={`https://cardanoscan.io/transaction/${tx.hash}`} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-500 hover:text-blue-700">
                                  <ExternalLinkIcon className="h-3 w-3" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTransactionTypeClass(tx.type)}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {tx.vehicleId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(tx.block_time).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {(parseInt(tx.fees) / 1000000).toFixed(6)} ₳
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                          <button className="hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                            View
                          </button>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};
export default TransactionHistory;