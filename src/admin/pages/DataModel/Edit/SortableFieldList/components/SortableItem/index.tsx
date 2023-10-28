import { HolderOutlined, MoreOutlined } from '@ant-design/icons';
import { IconButton } from '@collectionscms/plugin-ui';
import type { DraggableSyntheticListeners, UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Tooltip, useTheme } from '@mui/material';
import type { CSSProperties, PropsWithChildren } from 'react';
import React, { createContext, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const theme = useTheme();

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

  const defaultStyle: CSSProperties = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
    padding: '0.2rem',
    cursor: 'pointer',
    height: '44px',
  };
  const [style, setStyle] = useState<CSSProperties>(defaultStyle);

  return (
    <SortableItemContext.Provider value={context}>
      <Card
        ref={setNodeRef}
        style={style}
        variant="outlined"
        onMouseEnter={() => {
          setStyle({ ...style, border: `1px solid ${theme.palette.primary.main}` });
        }}
        onMouseLeave={() => {
          setStyle(defaultStyle);
        }}
      >
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
