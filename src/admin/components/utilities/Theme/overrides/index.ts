import { Theme } from '@mui/material';
import AppBar from './AppBar';

const componentsOverrides = (theme: Theme) => {
  return Object.assign(AppBar(theme));
};

export default componentsOverrides;
