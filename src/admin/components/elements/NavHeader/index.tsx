import { ButtonBase, useTheme } from '@mui/material';
import React from 'react';
import { RouterLink } from '../Link/index.js';
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
      <ButtonBase disableRipple component={RouterLink} to={'/admin'} sx={{ width: 30, height: 30 }}>
        <Logo />
      </ButtonBase>
    </NavHeaderStyled>
  );
};
