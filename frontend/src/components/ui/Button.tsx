import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/src/lib/cn';

type ButtonVariant = 'primary' | 'gradient' | 'secondary' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/**
 * Design token: Navy #0B1F3A  /  Navy light #1E3A5F
 * No purple/indigo gradients — clean solid navy.
 */
const variantClass: Record<ButtonVariant, string> = {
  // Primary & gradient are the same → solid navy
  primary:
    'bg-[#0B1F3A] text-white shadow-md shadow-[#0B1F3A]/25 hover:bg-[#1E3A5F] hover:-translate-y-0.5 active:translate-y-0',
  gradient:
    'bg-[#0B1F3A] text-white shadow-md shadow-[#0B1F3A]/25 hover:bg-[#1E3A5F] hover:-translate-y-0.5 active:translate-y-0',
  // Secondary → navy outline
  secondary:
    'bg-white text-[#0B1F3A] border-2 border-[#0B1F3A]/25 hover:border-[#0B1F3A]/60 hover:bg-[#f0f5fb] -translate-y-0 active:scale-[0.98]',
  ghost:
    'bg-transparent text-[#0B1F3A] hover:bg-[#f0f5fb]',
  danger:
    'bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/25 hover:-translate-y-0.5',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/25 hover:-translate-y-0.5',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm md:text-base',
  lg: 'h-12 px-6 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variantClass[variant],
        sizeClass[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = 'Button';

export default Button;
