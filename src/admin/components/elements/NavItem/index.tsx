import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import RouterLink from '../Link';
import { Props } from './types';

const NavItem: React.FC<Props> = ({ item }) => {
  const { href, label, icon } = item;

  return (
    <ListItemButton to={href} component={RouterLink}>
      <ListItemIcon>
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItemButton>
  );
};

export default NavItem;
