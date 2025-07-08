import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
interface SuccessAnimationProps {
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}
const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  width = '100%',
  height = '100%',
  loop = false,
  autoplay = true,
  className = ''
}) => {
  const animationContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!animationContainer.current) return;
    const anim = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: 'svg',
      loop,
      autoplay,
      path: 'https://assets10.lottiefiles.com/packages/lf20_s2lryxtd.json' // Success animation
    });
    return () => {
      anim.destroy();
    };
  }, [loop, autoplay]);
  return <div ref={animationContainer} style={{
    width,
    height
  }} className={className} />;
};
export default SuccessAnimation;