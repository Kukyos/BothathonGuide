import React from 'react';
import * as math from 'mathjs';

interface GradualBlurProps {
  target?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  height?: string;
  strength?: number;
  divCount?: number;
  curve?: 'bezier' | 'linear';
  exponential?: boolean;
  opacity?: number;
}

export default function GradualBlur({
  target = 'parent',
  position = 'bottom',
  height = '7rem',
  strength = 2,
  divCount = 5,
  curve = 'bezier',
  exponential = true,
  opacity = 1
}: GradualBlurProps) {
  
  const getGradientDirection = () => {
    switch (position) {
      case 'top': return 'to bottom';
      case 'bottom': return 'to top';
      case 'left': return 'to right';
      case 'right': return 'to left';
      default: return 'to top';
    }
  };

  const divs = Array.from({ length: divCount }).map((_, i) => {
    // Basic bezier/exponential math logic matching the generic API
    const fraction = (i + 1) / divCount;
    // We use math.pow as requested by the user's import requirement
    const power = curve === 'bezier' ? 2 : 1;
    const blurAmount = exponential 
        ? math.evaluate(`${fraction} ^ ${power} * ${strength}`) 
        : fraction * strength;
        
    const isVertical = position === 'top' || position === 'bottom';
    
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: position === 'top' ? 0 : (isVertical ? 'auto' : 0),
          bottom: position === 'bottom' ? 0 : (isVertical ? 'auto' : 0),
          left: position === 'left' ? 0 : (isVertical ? 0 : 'auto'),
          right: position === 'right' ? 0 : (isVertical ? 0 : 'auto'),
          width: isVertical ? '100%' : height,
          height: isVertical ? height : '100%',
          zIndex: 10 + i,
          pointerEvents: 'none',
          backdropFilter: `blur(${blurAmount}px)`,
          WebkitBackdropFilter: `blur(${blurAmount}px)`,
          maskImage: `linear-gradient(${getGradientDirection()}, rgba(0,0,0,1) ${(i / divCount) * 100}%, rgba(0,0,0,0) ${((i+1) / divCount) * 100}%)`,
          WebkitMaskImage: `linear-gradient(${getGradientDirection()}, rgba(0,0,0,1) ${(i / divCount) * 100}%, rgba(0,0,0,0) ${((i+1) / divCount) * 100}%)`,
          opacity: opacity
        }}
      />
    );
  });

  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>{divs}</div>;
}
