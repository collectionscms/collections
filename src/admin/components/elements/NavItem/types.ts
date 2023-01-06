import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type GroupItem = {
  label: string;
  href: string;
  icon: IconProp;
};

export type Group = {
  label: string;
  items: GroupItem[];
};

export type Props = {
  item: GroupItem;
};
