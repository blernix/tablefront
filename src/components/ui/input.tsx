import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-14 w-full border bg-white px-6 py-4 text-base text-[#2A2A2A] placeholder:text-[#666666] transition-colors duration-300',
          'focus-visible:outline-none focus-visible:border-[#0066FF]',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#FAFAFA]',
          'file:border-0 file:bg-transparent file:text-base file:font-light file:text-[#2A2A2A]',
          'dark:bg-[#1A1A1A] dark:text-[#FAFAFA] dark:placeholder:text-[#666666] dark:disabled:bg-[#0A0A0A]',
          error
            ? 'border-red-500 focus-visible:border-red-500'
            : 'border-[#E5E5E5] hover:border-[#666666] dark:border-[#2A2A2A] dark:hover:border-[#666666]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
