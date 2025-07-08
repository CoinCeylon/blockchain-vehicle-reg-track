import React, { useEffect, useState } from 'react';
import { WalletIcon, ChevronDownIcon, CheckIcon, AlertTriangleIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import WalletAnimation from './animations/WalletAnimation';
const WalletConnect: React.FC = () => {
  const {
    user,
    connectWallet,
    disconnectWallet,
    availableWallets
  } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  const handleConnectWallet = async (walletName?: string) => {
    try {
      setIsConnecting(true);
      setConnectError(null);
      await connectWallet(walletName);
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setConnectError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };
  const handleDisconnectWallet = () => {
    disconnectWallet();
  };
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isDropdownOpen && !target.closest('.wallet-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  if (user?.isWalletConnected) {
    return <div className="relative wallet-dropdown-container">
        <button onClick={toggleDropdown} className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 transition-all hover:bg-green-200 dark:hover:bg-green-800">
          <WalletIcon className="h-4 w-4" />
          <span className="max-w-[100px] truncate">
            {user.walletName || 'Wallet'}
          </span>
          <ChevronDownIcon className="h-4 w-4" />
        </button>
        {isDropdownOpen && <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
              <div className="font-medium text-gray-900 dark:text-white">
                Connected Wallet
              </div>
              <div className="truncate mt-1">{user.walletAddress}</div>
              {user.balance !== undefined && <div className="mt-2 font-medium text-green-600 dark:text-green-400 flex items-center">
                  <img src="https://cryptologos.cc/logos/cardano-ada-logo.png" alt="ADA" className="h-4 w-4 mr-1" />
                  {user.balance.toLocaleString()} ₳
                </div>}
            </div>
            <button onClick={handleDisconnectWallet} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
              Disconnect Wallet
            </button>
          </div>}
      </div>;
  }
  return <div className="relative wallet-dropdown-container">
      <button onClick={toggleDropdown} className="flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
        <WalletIcon className="h-4 w-4" />
        <span>Connect Wallet</span>
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      {isDropdownOpen && <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            <div className="font-medium text-gray-900 dark:text-white">
              Select a Cardano wallet
            </div>
          </div>
          {connectError && <div className="px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-800 flex items-start">
              <AlertTriangleIcon className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
              <span>{connectError}</span>
            </div>}
          {isConnecting ? <div className="px-4 py-3 flex flex-col items-center">
              <WalletAnimation width={80} height={80} />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Connecting to wallet...
              </p>
            </div> : <>
              {availableWallets.length > 0 ? availableWallets.map(wallet => <button key={wallet} onClick={() => handleConnectWallet(wallet)} className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <img src={`https://raw.githubusercontent.com/cardano-foundation/cardano-wallet-connector/main/src/assets/wallets/${wallet.toLowerCase()}.svg`} alt={wallet} className="h-8 w-8 mr-3" onError={e => {
            e.currentTarget.src = 'https://raw.githubusercontent.com/cardano-foundation/cardano-wallet-connector/main/src/assets/wallets/default.svg';
          }} />
                    <div>
                      <div className="font-medium">{wallet}</div>
                      {wallet === 'Lace' && <div className="text-xs text-gray-500 dark:text-gray-400">
                          Recommended for users
                        </div>}
                      {wallet === 'Eternl' && <div className="text-xs text-gray-500 dark:text-gray-400">
                          Recommended for admins/devs
                        </div>}
                    </div>
                  </button>) : <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    No Cardano wallets detected. Please install one of the
                    following:
                  </p>
                  <div className="mt-2 space-y-2">
                    <a href="https://www.lace.io/" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                      <img src="https://www.lace.io/apple-touch-icon.png" alt="Lace" className="h-4 w-4 mr-1" />
                      Lace Wallet
                    </a>
                    <a href="https://eternl.io/app/mainnet/welcome" target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 dark:text-blue-400 hover:underline">
                      <img src="https://eternl.io/app/apple-touch-icon.png" alt="Eternl" className="h-4 w-4 mr-1" />
                      Eternl Wallet
                    </a>
                  </div>
                </div>}
            </>}
        </div>}
    </div>;
};
export default WalletConnect;