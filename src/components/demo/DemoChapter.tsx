'use client';

import { motion, useInView, useScroll, useTransform, useMotionValue } from 'framer-motion';
import { ReactNode, cloneElement, isValidElement, useRef, useEffect, useState } from 'react';

interface DemoChapterProps {
  id: number;
  title: string;
  description: string;
  detailedDescription?: string;
  demoComponent: ReactNode;
  icon?: ReactNode;
  isActive: boolean; // Keep for backward compatibility
  isPast?: boolean;
  isFuture?: boolean;
  sectionActive?: boolean;
  invertLayout?: boolean;
  scrollProgress?: number; // Keep for backward compatibility
  className?: string;
  features?: Array<{ title: string; description: string }>;
}

export default function DemoChapter({
  id,
  title,
  description,
  detailedDescription,
  demoComponent,
  icon,
  isActive: externalIsActive,
  isPast = false,
  isFuture = false,
  sectionActive = true,
  invertLayout = false,
  scrollProgress: externalScrollProgress,
  className = '',
  features = [],
}: DemoChapterProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Detect if this chapter is in viewport
  const isInView = useInView(ref, {
    margin: '0px 0px 0px 0px', // Pas de marge spéciale
    amount: 0.2, // 20% visible pour être considéré actif (plus permissif)
  });

  // Local scroll progress within this chapter
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'], // localProgress=0: haut en haut, localProgress=1: bas en bas
  });

  // Smooth local progress for animations
  const localProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // State to track if animation has been completed (once)
  const [hasBeenAnimated, setHasBeenAnimated] = useState(false);
  const hasBeenAnimatedMotion = useMotionValue<number>(0); // 0 = not animated, 1 = animated

  // Debug: log progress values
  useEffect(() => {
    const unsubscribe = localProgress.on('change', (latest) => {
      // console.log(`DemoChapter ${id}: localProgress=${latest}, isInView=${isInView}`);

      // Mark as animated once we've reached 50% progress (widget fully visible)
      if (!hasBeenAnimated && latest > 0.5) {
        setHasBeenAnimated(true);
        hasBeenAnimatedMotion.set(1);
      }
    });
    return () => unsubscribe();
  }, [localProgress, isInView, id, hasBeenAnimated, hasBeenAnimatedMotion]);

  // Sync motion value with state
  useEffect(() => {
    hasBeenAnimatedMotion.set(hasBeenAnimated ? 1 : 0);
  }, [hasBeenAnimated, hasBeenAnimatedMotion]);

  // Widget animation values - directly controlled
  const widgetOpacity = useMotionValue(0);
  const widgetScale = useMotionValue(0.8);
  const widgetTranslateY = useMotionValue(50);

  // Text animation values
  const textOpacity = useTransform(localProgress, [0, 0.15, 0.5, 1], [0, 0, 1, 1]);
  const textTranslateX = useTransform(
    localProgress,
    [0, 0.2, 0.5, 1],
    [
      invertLayout ? -100 : 100,
      invertLayout ? -100 : 100,
      invertLayout ? -20 : 20,
      invertLayout ? -20 : 20,
    ]
  );

  // Flag pour savoir si l'animation est complète (localProgress > 0.9)
  const isAnimationComplete = useTransform(localProgress, [0, 0.9, 1], [0, 1, 1]);

  // Update widget animations based on scroll progress and persistence state
  useEffect(() => {
    const unsubscribe = localProgress.on('change', (latest) => {
      if (hasBeenAnimated) {
        // Widget already seen - lock at final values
        widgetOpacity.set(1);
        widgetScale.set(1);
        widgetTranslateY.set(0);
      } else {
        // Calculate based on scroll progress
        // Opacity: 0 until 0.1, then linear to 1 at 0.5
        const opacity = latest < 0.1 ? 0 : latest < 0.5 ? (latest - 0.1) / 0.4 : 1;

        // Scale: 0.8 until 0.15, then linear to 1 at 0.5
        const scale = latest < 0.15 ? 0.8 : latest < 0.5 ? 0.8 + (latest - 0.15) * (0.2 / 0.35) : 1;

        // TranslateY: 50 until 0.2, then linear to 0 at 0.5
        const translateY = latest < 0.2 ? 50 : latest < 0.5 ? 50 * (1 - (latest - 0.2) / 0.3) : 0;

        widgetOpacity.set(opacity);
        widgetScale.set(scale);
        widgetTranslateY.set(translateY);
      }
    });
    return () => unsubscribe();
  }, [localProgress, hasBeenAnimated, widgetOpacity, widgetScale, widgetTranslateY]);

  // Priorité : isActive externe (du parent) > détection locale
  // Si externalIsActive est fourni, on l'utilise, sinon on utilise isInView
  const isActive = externalIsActive !== undefined ? externalIsActive : isInView;

  // Pour les enfants : animer si déjà vu OU si actif
  const shouldAnimate = hasBeenAnimated || isActive;

  // Conditions pour afficher les éléments (persistant une fois vu)
  const shouldShow = hasBeenAnimated || isActive;
  const shouldShowWithSection = hasBeenAnimated || (sectionActive && isActive);

  // Text animations with persistence
  const finalTextOpacity = useTransform(
    [textOpacity, isAnimationComplete, hasBeenAnimatedMotion],
    (values) => {
      const [opacity, complete, animated] = values as [number, number, number];
      return animated > 0.5 || complete > 0.99 ? 1 : opacity;
    }
  );
  const finalTextTranslateX = useTransform(
    [textTranslateX, isAnimationComplete, hasBeenAnimatedMotion],
    (values) => {
      const [translateX, complete, animated] = values as [number, number, number];
      return animated > 0.5 || complete > 0.99 ? (invertLayout ? -20 : 20) : translateX;
    }
  );

  // Pas utilisé dans l'approche hybride
  const localIsPast = false;
  const localIsFuture = false;

  return (
    <motion.div
      ref={ref}
      className={`relative min-h-screen flex items-center justify-center py-12 ${className}`}
      initial={false}
      animate={{
        opacity: sectionActive ? (shouldShow ? 1 : 0.95) : 0.95,
        scale: sectionActive ? (shouldShow ? 1 : 0.95) : 0.95,
        y: sectionActive ? (shouldShow ? 0 : 10) : 0,
      }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
      }}
      style={{
        willChange: 'opacity, transform',
      }}
    >
      {/* Background decorative element */}
      {shouldShow && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.02 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute left-1/4 top-1/4 w-64 h-64 rounded-full bg-[#0066FF] blur-3xl" />
          <div className="absolute right-1/4 bottom-1/4 w-48 h-48 rounded-full bg-[#0052CC] blur-3xl" />
        </motion.div>
      )}

      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Demo visualization */}
          <div
            className={`relative flex flex-col justify-center ${invertLayout ? 'lg:order-2' : 'lg:order-1'}`}
          >
            {/* Demo container */}
            <motion.div
              className="relative bg-white rounded-2xl border border-gray-200 shadow-xl p-6 lg:p-8"
              animate={{
                boxShadow: shouldShowWithSection
                  ? '0 25px 50px -12px rgba(0, 102, 255, 0.15)'
                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                borderColor: shouldShowWithSection ? '#0066FF' : '#E5E5E5',
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Demo content */}
              <div className="min-h-64 md:min-h-80 flex items-center justify-center">
                <motion.div
                  key={id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  style={{
                    opacity: widgetOpacity,
                    scale: widgetScale,
                    y: widgetTranslateY,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="w-full"
                >
                  {isValidElement(demoComponent)
                    ? cloneElement(demoComponent, { isActive: shouldAnimate })
                    : demoComponent}
                </motion.div>
              </div>

              {/* Interactive hint for active chapter */}
              {sectionActive && isActive && (
                <motion.div
                  className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: 1,
                  }}
                >
                  <div className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                    <span className="animate-bounce">↓</span>
                    <span>Continuez à scroller</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Content area */}
          <motion.div
            className={`space-y-6 flex flex-col justify-center ${invertLayout ? 'lg:order-1' : 'lg:order-2'}`}
            initial={false}
            style={{
              opacity: finalTextOpacity,
              x: finalTextTranslateX,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {/* Chapter header */}
            <div className="space-y-2">
              {icon && (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      rotate: shouldShowWithSection ? [0, 10, -10, 0] : 0,
                    }}
                    transition={{
                      duration: 0.6,
                      delay: shouldShowWithSection ? 0.8 : 0,
                      ease: 'easeInOut',
                    }}
                  >
                    {icon}
                  </motion.div>
                </div>
              )}

              <motion.h3
                className="text-3xl md:text-4xl lg:text-5xl font-light text-[#2A2A2A] leading-tight"
                initial={false}
                animate={{
                  y: sectionActive ? (shouldShow ? 0 : 10) : 0,
                }}
                transition={{ duration: 0.5 }}
              >
                {title}
              </motion.h3>

              <motion.p
                className="text-xl text-[#666666] font-light"
                initial={false}
                animate={{
                  y: sectionActive ? (shouldShow ? 0 : 5) : 0,
                }}
                transition={{ duration: 0.5, delay: shouldShowWithSection ? 0.1 : 0 }}
              >
                {description}
              </motion.p>
            </div>

            {/* Detailed description */}
            {detailedDescription && (
              <motion.p
                className="text-lg text-[#666666] font-light leading-relaxed"
                initial={false}
                animate={{
                  y: sectionActive ? (shouldShow ? 0 : 5) : 0,
                }}
                transition={{ duration: 0.5, delay: shouldShowWithSection ? 0.2 : 0 }}
              >
                {detailedDescription}
              </motion.p>
            )}

            {/* Features list */}
            <motion.div
              className="space-y-3 pt-4"
              initial={false}
              animate={{
                opacity: shouldShowWithSection ? 1 : 0,
                y: shouldShowWithSection ? 0 : 20,
              }}
              transition={{ duration: 0.5, delay: shouldShowWithSection ? 0.3 : 0 }}
            >
              {(features.length > 0
                ? features
                : [
                    {
                      title: 'Intuitif et rapide',
                      description: 'Interface optimisée pour une prise en main immédiate',
                    },
                    {
                      title: 'Compatible mobile',
                      description: 'Fonctionne parfaitement sur smartphone et tablette',
                    },
                    {
                      title: 'Inclus dans tous les plans',
                      description: "Aucun supplément, disponible dès l'inscription",
                    },
                  ]
              ).map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#0066FF]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#0066FF]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-normal text-[#2A2A2A]">{feature.title}</h4>
                    <p className="text-sm text-[#666666] font-light mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
