import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import RouterLink from '../Link';
import React from 'react';
import { Props } from './types';

const NavItem: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  const { href, label, icon } = item;

  return (
    <ListItemButton to={href} component={RouterLink}>
      <ListItemIcon>
        <FontAwesomeIcon icon={icon} />
      </ListItemIcon>
      <ListItemText primary={t(`page.index.${label}` as unknown as TemplateStringsArray)} />
    </ListItemButton>
  );
};

export default NavItem;
