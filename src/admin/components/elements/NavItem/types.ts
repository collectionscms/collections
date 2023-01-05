import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Field } from '@shared/types';

export type GroupItem = {
  id: string;
  label: string;
  href: string;
  icon: IconProp;
  // fields: Field[];
};

export type Group = {
  id: string;
  label: string;
  items: GroupItem[];
};

export type Props = {
  item: GroupItem;
};
