import { Theme } from '@mui/material';
import { Accordion } from './Accordion.js';
import { AccordionDetails } from './AccordionDetails.js';
import { AccordionSummary } from './AccordionSummary.js';
import { AppBar } from './AppBar.js';
import { Button } from './Button.js';
import { ButtonBase } from './ButtonBase.js';
import { ButtonGroup } from './ButtonGroup.js';
import { CardContent } from './CardContent.js';
import { Checkbox } from './Checkbox.js';
import { ListItemButton } from './ListItemButton.js';
import { ListItemIcon } from './ListItemIcon.js';
import { ListItemText } from './ListItemText.js';
import { ListSubheader } from './ListSubheader.js';
import { Radio } from './Radio.js';
import { TableBody } from './TableBody.js';
import { TableCell } from './TableCell.js';
import { TableFooter } from './TableFooter.js';
import { TableHead } from './TableHead.js';
import { TableRow } from './TableRow.js';
import { Tooltip } from './Tooltip.js';
import { Typography } from './Typography.js';

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
    TableFooter(theme),
    Accordion(theme),
    AccordionDetails(theme),
    AccordionSummary(theme),
    Typography(),
    Button(theme),
    ButtonBase(),
    ButtonGroup(),
    Tooltip(theme),
    CardContent()
  );
};
