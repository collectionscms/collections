import { Theme } from '@mui/material';
import { AppBar } from './AppBar.js';
import { Checkbox } from './Checkbox.js';
import { ListItemButton } from './ListItemButton.js';
import { ListItemIcon } from './ListItemIcon.js';
import { ListItemText } from './ListItemText.js';
import { ListSubheader } from './ListSubheader.js';
import { Radio } from './Radio.js';
import { TableHead } from './TableHead.js';
import { TableRow } from './TableRow.js';
import { TableBody } from './TableBody.js';
import { TableCell } from './TableCell.js';
import { TableFooter } from './TableFooter.js';

export const componentsOverrides = (theme: Theme) => {
  return Object.assign(
    AppBar(theme),
    ListSubheader(),
    ListItemButton(theme),
    ListItemIcon(),
    ListItemText(),
    Checkbox(theme),
    Radio(theme),
    TableRow(),
    TableHead(theme),
    TableBody(theme),
    TableCell(theme),
    TableFooter(theme)
  );
};
