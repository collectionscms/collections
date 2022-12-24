import { Type } from '@admin/components/elements/Table/Cell/types';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type GroupItem = {
  id: string;
  label: string;
  href: string;
  icon: IconProp;
  fields: Field[];
};

export type Group = {
  id: string;
  label: string;
  items: GroupItem[];
};

export type Field = {
  field: string;
  label: string;
  type: typeof Type[keyof typeof Type];
};
