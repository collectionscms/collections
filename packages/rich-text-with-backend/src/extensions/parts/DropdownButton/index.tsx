import React from 'react';
import { cn } from '@/lib/utils/cn';

export const DropdownButton = React.forwardRef<
  HTMLButtonElement,
  {
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
  }
>(function DropdownButtonInner({ children, isActive, onClick, disabled, className }, ref) {
  const buttonClass = cn(
    'flex items-center gap-2 p-1.5 text-sm font-medium text-neutral-500 text-left bg-transparent w-full rounded',
    !isActive && !disabled,
    'hover:bg-neutral-100 hover:text-neutral-800',
    isActive && !disabled && 'bg-neutral-100 text-neutral-800',
    disabled && 'text-neutral-400 cursor-not-allowed',
    className
  );

  return (
    <button className={buttonClass} disabled={disabled} onClick={onClick} ref={ref}>
      {children}
    </button>
  );
});
