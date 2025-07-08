import React, { Children } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckCircleIcon } from 'lucide-react';
interface TransactionMotionProps {
  width?: number;
  height?: number;
  status?: 'pending' | 'complete' | 'failed';
  className?: string;
}
const TransactionMotion: React.FC<TransactionMotionProps> = ({
  width = 200,
  height = 80,
  status = 'pending',
  className = ''
}) => {
  // Animation variants
  const containerVariants = {
    initial: {
      opacity: 1
    },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  const dataBlockVariants = {
    initial: {
      x: 0,
      opacity: 0
    },
    animate: {
      x: width * 0.6,
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: status === 'pending' ? Infinity : 0,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    }
  };
  const arrowVariants = {
    initial: {
      scale: 1,
      opacity: 0.7
    },
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: status === 'pending' ? Infinity : 0,
        repeatType: 'loop',
        ease: 'easeInOut'
      }
    }
  };
  const successVariants = {
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10
      }
    }
  };
  const failedVariants = {
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1,
      rotate: [0, 10, -10, 0],
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10,
        rotate: {
          duration: 0.5,
          repeat: 1,
          ease: 'easeInOut'
        }
      }
    }
  };
  return <motion.div className={`relative ${className}`} style={{
    width,
    height
  }} variants={containerVariants} initial="initial" animate="animate">
      {/* Source */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-500 dark:bg-blue-600 rounded-lg w-16 h-16 flex items-center justify-center">
        <div className="text-white font-mono text-xs">Source</div>
      </div>
      {/* Destination */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-green-500 dark:bg-green-600 rounded-lg w-16 h-16 flex items-center justify-center">
        <div className="text-white font-mono text-xs">Dest</div>
      </div>
      {/* Arrow */}
      <motion.div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" variants={arrowVariants}>
        <ArrowRightIcon size={24} className="text-gray-600 dark:text-gray-300" />
      </motion.div>
      {/* Data blocks */}
      {status === 'pending' && <>
          <motion.div className="absolute top-1/4 left-0 bg-blue-300 dark:bg-blue-700 w-8 h-4 rounded" variants={dataBlockVariants} custom={1} />
          <motion.div className="absolute top-1/2 left-0 bg-blue-300 dark:bg-blue-700 w-6 h-3 rounded" variants={dataBlockVariants} custom={2} />
          <motion.div className="absolute top-3/4 left-0 bg-blue-300 dark:bg-blue-700 w-10 h-5 rounded" variants={dataBlockVariants} custom={3} />
        </>}
      {/* Success indicator */}
      {status === 'complete' && <motion.div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" variants={successVariants}>
          <CheckCircleIcon size={32} className="text-green-500 dark:text-green-400" />
        </motion.div>}
      {/* Failed indicator */}
      {status === 'failed' && <motion.div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" variants={failedVariants}>
          <div className="text-red-500 dark:text-red-400 text-2xl font-bold">
            ✕
          </div>
        </motion.div>}
    </motion.div>;
};
export default TransactionMotion;