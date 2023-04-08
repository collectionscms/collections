import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragIndicatorOutlined, MoreVertOutlined } from '@mui/icons-material';
import { Button, Card } from '@mui/material';
import type { CSSProperties, PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

type Props = {
  id: UniqueIdentifier;
};

type Context = {
  attributes: Record<string, any>;
  listeners: DraggableSyntheticListeners;
  ref(node: HTMLElement | null): void;
};

const SortableItemContext = createContext<Context>({
  attributes: {},
  listeners: undefined,
  ref() {},
});

export const SortableItem: React.FC<PropsWithChildren<Props>> = ({ children, id }) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef,
    }),
    [attributes, listeners, setActivatorNodeRef]
  );
  const style: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <SortableItemContext.Provider value={context}>
      <Card ref={setNodeRef} style={style} variant="outlined">
        {children}
      </Card>
    </SortableItemContext.Provider>
  );
};

export const SortableItemMenu: React.FC<{
  onClickItem(e: React.MouseEvent): void;
}> = ({ onClickItem }) => {
  return (
    <Button onClick={onClickItem}>
      <MoreVertOutlined />
    </Button>
  );
};

export const DragHandle: React.FC = () => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);

  return (
    <Button {...attributes} {...listeners} ref={ref}>
      <DragIndicatorOutlined />
    </Button>
  );
};
