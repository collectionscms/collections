import { Group } from '../NavItem/types.js';

export type Props = {
  open: boolean;
  group: Group;
  toggleDrawer: () => void;
};
