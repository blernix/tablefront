'use client';

import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Chapter {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ChapterProgressProps {
  chapters: Chapter[];
  activeChapter: number;
  progress: number;
  onChapterClick: (index: number) => void;
  className?: string;
}

export default function ChapterProgress({
  chapters,
  activeChapter,
  progress,
  onChapterClick,
  className = '',
}: ChapterProgressProps) {
  const motionRef = useRef<HTMLDivElement>(null);
  // console.log(`ChapterProgress: activeChapter=${activeChapter}, progress=${progress}`);

  useEffect(() => {
    // console.log(`ChapterProgress mounted`);
    // Debug: log computed styles
    // if (motionRef.current) {
    //   const styles = window.getComputedStyle(motionRef.current);
    //   console.log('ChapterProgress styles:', {
    //     opacity: styles.opacity,
    //     visibility: styles.visibility,
    //     display: styles.display,
    //     transform: styles.transform,
    //   });
    // }
  }, []);

  // Calculate the position of the progress indicator
  const progressHeight = progress * 100;

  return (
    <div className={`fixed right-8 top-1/2 -translate-y-1/2 hidden lg:block z-40 ${className}`}>
      <motion.div
        ref={motionRef}
        initial={{ opacity: 0, x: 40, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.9 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 35,
          mass: 0.8,
        }}
        data-debug="chapter-progress"
      >
        <div className="relative">
          {/* Progress line */}
          <div className="absolute right-3 top-0 bottom-0 w-0.5 bg-gray-200">
            <motion.div
              className="absolute left-0 top-0 w-0.5 bg-[#0066FF]"
              initial={{ height: 0 }}
              animate={{ height: `${progressHeight}%` }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Chapter dots */}
          <div className="relative space-y-8">
            {chapters.map((chapter, index) => {
              const isActive = index === activeChapter;
              const isPast = index < activeChapter;
              const isFuture = index > activeChapter;

              return (
                <motion.button
                  key={chapter.id}
                  onClick={() => onChapterClick(index)}
                  className="relative group flex items-center justify-end"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Chapter info on hover */}
                  <div className="absolute right-12 mr-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-md whitespace-nowrap shadow-lg">
                      <div className="font-medium">{chapter.title}</div>
                      <div className="text-gray-300 text-xs mt-0.5">{chapter.description}</div>
                    </div>
                    <div className="absolute top-1/2 right-0 w-2 h-2 bg-gray-900 transform translate-x-1/2 -translate-y-1/2 rotate-45" />
                  </div>

                  {/* Chapter dot */}
                  <div className="relative">
                    <motion.div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'bg-[#0066FF] border-[#0066FF] scale-125'
                          : isPast
                            ? 'bg-[#0066FF]/20 border-[#0066FF]'
                            : 'bg-white border-gray-300'
                      }`}
                      animate={{
                        scale: isActive ? 1.2 : 1,
                        boxShadow: isActive
                          ? '0 0 0 4px rgba(0, 102, 255, 0.2)'
                          : '0 0 0 0px rgba(0, 102, 255, 0)',
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {isPast ? (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ) : (
                        <span className={`text-xs ${isActive ? 'text-white' : 'text-gray-400'}`}>
                          {chapter.icon || index + 1}
                        </span>
                      )}
                    </motion.div>

                    {/* Connection line for future chapters */}
                    {index < chapters.length - 1 && (
                      <div
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                          isPast ? 'bg-[#0066FF]' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 space-y-2">
            <motion.button
              onClick={() => onChapterClick(Math.max(0, activeChapter - 1))}
              disabled={activeChapter === 0}
              className={`p-2 rounded-full border ${
                activeChapter === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-[#0066FF] hover:text-[#0066FF] hover:bg-[#0066FF]/5'
              } transition-colors`}
              whileHover={activeChapter !== 0 ? { scale: 1.1 } : {}}
              whileTap={activeChapter !== 0 ? { scale: 0.9 } : {}}
            >
              <ChevronUp className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => onChapterClick(Math.min(chapters.length - 1, activeChapter + 1))}
              disabled={activeChapter === chapters.length - 1}
              className={`p-2 rounded-full border ${
                activeChapter === chapters.length - 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-[#0066FF] hover:text-[#0066FF] hover:bg-[#0066FF]/5'
              } transition-colors`}
              whileHover={activeChapter !== chapters.length - 1 ? { scale: 1.1 } : {}}
              whileTap={activeChapter !== chapters.length - 1 ? { scale: 0.9 } : {}}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Current chapter indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute -bottom-16 right-0 text-right"
          >
            <div className="text-xs text-gray-500 mb-1">Étape</div>
            <div className="text-lg font-light text-[#2A2A2A]">
              {activeChapter + 1}/{chapters.length}
            </div>
            <div className="text-sm text-[#666666] font-light mt-0.5 max-w-[200px]">
              {chapters[activeChapter]?.title}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
