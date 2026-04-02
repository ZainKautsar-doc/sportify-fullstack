import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/src/lib/cn';

type BadgeVariant =
  | 'primary'
  | 'available'
  | 'full'
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'neutral';

interface BadgeProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  children?: ReactNode;
  variant?: BadgeVariant;
}

const styles: Record<BadgeVariant, string> = {
  primary: 'bg-indigo-100 text-indigo-700',
  available: 'bg-emerald-100 text-emerald-700',
  full: 'bg-rose-100 text-rose-700',
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-rose-100 text-rose-700',
  neutral: 'bg-slate-100 text-slate-600',
};

export default function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}
