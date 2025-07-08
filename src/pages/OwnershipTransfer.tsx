import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CarIcon, ArrowRightIcon, WalletIcon, AlertCircleIcon, CheckCircleIcon, UserIcon, ShieldIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import BlockchainAnimation from '../components/animations/BlockchainAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import TransactionMotion from '../components/animations/TransactionMotion';
import VehicleMotion from '../components/animations/VehicleMotion';
import WalletMotion from '../components/animations/WalletMotion';
const OwnershipTransfer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user
  } = useAuth();
  // Get vehicle ID from query params
  const queryParams = new URLSearchParams(location.search);
  const vehicleId = queryParams.get('id');
  const [vehicle, setVehicle] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    recipientAddress: '',
    transferReason: '',
    transferFee: '10',
    confirmTransfer: false
  });
  useEffect(() => {
    // Fetch vehicle details if ID is provided
    if (vehicleId) {
      const fetchVehicleDetails = async () => {
        try {
          setIsLoading(true);
        
          await new Promise(resolve => setTimeout(resolve, 1000));
          // vehicle data
          setVehicle({
            id: vehicleId,
            licensePlate: vehicleId,
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            color: 'Blue',
            owner: {
              username: user?.username || 'john_doe',
              walletAddress: user?.walletAddress || 'addr1q8v42wjda8r6mpfj40d36p2n7k7y784qgfnrxh4cs6ezl6yv7nklpf85xwjdmrr6q2a5mfsufwwtnrwklvpxmn5rl3gs6h82xj'
            }
          });
        } catch (error) {
          console.error('Error fetching vehicle details:', error);
          setError('Failed to load vehicle details');
        } finally {
          setIsLoading(false);
        }
      };
      fetchVehicleDetails();
    } else {
      setIsLoading(false);
    }
  }, [vehicleId, user]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value,
      type
    } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const validateStep1 = () => {
    if (!formData.recipientAddress) {
      setError('Recipient wallet address is required');
      return false;
    }
    if (!formData.recipientAddress.startsWith('addr1')) {
      setError('Please enter a valid Cardano wallet address');
      return false;
    }
    setError(null);
    return true;
  };
  const validateStep2 = () => {
    if (!formData.transferReason) {
      setError('Please provide a reason for the transfer');
      return false;
    }
    setError(null);
    return true;
  };
  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.confirmTransfer) {
      setError('Please confirm the transfer');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {

      await new Promise(resolve => setTimeout(resolve, 3000));
     
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to transfer vehicle ownership. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };
  const stepVariants = {
    initial: {
      opacity: 0,
      x: 50
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      x: -50,
      transition: {
        duration: 0.3
      }
    }
  };
  if (isLoading) {
    return <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px]" initial={{
      opacity: 0
    }} animate={{
      opacity: 1
    }} transition={{
      duration: 0.5
    }}>
        <BlockchainAnimation width={150} height={150} />
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Loading vehicle details from blockchain...
        </p>
      </motion.div>;
  }
  if (!vehicle && vehicleId) {
    return <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center" variants={pageVariants} initial="initial" animate="animate">
        <motion.div initial={{
        scale: 0
      }} animate={{
        scale: 1
      }} transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20
      }}>
          <AlertCircleIcon className="mx-auto h-12 w-12 text-red-500" />
        </motion.div>
        <motion.h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2
      }}>
          Vehicle not found
        </motion.h3>
        <motion.p className="mt-1 text-gray-500 dark:text-gray-400" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.3
      }}>
          The vehicle with ID {vehicleId} could not be found or you don't have
          permission to transfer it.
        </motion.p>
        <motion.div className="mt-6" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.4
      }}>
          <motion.button onClick={() => navigate('/dashboard')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
            Return to Dashboard
          </motion.button>
        </motion.div>
      </motion.div>;
  }
  if (isSuccess) {
    return <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden" variants={pageVariants} initial="initial" animate="animate">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Ownership Transfer
          </h2>
        </div>
        <div className="p-6 text-center">
          <motion.div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900" initial={{
          scale: 0
        }} animate={{
          scale: 1,
          rotate: [0, 360]
        }} transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
          rotate: {
            duration: 1
          }
        }}>
            <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
          </motion.div>
          <motion.h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.3
        }}>
            Transfer Successful!
          </motion.h3>
          <motion.p className="mt-2 text-sm text-gray-500 dark:text-gray-400" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.4
        }}>
            The vehicle ownership has been successfully transferred on the
            blockchain.
          </motion.p>
          <motion.div className="mt-6 flex justify-center" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }}>
            <TransactionMotion width={250} height={100} status="complete" />
          </motion.div>
          <motion.div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-md mx-auto max-w-md" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.6
        }}>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <CarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <ArrowRightIcon className="h-5 w-5 text-gray-400" />
              <div className="flex-shrink-0 h-10 w-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <WalletIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transaction Details:
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all">
              Transaction Hash:
              0x7d8f9a67b3c6d4e5f2a1b8c7d6e5f4a3b2c1d8e9f7a6b5c4d3e2f1a8b7c6d5e4f
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Block Number: 12345678
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Fee: {formData.transferFee} ADA
            </p>
          </motion.div>
          <motion.div className="mt-6" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.8
        }}>
            <motion.button type="button" onClick={() => navigate('/dashboard')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              Return to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </motion.div>;
  }
  return <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden" variants={pageVariants} initial="initial" animate="animate">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {vehicle ? `Transfer Ownership: ${vehicle.make} ${vehicle.model}` : 'Transfer Vehicle Ownership'}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Transfer vehicle ownership securely using blockchain
        </p>
      </div>
      <div className="p-6">
        {/* Progress steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <motion.div className="flex items-center" initial={{
            opacity: 0.6
          }} animate={{
            opacity: step >= 1 ? 1 : 0.6
          }}>
              <div className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                1
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${step >= 1 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  Recipient Details
                </p>
              </div>
            </motion.div>
            <motion.div className={`flex-grow border-t mx-4`} initial={{
            borderColor: '#e5e7eb'
          }} animate={{
            borderColor: step >= 2 ? '#2563eb' : '#e5e7eb',
            borderTopWidth: step >= 2 ? '2px' : '1px'
          }} transition={{
            duration: 0.3
          }}></motion.div>
            <motion.div className="flex items-center" initial={{
            opacity: 0.6
          }} animate={{
            opacity: step >= 2 ? 1 : 0.6
          }}>
              <div className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                2
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${step >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  Transfer Details
                </p>
              </div>
            </motion.div>
            <motion.div className={`flex-grow border-t mx-4`} initial={{
            borderColor: '#e5e7eb'
          }} animate={{
            borderColor: step >= 3 ? '#2563eb' : '#e5e7eb',
            borderTopWidth: step >= 3 ? '2px' : '1px'
          }} transition={{
            duration: 0.3
          }}></motion.div>
            <motion.div className="flex items-center" initial={{
            opacity: 0.6
          }} animate={{
            opacity: step >= 3 ? 1 : 0.6
          }}>
              <div className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
                3
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${step >= 3 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                  Confirmation
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        {error && <motion.div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md p-4" initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}>
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
          </motion.div>}
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* Step 1: Recipient Details */}
            {step === 1 && <motion.div className="space-y-6" key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                {vehicle && <motion.div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.1
            }}>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Vehicle Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Vehicle ID:
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {vehicle.id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          License Plate:
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {vehicle.licensePlate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Make & Model:
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {vehicle.make} {vehicle.model}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Year:
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {vehicle.year}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center mt-4">
                      <VehicleMotion size={60} />
                    </div>
                  </motion.div>}
                <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2
            }}>
                  <label htmlFor="recipientAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recipient Wallet Address *
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <WalletIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" name="recipientAddress" id="recipientAddress" required value={formData.recipientAddress} onChange={handleChange} placeholder="addr1..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Enter the Cardano wallet address of the new owner
                  </p>
                </motion.div>
                <motion.div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-100 dark:border-yellow-800" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.3
            }}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Important Information
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                        <p>
                          Make sure the recipient's wallet address is correct.
                          Once the transfer is confirmed on the blockchain, it
                          cannot be reversed.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>}
            {/* Step 2: Transfer Details */}
            {step === 2 && <motion.div className="space-y-6" key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.1
            }}>
                  <label htmlFor="transferReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reason for Transfer *
                  </label>
                  <div className="mt-1">
                    <textarea id="transferReason" name="transferReason" rows={3} required value={formData.transferReason} onChange={handleChange} className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="e.g., Sale, Gift, etc." />
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    This information will be stored on the blockchain as part of
                    the transfer record
                  </p>
                </motion.div>
                <motion.div initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.2
            }}>
                  <label htmlFor="transferFee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transfer Fee (ADA)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input type="number" name="transferFee" id="transferFee" min="5" step="0.1" required value={formData.transferFee} onChange={handleChange} className="block w-full pr-12 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 dark:text-gray-400 sm:text-sm">
                        ADA
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Standard network fee for processing the blockchain
                    transaction
                  </p>
                </motion.div>
                <motion.div className="flex justify-center my-6" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} transition={{
              delay: 0.3
            }}>
                  <TransactionMotion width={250} height={100} status="pending" />
                </motion.div>
                <motion.div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.4
            }}>
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">
                    Transfer Summary
                  </h3>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                    <dt className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      From:
                    </dt>
                    <dd className="text-sm text-blue-700 dark:text-blue-400">
                      {vehicle?.owner.username || user?.username || 'Current Owner'}
                    </dd>
                    <dt className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      To:
                    </dt>
                    <dd className="text-sm text-blue-700 dark:text-blue-400 truncate">
                      {formData.recipientAddress.substring(0, 20)}...
                    </dd>
                    <dt className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      Vehicle:
                    </dt>
                    <dd className="text-sm text-blue-700 dark:text-blue-400">
                      {vehicle ? `${vehicle.make} ${vehicle.model}` : 'Selected Vehicle'}
                    </dd>
                    <dt className="text-sm font-medium text-blue-700 dark:text-blue-400">
                      Fee:
                    </dt>
                    <dd className="text-sm text-blue-700 dark:text-blue-400">
                      {formData.transferFee} ADA
                    </dd>
                  </dl>
                </motion.div>
              </motion.div>}
            {/* Step 3: Confirmation */}
            {step === 3 && <motion.div className="space-y-6" key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <motion.div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-md" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.1
            }}>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Confirm Transfer
                  </h3>
                  <motion.div className="flex items-center justify-center space-x-8 mb-6" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.2
              }}>
                    <div className="flex flex-col items-center">
                      <VehicleMotion size={60} />
                      <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Your Vehicle
                      </span>
                    </div>
                    <motion.div animate={{
                  x: [0, 10, 0]
                }} transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop'
                }}>
                      <ArrowRightIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
                    </motion.div>
                    <div className="flex flex-col items-center">
                      <WalletMotion size={60} />
                      <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        New Owner
                      </span>
                    </div>
                  </motion.div>
                  <motion.dl className="grid grid-cols-1 gap-y-4" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.3
              }}>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Vehicle:
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.year})` : 'Selected Vehicle'}
                      </dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        License Plate:
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {vehicle?.licensePlate || 'N/A'}
                      </dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Recipient Address:
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 break-all">
                        {formData.recipientAddress}
                      </dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Reason:
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formData.transferReason}
                      </dd>
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Fee:
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                        {formData.transferFee} ADA
                      </dd>
                    </div>
                  </motion.dl>
                  <motion.div className="mt-6" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.4
              }}>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="confirmTransfer" name="confirmTransfer" type="checkbox" checked={formData.confirmTransfer as boolean} onChange={handleChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="confirmTransfer" className="font-medium text-gray-700 dark:text-gray-300">
                          I confirm this transfer is correct
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          By confirming, you agree to transfer ownership of this
                          vehicle on the blockchain. This action cannot be
                          reversed.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
                <motion.div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-100 dark:border-yellow-800" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.5
            }}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Important: Wallet Connection Required
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                        <p>
                          You need to connect your Cardano wallet to sign this
                          transaction. Make sure your wallet is connected and
                          has sufficient ADA for the transfer fee.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>}
          </AnimatePresence>
          <motion.div className="mt-8 flex justify-between" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.6
        }}>
            {step > 1 && <motion.button type="button" onClick={prevStep} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                Back
              </motion.button>}
            {step < 3 ? <motion.button type="button" onClick={nextStep} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                Next
              </motion.button> : <motion.button type="submit" disabled={isSubmitting || !formData.confirmTransfer} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" whileHover={!isSubmitting && formData.confirmTransfer ? {
            scale: 1.05
          } : {}} whileTap={!isSubmitting && formData.confirmTransfer ? {
            scale: 0.95
          } : {}}>
                {isSubmitting ? <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </> : <>
                    <ArrowRightIcon className="-ml-1 mr-2 h-4 w-4" />
                    Transfer Ownership
                  </>}
              </motion.button>}
          </motion.div>
        </form>
      </div>
    </motion.div>;
};
export default OwnershipTransfer;