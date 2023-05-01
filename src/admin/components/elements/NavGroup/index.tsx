import { List, ListSubheader } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Props } from './types.js';

export const NavGroup: React.FC<Props> = ({ group, children }) => {
  const { label } = group;
  const { t } = useTranslation();

  return (
    <List
      sx={{ width: '100%' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {t(`${label}` as unknown as TemplateStringsArray)}
        </ListSubheader>
      }
    >
      {children}
    </List>
  );
};
