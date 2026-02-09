'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedWorkflowStepProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedWorkflowStep({ children, delay = 0, className = "" }: AnimatedWorkflowStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCircleProps {
  children: ReactNode;
  delay?: number;
}

export function AnimatedCircle({ children, delay = 0 }: AnimatedCircleProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.05 }}
      className="w-16 h-16 bg-[#0066FF] text-white rounded-full flex items-center justify-center text-2xl font-light mx-auto"
    >
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut"
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

interface AnimatedTitleProps {
  children: ReactNode;
  delay?: number;
}

export function AnimatedTitle({ children, delay = 0 }: AnimatedTitleProps) {
  return (
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      className="text-2xl font-light text-[#2A2A2A]"
    >
      {children}
    </motion.h3>
  );
}

interface AnimatedTextProps {
  children: ReactNode;
  delay?: number;
}

export function AnimatedText({ children, delay = 0 }: AnimatedTextProps) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: "easeOut"
      }}
      className="text-[#666666] font-light leading-relaxed"
    >
      {children}
    </motion.p>
  );
}