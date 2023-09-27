import type { DropAnimation } from '@dnd-kit/core';
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import type { PropsWithChildren } from 'react';
import React from 'react';

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4',
      },
    },
  }),
};

export const SortableOverlay = ({ children }: PropsWithChildren) => {
  return <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>;
};
