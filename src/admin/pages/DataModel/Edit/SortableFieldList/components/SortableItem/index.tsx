import { HolderOutlined, MoreOutlined } from '@ant-design/icons';
import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Tooltip } from '@mui/material';
import type { CSSProperties, PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from 'superfast-ui';

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
    padding: '0.2rem',
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
    <IconButton color="secondary" onClick={onClickItem}>
      <MoreOutlined style={{ fontSize: '1.15rem' }} />
    </IconButton>
  );
};

export const DragHandle: React.FC = () => {
  const { attributes, listeners, ref } = useContext(SortableItemContext);
  const { t } = useTranslation();

  return (
    <Tooltip title={t('drag_to_move')} arrow placement="top">
      <IconButton {...attributes} {...listeners} ref={ref}>
        <HolderOutlined style={{ fontSize: '1.15rem' }} />
      </IconButton>
    </Tooltip>
  );
};
