import { icons } from 'lucide-react';
import React, { memo } from 'react';
import { cn } from '@/lib/utils/cn';

export type Props = {
  name: keyof typeof icons;
  strokeWidth?: number;
  className?: string;
};

export const Icon = memo(({ name, strokeWidth, className }: Props) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={cn('w-4 h-4', className)} strokeWidth={strokeWidth || 2.5} />;
});

Icon.displayName = 'Icon';
