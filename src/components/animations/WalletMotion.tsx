import React from 'react';
import { motion } from 'framer-motion';
import { WalletIcon, CoinsIcon } from 'lucide-react';
interface WalletMotionProps {
  size?: number;
  showCoins?: boolean;
  className?: string;
}
const WalletMotion: React.FC<WalletMotionProps> = ({
  size = 64,
  showCoins = true,
  className = ''
}) => {
  // Animation variants
  const walletVariants = {
    initial: {
      scale: 1,
      rotate: 0
    },
    animate: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        scale: {
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut'
        },
        rotate: {
          duration: 2,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut'
        }
      }
    }
  };
  const coinVariants = {
    initial: (i: number) => ({
      y: 0,
      x: 0,
      opacity: 0
    }),
    animate: (i: number) => ({
      y: [-10, -30],
      x: [(i - 1) * 5, (i - 1) * 10],
      opacity: [0, 1, 0],
      transition: {
        duration: 1.5,
        delay: i * 0.2,
        repeat: Infinity,
        repeatType: 'loop',
        ease: 'easeOut'
      }
    })
  };
  return <div className={`relative ${className}`} style={{
    width: size,
    height: size
  }}>
      <motion.div variants={walletVariants} initial="initial" animate="animate" className="relative z-10">
        <WalletIcon size={size} className="text-blue-600 dark:text-blue-400" />
      </motion.div>
      {showCoins && <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          {[1, 2, 3].map(i => <motion.div key={`coin-${i}`} custom={i} variants={coinVariants} initial="initial" animate="animate" className="absolute">
              <CoinsIcon size={size / 4} className="text-yellow-500 dark:text-yellow-400" />
            </motion.div>)}
        </div>}
    </div>;
};
export default WalletMotion;