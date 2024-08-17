import { Box } from '@mui/material';
import { Theme } from '@mui/material';
import React from 'react';
import { MainCard, MainCardProps } from '../MainCard/index.js';

export const AuthCard = ({ children, ...other }: MainCardProps) => (
  <MainCard
    sx={{
      maxWidth: { xs: 400, lg: 475 },
      margin: { xs: 2.5, md: 3 },
      '& > *': {
        flexGrow: 1,
        flexBasis: '50%',
      },
    }}
    content={false}
    {...other}
    border={false}
    boxShadow
    shadow={(theme: Theme) => theme.customShadows.z1}
  >
    <Box sx={{ p: { xs: 2, sm: 3, md: 4, xl: 5 } }}>{children}</Box>
  </MainCard>
);
