import { SvgIconComponent } from '@mui/icons-material';

export type GroupItem = {
  id: string;
  label: string;
  href: string;
  Icon: SvgIconComponent;
};

export type Group = {
  id: string;
  label: string;
  items: GroupItem[];
};
