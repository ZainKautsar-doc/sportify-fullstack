import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/src/lib/cn';

interface CardProps extends Omit<ComponentPropsWithoutRef<'div'>, 'children'> {
  children?: ReactNode;
  hoverable?: boolean;
}

export function Card({ className, hoverable, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/70 bg-white/95 p-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.42)] backdrop-blur',
        hoverable && 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_52px_-30px_rgba(15,23,42,0.45)]',
        className,
      )}
      {...props}
    />
  );
}
