import { icons } from 'lucide-react';
import React, { memo } from 'react';

export type Props = {
  name: keyof typeof icons;
  size?: number;
};

export const Icon = memo(({ name, size }: Props) => {
  const IconComponent = icons[name];

  if (!IconComponent) {
    return null;
  }

  return <IconComponent size={size} />;
});

Icon.displayName = 'Icon';
