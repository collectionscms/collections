import { Group } from 'config/types';

export type Props = {
  open: boolean;
  groups: Group[];
  toggleDrawer: () => void;
};
