import { ButtonBase, useTheme } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Logo } from '../Logo/index.js';
import { NavHeaderStyled } from './styled.js';

export const NavHeader: React.FC = () => {
  const theme = useTheme();
  return (
    <NavHeaderStyled
      theme={theme}
      sx={{
        minHeight: '80px',
        width: 'inherit',
        pl: '24px',
      }}
    >
      <ButtonBase
        disableRipple
        component={RouterLink}
        to={'/admin'}
        sx={{ width: 'auto', height: 30 }}
      >
        <Logo variant="icon" props={{ width: 'auto', height: 30 }} />
      </ButtonBase>
    </NavHeaderStyled>
  );
};
