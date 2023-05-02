import { SvgIconComponent } from '@mui/icons-material';

export type Group = {
  label: string;
  items: GroupItem[];
};

export type Props = {
  item: GroupItem;
};

export type GroupItem = {
  label: string;
  href: string;
  Icon: SvgIconComponent;
};
