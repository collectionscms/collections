import { ChevronRight } from 'lucide-react';
import React from 'react';

export const CardIcon = React.memo(() => {
  return <ChevronRight strokeWidth={1.5} />;
});

CardIcon.displayName = 'CardIcon';
