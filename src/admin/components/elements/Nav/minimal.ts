import Drawer from '@mui/material/Drawer';
import { styled, Theme } from '@mui/material/styles';
import config from '../../../../shared/features/config';

const openedMixin = (theme: Theme) => ({
  width: config?.ui.navWidth,
  borderRight: `1px solid ${theme.palette.divider}`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow: 'none',
});

const MinimalStyled = styled(Drawer)(({ theme }) => ({
  width: config?.ui.navWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': openedMixin(theme),
}));

export default MinimalStyled;
