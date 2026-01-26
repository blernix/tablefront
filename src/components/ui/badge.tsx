import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-2 border px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300',
  {
    variants: {
      variant: {
        default: 'border-[#E5E5E5] bg-white text-[#666666] dark:border-[#2A2A2A] dark:bg-[#1A1A1A] dark:text-[#999999]',
        outline: 'border-[#E5E5E5] bg-transparent text-[#666666] dark:border-[#2A2A2A] dark:text-[#999999]',
        success: 'border-emerald-600 bg-transparent text-emerald-600',
        warning: 'border-amber-600 bg-transparent text-amber-600',
        danger: 'border-red-600 bg-transparent text-red-600',
        info: 'border-[#0066FF] bg-transparent text-[#0066FF]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
