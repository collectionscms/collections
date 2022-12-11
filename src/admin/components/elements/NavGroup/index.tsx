import { List, ListSubheader } from '@mui/material';
import React from 'react';
import { Props } from './types';

const NavGroup: React.FC<Props> = ({ group, children }) => {
  const { label } = group;

  return (
    <List
      sx={{ width: '100%' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {label}
        </ListSubheader>
      }
    >
      {children}
    </List>
  );
};

export default NavGroup;
