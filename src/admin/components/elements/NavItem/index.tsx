import { ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '../Icon/index.js';
import { GroupItem } from '../NavGroup/types.js';
import { NavLink } from '../NavLink/index.js';

export type Props = {
  item: GroupItem;
};

export const NavItem: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { href, label, icon } = item;

  const textColor = theme.palette.mode === 'dark' ? 'grey.400' : 'text.primary';
  const iconSelectedColor = theme.palette.mode === 'dark' ? 'text.primary' : 'secondary.main';

  return (
    <ListItemButton
      to={href}
      component={NavLink}
      sx={{
        minWidth: 28,
        pl: 3,
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'secondary.lighter',
        },
        '&.Mui-selected': {
          bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'secondary.lighter',
          borderRight: `2px solid ${theme.palette.text.primary}`,
          color: iconSelectedColor,
          '&:hover': {
            color: iconSelectedColor,
            bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'secondary.lighter',
          },
        },
        '&:not(.Mui-selected)': {
          '.MuiTypography-h6': {
            color: textColor,
          },
        },
      }}
    >
      <ListItemIcon sx={{ fontSize: '1rem' }}>
        <Icon name={icon} strokeWidth={1.5} size={16} />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography color="inherit">
            {t(`${label}` as unknown as TemplateStringsArray)}
          </Typography>
        }
      />
    </ListItemButton>
  );
};
