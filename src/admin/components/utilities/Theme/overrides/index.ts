import { Theme } from '@mui/material';
import AppBar from './AppBar';
import ListItemButton from './ListItemButton';
import ListItemIcon from './ListItemIcon';
import ListItemText from './ListItemText';
import ListSubheader from './ListSubheader';

const componentsOverrides = (theme: Theme) => {
  return Object.assign(
    AppBar(theme),
    ListSubheader(),
    ListItemButton(theme),
    ListItemIcon(),
    ListItemText()
  );
};

export default componentsOverrides;
