import { Theme } from '@mui/material';
import { Accordion } from './Accordion.js';
import { AccordionDetails } from './AccordionDetails.js';
import { AccordionSummary } from './AccordionSummary.js';
import { Alert } from './Alert.js';
import { AlertTitle } from './AlertTitle.js';
import { AppBar } from './AppBar.js';
import { Autocomplete } from './Autocomplete.js';
import { Badge } from './Badge.js';
import { Button } from './Button.js';
import { ButtonBase } from './ButtonBase.js';
import { ButtonGroup } from './ButtonGroup.js';
import { CardContent } from './CardContent.js';
import { Checkbox } from './Checkbox.js';
import { Chip } from './Chip.js';
import { Dialog } from './Dialog.js';
import { DialogContentText } from './DialogContentText.js';
import { DialogTitle } from './DialogTitle.js';
import { Fab } from './Fab.js';
import { IconButton } from './IconButton.js';
import { InputBase } from './InputBase.js';
import { InputLabel } from './InputLabel.js';
import { LinearProgress } from './LinearProgress.js';
import { Link } from './Link.js';
import { ListItemButton } from './ListItemButton.js';
import { ListItemIcon } from './ListItemIcon.js';
import { LoadingButton } from './LoadingButton.js';
import { OutlinedInput } from './OutlinedInput.js';
import { Pagination } from './Pagination.js';
import { PaginationItem } from './PaginationItem.js';
import { Popover } from './Popover.js';
import { Radio } from './Radio.js';
import { Slider } from './Slider.js';
import { Switch } from './Switch.js';
import { Tab } from './Tab.js';
import { TableBody } from './TableBody.js';
import { TableCell } from './TableCell.js';
import { TableFooter } from './TableFooter.js';
import { TableHead } from './TableHead.js';
import { TableRow } from './TableRow.js';
import { Tabs } from './Tabs.js';
import { ToggleButton } from './ToggleButton.js';
import { Tooltip } from './Tooltip.js';
import { TreeItem } from './TreeItem.js';
import { Typography } from './Typography.js';

export const componentsOverrides = (theme: Theme) => {
  return Object.assign(
    AppBar(theme),
    ListItemButton(theme),
    ListItemIcon(theme),
    Checkbox(theme),
    Radio(theme),
    TableRow(),
    TableHead(theme),
    TableBody(theme),
    TableCell(theme),
    TableFooter(theme),
    Accordion(theme),
    Chip(theme),
    AccordionDetails(theme),
    AccordionSummary(theme),
    Typography(),
    Button(theme),
    ButtonBase(),
    ButtonGroup(),
    LoadingButton(),
    IconButton(theme),
    Tooltip(theme),
    CardContent(),
    Dialog(),
    DialogContentText(theme),
    DialogTitle(),
    Link(),
    InputBase(),
    InputLabel(theme),
    OutlinedInput(theme),
    LinearProgress(),
    Alert(theme),
    AlertTitle(),
    Autocomplete(),
    Badge(theme),
    Fab(theme),
    Pagination(),
    PaginationItem(theme),
    Popover(theme),
    Slider(theme),
    Switch(theme),
    Tab(theme),
    Tabs(),
    ToggleButton(theme),
    TreeItem()
  );
};
