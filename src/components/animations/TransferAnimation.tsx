import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
interface TransferAnimationProps {
  width?: number | string;
  height?: number | string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}
const TransferAnimation: React.FC<TransferAnimationProps> = ({
  width = '100%',
  height = '100%',
  loop = true,
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
      path: 'https://assets3.lottiefiles.com/packages/lf20_nk5rxdja.json' 
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
export default TransferAnimation;