import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import RouterLink from '../Link';
import { Props } from './types';

const NavItem: React.FC<Props> = ({ item }) => {
  const { href, label, Icon } = item;

  return (
    <ListItemButton to={href} component={RouterLink}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

export default NavItem;
