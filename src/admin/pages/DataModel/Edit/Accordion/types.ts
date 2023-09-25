import { OverrideIcon } from '../../../../components/elements/NavGroup/types.js';

export type Props = {
  expanded: boolean;
  title: string;
  description: string;
  icon: OverrideIcon;
  type: 'top' | 'middle' | 'bottom';
  children: React.ReactNode;
  handleChange: () => void;
};
