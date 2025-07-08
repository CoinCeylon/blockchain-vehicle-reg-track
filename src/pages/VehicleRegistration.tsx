import React, { useState } from 'react';
import { CarIcon, CheckCircleIcon, AlertCircleIcon, UploadIcon, ShieldIcon, FileTextIcon, ClipboardIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SmartContractAnimation from '../components/animations/SmartContractAnimation';
import SuccessAnimation from '../components/animations/SuccessAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import VehicleMotion from '../components/animations/VehicleMotion';
import BlockchainMotion from '../components/animations/BlockchainMotion';
const VehicleRegistration: React.FC = () => {
  const {
    user
  } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    licensePlate: '',
    chassisNumber: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    registrationDate: '',
    documents: {
      proofOfPurchase: null as File | null,
      insurance: null as File | null,
      emissions: null as File | null
    }
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      files
    } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [name]: files[0]
        }
      }));
    }
  };
  const validateStep1 = () => {
    if (!formData.licensePlate || !formData.chassisNumber || !formData.make || !formData.model || !formData.color) {
      setError('Please fill in all required fields');
      return false;
    }
    setError(null);
    return true;
  };
  const validateStep2 = () => {
    if (!formData.documents.proofOfPurchase) {
      setError('Proof of purchase is required');
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
    if (!validateStep1() || !validateStep2()) {
      return;
    }
    // Check if wallet is connected for blockchain registration
    if (!user?.isWalletConnected) {
      setError('Please connect your Cardano wallet to register your vehicle on the blockchain');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to register vehicle. Please try again.');
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
  if (isSuccess) {
    return <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden" variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Vehicle Registration
          </h2>
        </div>
        <div className="p-6 text-center">
          <motion.div className="mx-auto w-48 h-48" initial={{
          scale: 0
        }} animate={{
          scale: 1
        }} transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}>
            <SuccessAnimation width="100%" height="100%" />
          </motion.div>
          <motion.h3 className="mt-3 text-lg font-medium text-gray-900 dark:text-white" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }}>
            Registration Successful!
          </motion.h3>
          <motion.p className="mt-2 text-sm text-gray-500 dark:text-gray-400" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.7
        }}>
            Your vehicle has been successfully registered on the Cardano
            blockchain.
          </motion.p>
          <motion.div className="mt-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-md mx-auto max-w-md" initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: 0.9
        }}>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <ShieldIcon className="h-4 w-4 mr-1 text-blue-500" />
              Blockchain Transaction Details:
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 break-all font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
              Transaction Hash:
              0x7d8f9a67b3c6d4e5f2a1b8c7d6e5f4a3b2c1d8e9f7a6b5c4d3e2f1a8b7c6d5e4f
            </p>
            <div className="mt-2 flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Block: 12345678</span>
              <span>Fee: 0.17 ₳</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                View on Explorer:
              </span>
              <a href="https://cardanoscan.io" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                <img src="https://cardanoscan.io/images/favicon.ico" alt="Cardanoscan" className="h-3 w-3 mr-1" />
                Cardanoscan
              </a>
            </div>
          </motion.div>
          <motion.div className="mt-6 flex flex-col sm:flex-row justify-center gap-4" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 1.1
        }}>
            <motion.button type="button" onClick={() => {
            setIsSuccess(false);
            setStep(1);
            setFormData({
              licensePlate: '',
              chassisNumber: '',
              make: '',
              model: '',
              year: new Date().getFullYear(),
              color: '',
              registrationDate: '',
              documents: {
                proofOfPurchase: null,
                insurance: null,
                emissions: null
              }
            });
          }} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              Register Another Vehicle
            </motion.button>
            <motion.button type="button" onClick={() => window.location.href = '/dashboard'} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
              Go to Dashboard
            </motion.button>
          </motion.div>
        </div>
      </motion.div>;
  }
  return <motion.div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Vehicle Registration
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Register a new vehicle on the Cardano blockchain
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
                  Vehicle Details
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
                  Document Upload
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
                  Blockchain Confirmation
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
            {/* Step 1: Vehicle Details */}
            {step === 1 && <motion.div className="space-y-6" key="step1" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      License Plate *
                    </label>
                    <input type="text" name="licensePlate" id="licensePlate" required value={formData.licensePlate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="chassisNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Chassis Number / VIN *
                    </label>
                    <input type="text" name="chassisNumber" id="chassisNumber" required value={formData.chassisNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Make *
                    </label>
                    <input type="text" name="make" id="make" required value={formData.make} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Model *
                    </label>
                    <input type="text" name="model" id="model" required value={formData.model} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Year *
                    </label>
                    <input type="number" name="year" id="year" required min="1900" max={new Date().getFullYear() + 1} value={formData.year} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Color *
                    </label>
                    <input type="text" name="color" id="color" required value={formData.color} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  <div>
                    <label htmlFor="registrationDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Registration Date
                    </label>
                    <input type="date" name="registrationDate" id="registrationDate" value={formData.registrationDate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                <div className="flex justify-center my-8">
                  <VehicleMotion size={80} />
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Blockchain Registration
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                        <p>
                          All vehicle information will be securely stored on the
                          Cardano blockchain, providing immutable proof of
                          ownership and history. You'll need to connect your
                          wallet and sign the transaction in the final step.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>}
            {/* Step 2: Document Upload */}
            {step === 2 && <motion.div className="space-y-6" key="step2" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FileTextIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Please upload the following documents. They will be
                        stored securely on IPFS and linked to your vehicle's
                        blockchain record.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Proof of Purchase *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {formData.documents.proofOfPurchase ? <motion.div className="flex flex-col items-center" initial={{
                      scale: 0.8,
                      opacity: 0
                    }} animate={{
                      scale: 1,
                      opacity: 1
                    }} transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25
                    }}>
                            <CheckCircleIcon className="h-10 w-10 text-green-500" />
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                              File selected:{' '}
                              {formData.documents.proofOfPurchase.name}
                            </p>
                            <motion.button type="button" onClick={() => setFormData(prev => ({
                        ...prev,
                        documents: {
                          ...prev.documents,
                          proofOfPurchase: null
                        }
                      }))} className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline" whileHover={{
                        scale: 1.05
                      }} whileTap={{
                        scale: 0.95
                      }}>
                              Remove
                            </motion.button>
                          </motion.div> : <>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                              <label htmlFor="proofOfPurchase" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                                <motion.span whileHover={{
                            scale: 1.05
                          }}>
                                  Upload a file
                                </motion.span>
                                <input id="proofOfPurchase" name="proofOfPurchase" type="file" className="sr-only" onChange={handleFileChange} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PDF, PNG, JPG up to 10MB
                            </p>
                          </>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Insurance Document
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {formData.documents.insurance ? <motion.div className="flex flex-col items-center" initial={{
                      scale: 0.8,
                      opacity: 0
                    }} animate={{
                      scale: 1,
                      opacity: 1
                    }} transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25
                    }}>
                            <CheckCircleIcon className="h-10 w-10 text-green-500" />
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                              File selected: {formData.documents.insurance.name}
                            </p>
                            <motion.button type="button" onClick={() => setFormData(prev => ({
                        ...prev,
                        documents: {
                          ...prev.documents,
                          insurance: null
                        }
                      }))} className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline" whileHover={{
                        scale: 1.05
                      }} whileTap={{
                        scale: 0.95
                      }}>
                              Remove
                            </motion.button>
                          </motion.div> : <>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                              <label htmlFor="insurance" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                                <motion.span whileHover={{
                            scale: 1.05
                          }}>
                                  Upload a file
                                </motion.span>
                                <input id="insurance" name="insurance" type="file" className="sr-only" onChange={handleFileChange} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PDF, PNG, JPG up to 10MB
                            </p>
                          </>}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Emissions Certificate
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {formData.documents.emissions ? <motion.div className="flex flex-col items-center" initial={{
                      scale: 0.8,
                      opacity: 0
                    }} animate={{
                      scale: 1,
                      opacity: 1
                    }} transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 25
                    }}>
                            <CheckCircleIcon className="h-10 w-10 text-green-500" />
                            <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                              File selected: {formData.documents.emissions.name}
                            </p>
                            <motion.button type="button" onClick={() => setFormData(prev => ({
                        ...prev,
                        documents: {
                          ...prev.documents,
                          emissions: null
                        }
                      }))} className="mt-2 text-xs text-red-600 dark:text-red-400 hover:underline" whileHover={{
                        scale: 1.05
                      }} whileTap={{
                        scale: 0.95
                      }}>
                              Remove
                            </motion.button>
                          </motion.div> : <>
                            <div className="flex text-sm text-gray-600 dark:text-gray-400">
                              <label htmlFor="emissions" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                                <motion.span whileHover={{
                            scale: 1.05
                          }}>
                                  Upload a file
                                </motion.span>
                                <input id="emissions" name="emissions" type="file" className="sr-only" onChange={handleFileChange} />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              PDF, PNG, JPG up to 10MB
                            </p>
                          </>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md border border-yellow-100 dark:border-yellow-800">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ShieldIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Document Security
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-400">
                        <p>
                          Your documents will be securely stored on IPFS
                          (InterPlanetary File System) and their hashes will be
                          recorded on the Cardano blockchain, ensuring they
                          cannot be tampered with. Only you and authorized
                          officers can access them.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>}
            {/* Step 3: Confirmation */}
            {step === 3 && <motion.div className="space-y-6" key="step3" variants={stepVariants} initial="initial" animate="animate" exit="exit">
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-md">
                  <div className="flex flex-col md:flex-row items-center mb-6">
                    <div className="w-full md:w-1/2 mb-6 md:mb-0">
                      <SmartContractAnimation width="100%" height="200px" />
                    </div>
                    <div className="w-full md:w-1/2 md:pl-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Blockchain Registration Confirmation
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        You're about to register your vehicle on the Cardano
                        blockchain using the Plutus smart contract. This will
                        create a permanent, tamper-proof record of your vehicle
                        ownership.
                      </p>
                      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 mb-2">
                        <img src="https://cryptologos.cc/logos/cardano-ada-logo.png" alt="ADA" className="h-4 w-4 mr-2" />
                        <span>Estimated network fee: 0.17-0.25 ₳</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center my-6">
                    <BlockchainMotion blocks={5} />
                  </div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Review Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Vehicle Details
                      </h5>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        <dt className="text-gray-500 dark:text-gray-400">
                          License Plate:
                        </dt>
                        <dd className="text-gray-900 dark:text-white">
                          {formData.licensePlate}
                        </dd>
                        <dt className="text-gray-500 dark:text-gray-400">
                          Chassis Number:
                        </dt>
                        <dd className="text-gray-900 dark:text-white">
                          {formData.chassisNumber}
                        </dd>
                        <dt className="text-gray-500 dark:text-gray-400">
                          Make:
                        </dt>
                        <dd className="text-gray-900 dark:text-white">
                          {formData.make}
                        </dd>
                        <dt className="text-gray-500 dark:text-gray-400">
                          Model:
                        </dt>
                        <dd className="text-gray-900 dark:text-white">
                          {formData.model}
                        </dd>
                        <dt className="text-gray-500 dark:text-gray-400">
                          Year:
                        </dt>
                        <dd className="text-gray-900 dark:text-white">
                          {formData.year}
                        </dd>
                        <dt className="text-gray-500 dark:text-gray-400">
                          Color:
                        </dt>
                        <dd className="text-gray-900 dark:text-white">
                          {formData.color}
                        </dd>
                      </dl>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Documents
                      </h5>
                      <ul className="space-y-2 text-sm">
                        <motion.li className="flex items-center" initial={{
                      x: -10,
                      opacity: 0
                    }} animate={{
                      x: 0,
                      opacity: 1
                    }} transition={{
                      delay: 0.1
                    }}>
                          <UploadIcon className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-gray-900 dark:text-white">
                            Proof of Purchase:{' '}
                            {formData.documents.proofOfPurchase?.name}
                          </span>
                        </motion.li>
                        {formData.documents.insurance && <motion.li className="flex items-center" initial={{
                      x: -10,
                      opacity: 0
                    }} animate={{
                      x: 0,
                      opacity: 1
                    }} transition={{
                      delay: 0.2
                    }}>
                            <UploadIcon className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-gray-900 dark:text-white">
                              Insurance: {formData.documents.insurance.name}
                            </span>
                          </motion.li>}
                        {formData.documents.emissions && <motion.li className="flex items-center" initial={{
                      x: -10,
                      opacity: 0
                    }} animate={{
                      x: 0,
                      opacity: 1
                    }} transition={{
                      delay: 0.3
                    }}>
                            <UploadIcon className="h-4 w-4 text-green-500 mr-2" />
                            <span className="text-gray-900 dark:text-white">
                              Emissions Certificate:{' '}
                              {formData.documents.emissions.name}
                            </span>
                          </motion.li>}
                      </ul>
                    </div>
                  </div>
                  <motion.div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md border border-blue-100 dark:border-blue-800" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.4
              }}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ClipboardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Smart Contract Details
                        </h3>
                        <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
                          <p className="font-mono bg-blue-100 dark:bg-blue-900/40 p-2 rounded text-xs overflow-x-auto">
                            contract VehicleRegistry(owner: PubKeyHash) {'{'}
                            <br />
                            &nbsp;&nbsp;struct Vehicle {'{'}
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;licensePlate: ByteArray,
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;chassisNumber: ByteArray,
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;make: ByteArray,
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;model: ByteArray,
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;// Other properties
                            <br />
                            &nbsp;&nbsp;{'}'}
                            <br />
                            &nbsp;&nbsp;// Aiken smart contract code...
                            <br />
                            {'}'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div className="mt-6" initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.6
              }}>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="confirm" name="confirm" type="checkbox" required className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="confirm" className="font-medium text-gray-700 dark:text-gray-300">
                          I confirm that the information provided is accurate
                        </label>
                        <p className="text-gray-500 dark:text-gray-400">
                          This will initiate a blockchain transaction to
                          register your vehicle. You'll need to sign the
                          transaction with your connected wallet.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>}
          </AnimatePresence>
          <motion.div className="mt-8 flex justify-between" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
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
              </motion.button> : <motion.button type="submit" disabled={isSubmitting || !user?.isWalletConnected} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed" whileHover={!isSubmitting && user?.isWalletConnected ? {
            scale: 1.05
          } : {}} whileTap={!isSubmitting && user?.isWalletConnected ? {
            scale: 0.95
          } : {}}>
                {isSubmitting ? <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing Blockchain Transaction...
                  </> : !user?.isWalletConnected ? <>
                    <WalletIcon className="-ml-1 mr-2 h-4 w-4" />
                    Connect Wallet to Register
                  </> : <>
                    <CarIcon className="-ml-1 mr-2 h-4 w-4" />
                    Register Vehicle on Blockchain
                  </>}
              </motion.button>}
          </motion.div>
        </form>
      </div>
    </motion.div>;
};
export default VehicleRegistration;