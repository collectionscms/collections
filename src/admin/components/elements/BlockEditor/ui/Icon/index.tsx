import { icons } from 'lucide-react';
import React, { memo } from 'react';

export type Props = {
  name: keyof typeof icons;
  size?: number;
  strokeWidth?: number;
};

export const Icon = memo(({ name, size, strokeWidth }: Props) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} strokeWidth={strokeWidth || 1.5} />;
});

Icon.displayName = 'Icon';
