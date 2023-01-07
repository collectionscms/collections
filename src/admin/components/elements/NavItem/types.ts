import { SvgIconProps } from '@mui/material';

export type GroupItem = {
  label: string;
  href: string;
  Icon: (props: SvgIconProps) => JSX.Element;
};

export type Group = {
  label: string;
  items: GroupItem[];
};

export type Props = {
  item: GroupItem;
};
