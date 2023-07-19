import { Box, List, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavItem } from '../NavItem/index.js';
import { Props } from './types.js';

export const NavGroup: React.FC<Props> = ({ group }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const navCollapse = group.items?.map((menuItem, _index) => {
    return <NavItem key={menuItem.label} item={menuItem} />;
  });

  return (
    <List
      subheader={
        <Box sx={{ pl: 3, mb: 1.5 }}>
          <Typography
            variant="subtitle2"
            color={theme.palette.mode === 'dark' ? 'textSecondary' : 'text.secondary'}
          >
            {t(`${group.label}` as unknown as TemplateStringsArray)}
          </Typography>
        </Box>
      }
      sx={{ mt: 1.5, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};
