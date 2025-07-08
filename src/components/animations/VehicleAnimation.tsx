import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { useTheme } from '../../contexts/ThemeContext';
interface VehicleAnimationProps {
  animationPath: string;
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}
const VehicleAnimation: React.FC<VehicleAnimationProps> = ({
  animationPath,
  width = '100%',
  height = '100%',
  loop = true,
  autoplay = true,
  className = ''
}) => {
  const animationContainer = useRef<HTMLDivElement>(null);
  const {
    theme
  } = useTheme();
  useEffect(() => {
    if (!animationContainer.current) return;
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop,
      autoplay,
      path: animationPath
    });
    return () => {
      anim.destroy();
    };
  }, [animationPath, loop, autoplay]);
  return <div ref={animationContainer} style={{
    width,
    height
  }} className={className} />;
};
export default VehicleAnimation;