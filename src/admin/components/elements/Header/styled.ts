import AppBar from '@mui/material/AppBar/index.js';
import { styled } from '@mui/material/styles/index.js';

export const AppBarStyled = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...{
    width: `calc(100% - ${theme.spacing(7.5)})`,
  },
}));
