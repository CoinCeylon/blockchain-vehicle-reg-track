import React from 'react';
import { motion } from 'framer-motion';
interface BlockchainMotionProps {
  blocks?: number;
  size?: number;
  className?: string;
}
const BlockchainMotion: React.FC<BlockchainMotionProps> = ({
  blocks = 5,
  size = 60,
  className = ''
}) => {

  const blockIndices = Array.from({
    length: blocks
  }, (_, i) => i);
  // Animation variants for blocks
  const blockVariants = {
    initial: (i: number) => ({
      y: 0,
      x: i * (size * 0.8),
      opacity: 0.5 + i * 0.1,
      scale: 1
    }),
    animate: (i: number) => ({
      y: [0, -10, 0],
      x: i * (size * 0.8),
      opacity: 0.5 + i * 0.1,
      scale: [1, 1.05, 1],
      transition: {
        y: {
          delay: i * 0.2,
          duration: 1,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut'
        },
        scale: {
          delay: i * 0.2,
          duration: 1,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut'
        }
      }
    })
  };

  const linkVariants = {
    initial: (i: number) => ({
      x: i * (size * 0.8) + size * 0.5,
      opacity: 0.7,
      width: size * 0.3
    }),
    animate: (i: number) => ({
      x: i * (size * 0.8) + size * 0.5,
      opacity: [0.7, 1, 0.7],
      width: size * 0.3,
      transition: {
        opacity: {
          delay: i * 0.2,
          duration: 1,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut'
        }
      }
    })
  };
  return <div className={`relative ${className}`} style={{
    height: size,
    width: blocks * size
  }}>
      {/* Blocks */}
      {blockIndices.map(i => <motion.div key={`block-${i}`} custom={i} variants={blockVariants} initial="initial" animate="animate" className="absolute bg-blue-500 dark:bg-blue-600 rounded-lg flex items-center justify-center" style={{
      width: size,
      height: size
    }}>
          <div className="text-white font-mono text-xs">{i + 1}</div>
        </motion.div>)}
      {}
      {blockIndices.slice(0, -1).map(i => <motion.div key={`link-${i}`} custom={i} variants={linkVariants} initial="initial" animate="animate" className="absolute top-1/2 h-1 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700" style={{
      transform: 'translateY(-50%)'
    }} />)}
    </div>;
};
export default BlockchainMotion;