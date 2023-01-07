import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import RouterLink from '../Link';
import { Props } from './types';

const NavItem: React.FC<Props> = ({ item }) => {
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

export default NavItem;
