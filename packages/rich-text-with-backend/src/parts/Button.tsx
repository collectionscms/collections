import React from 'react';
import { cn } from '../lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'ghost';
export type ButtonSize = 'medium' | 'small' | 'icon' | 'iconSmall';
export type ButtonProps = {
  variant?: ButtonVariant;
  active?: boolean;
  activeClassname?: string;
  buttonSize?: ButtonSize;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      active,
      buttonSize = 'medium',
      children,
      disabled,
      variant = 'primary',
      className,
      activeClassname,
      ...rest
    },
    ref
  ) => {
    const buttonClassName = cn(
      'flex group items-center justify-center border border-transparent gap-2 text-sm font-semibold rounded-md disabled:opacity-50 whitespace-nowrap',

      variant === 'primary' &&
        cn(
          'text-white bg-black border-black',
          !disabled && !active && 'hover:bg-neutral-800 active:bg-neutral-900',
          active && cn('bg-neutral-900', activeClassname)
        ),

      variant === 'secondary' &&
        cn(
          'text-neutral-900',
          !disabled && !active && 'hover:bg-neutral-100 active:bg-neutral-200',
          active && 'bg-neutral-200'
        ),

      variant === 'tertiary' &&
        cn(
          'bg-neutral-50 text-neutral-900',
          !disabled && !active && 'hover:bg-neutral-100 active:bg-neutral-200',
          active && cn('bg-neutral-200', activeClassname)
        ),

      variant === 'ghost' &&
        cn(
          'bg-transparent border-transparent text-neutral-500',
          !disabled &&
            !active &&
            'hover:bg-black/5 hover:text-neutral-700 active:bg-black/10 active:text-neutral-800',
          active && cn('bg-black/10 text-neutral-800', activeClassname)
        ),

      buttonSize === 'medium' && 'py-2 px-3',
      buttonSize === 'small' && 'py-1 px-2',
      buttonSize === 'icon' && 'w-8 h-8',
      buttonSize === 'iconSmall' && 'w-6 h-6',

      className
    );

    return (
      <button ref={ref} disabled={disabled} className={buttonClassName} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
