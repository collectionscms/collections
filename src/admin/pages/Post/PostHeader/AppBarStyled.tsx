import AppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';

interface Props extends MuiAppBarProps {
  open?: boolean;
}

const DRAWER_WIDTH = 260;

const AppBarStyled = styled(AppBar, { shouldForwardProp: (prop) => prop !== 'open' })<Props>(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(!open && {
      width: `calc(100% - ${theme.spacing(7.5)})`,
    }),
    ...(open && {
      marginLeft: DRAWER_WIDTH,
      width: `calc(100% - ${DRAWER_WIDTH}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

export default AppBarStyled;
