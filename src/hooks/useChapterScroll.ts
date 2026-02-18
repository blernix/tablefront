'use client';

import { useState, useEffect, useRef } from 'react';
import { useScroll, useSpring, useInView, useTransform } from 'framer-motion';

interface UseChapterScrollProps {
  chapterCount: number;
  chapterHeight?: number;
  offset?: number;
  intersectionThreshold?: number;
}

export function useChapterScroll({
  chapterCount,
  chapterHeight = 100,
  offset = 0.3,
  intersectionThreshold = 0.2,
}: UseChapterScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  // 1. Track scroll progress of the container (simplified for chapter snapping)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'], // Start-based snapping (cohérence avec DemoChapter)
  });

  // 2. Smooth the progress value for chapter detection
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 40,
    restDelta: 0.001,
  });

  // 3. Detect if section is in viewport
  const isInView = useInView(containerRef, {
    amount: 'some',
    once: false,
  });

  useEffect(() => {
    // console.log(`useChapterScroll: isInView changed to ${isInView}`);
    setIsSectionVisible(isInView);
  }, [isInView]);

  // 4. Compute active chapter based on scroll position (snap to chapters)
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (latest) => {
      const chapterIndex = Math.min(Math.floor(latest * chapterCount), chapterCount - 1);
      setActiveChapter(chapterIndex);
    });
    return () => unsubscribe();
  }, [smoothProgress, chapterCount]);

  // 5. Function to scroll to a specific chapter
  const scrollToChapter = (index: number) => {
    if (!containerRef.current) return;

    const children = Array.from(containerRef.current.children);
    const targetElement = children[index] as HTMLElement;

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return {
    containerRef,
    activeChapter,
    progress: smoothProgress,
    chapterProgress: 0, // Not used in hybrid approach
    isSectionVisible,
    scrollToChapter,
  };
}
