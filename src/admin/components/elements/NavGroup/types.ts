import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { icons } from 'lucide-react';
import { ComponentClass, FunctionComponent } from 'react';

export type Props = {
  group: Group;
};

export type OverrideIcon =
  | (OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
      muiName: string;
    })
  | ComponentClass<any>
  | FunctionComponent<any>;

export type Group = {
  label: string;
  items: GroupItem[];
};

export type GroupItem = {
  label: string;
  href: string;
  icon: keyof typeof icons;
};
