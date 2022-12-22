import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type GroupItem = {
  id: string;
  label: string;
  href: string;
  icon: IconProp;
};

export type Group = {
  id: string;
  label: string;
  items: GroupItem[];
};
