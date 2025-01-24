import { icons } from 'lucide-react';
import React, { memo } from 'react';

export type Props = {
  name: keyof typeof icons;
  size?: number;
  strokeWidth?: number;
  classNames?: Record<string, any>;
};

export const Icon = memo(({ name, size, strokeWidth, classNames }: Props) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} strokeWidth={strokeWidth || 1.5} style={classNames} />;
});

Icon.displayName = 'Icon';
