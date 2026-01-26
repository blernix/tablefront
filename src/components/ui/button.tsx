import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-[#0066FF] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#0066FF] text-white border border-[#0066FF] hover:bg-white hover:text-[#0066FF]',
        destructive: 'bg-red-500 text-white border border-red-500 hover:bg-white hover:text-red-500',
        outline:
          'border border-[#E5E5E5] text-[#2A2A2A] hover:border-[#0066FF] hover:text-[#0066FF] bg-white dark:bg-[#1A1A1A] dark:text-[#FAFAFA] dark:border-[#2A2A2A]',
        secondary: 'bg-[#FAFAFA] text-[#2A2A2A] border border-[#E5E5E5] hover:bg-white dark:bg-[#1A1A1A] dark:text-[#FAFAFA] dark:border-[#2A2A2A] dark:hover:bg-[#1F1F1F]',
        ghost: 'text-[#666666] hover:text-[#0066FF] hover:bg-[#FAFAFA] dark:text-[#999999] dark:hover:bg-[#1A1A1A]',
        link: 'text-[#0066FF] underline-offset-4 hover:underline',
        success: 'bg-emerald-600 text-white border border-emerald-600 hover:bg-white hover:text-emerald-600',
      },
      size: {
        default: 'h-12 px-8 py-4',
        sm: 'h-10 px-6 py-3 text-xs',
        lg: 'h-14 px-12 py-6 text-base',
        icon: 'h-12 w-12',
        'icon-sm': 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
