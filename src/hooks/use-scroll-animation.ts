'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    triggerOnce = true,
    delay = 0,
  } = options;

  const ref = useRef<T>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Skip if already animated and triggerOnce is true
    if (triggerOnce && hasAnimated) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsInView(true);
              setHasAnimated(true);
            }, delay);
          } else {
            setIsInView(true);
            setHasAnimated(true);
          }

          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated]);

  return { ref, isInView };
}

// Hook for animating multiple children with staggered delays
export function useStaggerAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollAnimationOptions & { staggerDelay?: number } = {}
) {
  const { staggerDelay = 100, ...scrollOptions } = options;
  const { ref, isInView } = useScrollAnimation<T>(scrollOptions);

  return {
    ref,
    isInView,
    getStaggerStyle: (index: number) => ({
      transitionDelay: isInView ? `${index * staggerDelay}ms` : '0ms',
    }),
  };
}

// Component wrapper for scroll animations
interface AnimateOnScrollProps {
  children: React.ReactNode;
  animation?: 'fade-up' | 'slide-left' | 'slide-right' | 'scale-up' | 'blur-in';
  delay?: number;
  className?: string;
  threshold?: number;
}

export function useAnimationClasses(
  isInView: boolean,
  animation: AnimateOnScrollProps['animation'] = 'fade-up'
): string {
  const baseClass = 'animate-on-scroll';
  const animationClass = animation !== 'fade-up' ? animation : '';
  const viewClass = isInView ? 'in-view' : '';

  return [baseClass, animationClass, viewClass].filter(Boolean).join(' ');
}

// Utility to create animation variants
export const animationVariants = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0)' },
  },
};

// Smooth easing functions
export const easings = {
  smooth: 'cubic-bezier(0.16, 1, 0.3, 1)',
  bounceSoft: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
};
