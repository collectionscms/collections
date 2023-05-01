import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RouterLink } from '../Link/index.js';
import { Props } from './types.js';

export const NavItem: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  const { href, label, Icon } = item;

  return (
    <ListItemButton to={href} component={RouterLink}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={t(`${label}` as unknown as TemplateStringsArray)} />
    </ListItemButton>
  );
};
