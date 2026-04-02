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

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-[0_12px_28px_-14px_rgba(37,99,235,0.65)] hover:-translate-y-0.5',
  gradient:
    'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-[0_12px_28px_-14px_rgba(37,99,235,0.65)] hover:-translate-y-0.5',
  secondary: 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100',
  danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_10px_25px_-14px_rgba(244,63,94,0.7)]',
  success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_10px_25px_-14px_rgba(16,185,129,0.7)]',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm md:text-base',
  lg: 'h-12 px-6 text-base',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'gradient', size = 'md', fullWidth, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition duration-300 disabled:cursor-not-allowed disabled:opacity-60',
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
