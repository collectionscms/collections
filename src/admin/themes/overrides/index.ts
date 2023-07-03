import { Theme } from '@mui/material';
import { AppBar } from './AppBar.js';
import { Checkbox } from './Checkbox.js';
import { ListItemButton } from './ListItemButton.js';
import { ListItemIcon } from './ListItemIcon.js';
import { ListItemText } from './ListItemText.js';
import { ListSubheader } from './ListSubheader.js';
import { Radio } from './Radio.js';

export const componentsOverrides = (theme: Theme) => {
  return Object.assign(
    AppBar(theme),
    ListSubheader(),
    ListItemButton(theme),
    ListItemIcon(),
    ListItemText(),
    Checkbox(theme),
    Radio(theme)
  );
};
