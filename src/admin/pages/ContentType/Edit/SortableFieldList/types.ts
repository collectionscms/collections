import type { UniqueIdentifier } from '@dnd-kit/core';
import { ReactNode } from 'react';

export type BaseItem = {
  id: UniqueIdentifier;
};

export type Props<T extends BaseItem> = {
  items: T[];
  onChange(items: T[]): void;
  renderItem(item: T): ReactNode;
};
