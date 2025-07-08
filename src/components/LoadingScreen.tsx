import React, { useEffect, useState } from 'react';
import { CarIcon, ShieldIcon, LockIcon } from 'lucide-react';
import CardanoAnimation from './animations/CardanoAnimation';
const LoadingScreen: React.FC = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);
  return <div className="fixed inset-0 bg-gradient-to-br from-blue-900 to-black flex flex-col items-center justify-center">
      <div className="relative">
        <div className="text-5xl font-bold text-white mb-4 relative z-10 flex items-center">
          <CardanoAnimation width={60} height={60} className="mr-2" />
          Vehicrypt
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-32 h-32 rounded-full bg-blue-500 animate-pulse"></div>
        </div>
      </div>
      <div className="flex items-center space-x-4 mt-6">
        <div className="animate-bounce delay-100">
          <CarIcon size={32} className="text-white" />
        </div>
        <div className="animate-bounce delay-200">
          <ShieldIcon size={32} className="text-white" />
        </div>
        <div className="animate-bounce delay-300">
          <LockIcon size={32} className="text-white" />
        </div>
      </div>
      <div className="mt-8 text-white font-light text-lg">
        Blockchain Vehicle Registration System
      </div>
      <div className="mt-8 w-64">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all duration-200" style={{
          width: `${loadingProgress}%`
        }}></div>
        </div>
        <div className="mt-2 text-center text-sm text-blue-300">
          {loadingProgress < 100 ? 'Connecting to Cardano blockchain...' : 'Connected!'}
        </div>
      </div>
    </div>;
};
export default LoadingScreen;