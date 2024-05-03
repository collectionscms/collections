import Drawer from '@mui/material/Drawer/Drawer.js';
import { CSSObject, styled, Theme } from '@mui/material/styles/index.js';

const openedMixin = (theme: Theme): CSSObject => ({
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow: 'none',
});

export const MinimalStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...{
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    },
  })
);
