import { ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from '../NavLink/index.js';
import { Props } from './types.js';

export const NavItem: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { href, label, icon } = item;
  const Icon = icon;

  const textColor = theme.palette.mode === 'dark' ? 'grey.400' : 'text.primary';
  const iconSelectedColor = theme.palette.mode === 'dark' ? 'text.primary' : 'primary.main';

  return (
    <ListItemButton
      to={href}
      component={NavLink}
      sx={{
        minWidth: 28,
        pl: 3,
        '&:hover': {
          bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter',
        },
        '&.Mui-selected': {
          bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter',
          borderRight: `2px solid ${theme.palette.primary.main}`,
          color: iconSelectedColor,
          '&:hover': {
            color: iconSelectedColor,
            bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter',
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
        <Icon />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="h6" color="inherit">
            {t(`${label}` as unknown as TemplateStringsArray)}
          </Typography>
        }
      />
    </ListItemButton>
  );
};
