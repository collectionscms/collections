import type { Active, Over } from '@dnd-kit/core';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React, { useMemo, useState } from 'react';
import { DragHandle, SortableItem, SortableItemMenu } from './components/SortableItem/index.js';
import { SortableOverlay } from './components/SortableOverlay/index.js';
import { BaseItem, Props } from './types.js';

export const SortableFieldList = <T extends BaseItem>({
  items,
  onChange,
  onStore,
  renderItem,
}: Props<T>) => {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(() => items.find((item) => item.id === active?.id), [active, items]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const changeItemOrder = (active: Active, over: Over | null) => {
    if (over && active.id !== over?.id) {
      const activeIndex = items.findIndex(({ id }) => id === active.id);
      const overIndex = items.findIndex(({ id }) => id === over.id);
      onChange(arrayMove(items, activeIndex, overIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragOver={({ active, over }) => {
        changeItemOrder(active, over);
      }}
      onDragEnd={({ active, over }) => {
        changeItemOrder(active, over);
        onStore(items);
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        {items.map((item) => (
          <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
        ))}
      </SortableContext>
      <SortableOverlay>{activeItem ? renderItem(activeItem) : null}</SortableOverlay>
    </DndContext>
  );
};

SortableFieldList.Item = SortableItem;
SortableFieldList.DragHandle = DragHandle;
SortableFieldList.ItemMenu = SortableItemMenu;
