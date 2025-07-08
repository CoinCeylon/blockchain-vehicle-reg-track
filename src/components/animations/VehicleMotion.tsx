import React from 'react';
import { motion } from 'framer-motion';
import { CarIcon } from 'lucide-react';
interface VehicleMotionProps {
  size?: number;
  color?: string;
  animate?: boolean;
  className?: string;
}
const VehicleMotion: React.FC<VehicleMotionProps> = ({
  size = 64,
  color = 'currentColor',
  animate = true,
  className = ''
}) => {
  // Animation variants
  const containerVariants = {
    idle: {
      x: 0,
      transition: {
        duration: 0.5
      }
    },
    animate: {
      x: [0, 10, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'easeInOut'
      }
    }
  };
  const wheelVariants = {
    idle: {
      rotate: 0,
      transition: {
        duration: 0.5
      }
    },
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'linear'
      }
    }
  };
  return <motion.div className={`relative ${className}`} variants={containerVariants} initial="idle" animate={animate ? 'animate' : 'idle'} style={{
    width: size,
    height: size
  }}>
      <CarIcon size={size} color={color} className="relative z-10" />
      {/* Front wheel animation */}
      <motion.div className="absolute bottom-0 left-1/4 bg-gray-800 dark:bg-gray-200 rounded-full z-0" style={{
      width: size / 8,
      height: size / 8
    }} variants={wheelVariants} initial="idle" animate={animate ? 'animate' : 'idle'} />
      {/* Rear wheel animation */}
      <motion.div className="absolute bottom-0 right-1/4 bg-gray-800 dark:bg-gray-200 rounded-full z-0" style={{
      width: size / 8,
      height: size / 8
    }} variants={wheelVariants} initial="idle" animate={animate ? 'animate' : 'idle'} />
    </motion.div>;
};
export default VehicleMotion;