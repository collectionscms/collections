import RouterLink from '@admin/components/elements/Link';
import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React from 'react';

const Item = (props: BoxProps) => {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    />
  );
};

const EditPage: React.FC = () => {
  const theme = useTheme();

  const [state, setState] = React.useState(false);

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState(open);
  };

  const list = () => (
    <Box
      sx={{ width: 400 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {['Input', 'Textarea', 'Code', 'Markdown'].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Item>
          <h1>Edit ContentType</h1>
        </Item>
        <Item>
          <Button variant="contained" component={RouterLink} to="../content-types">
            更新
          </Button>
        </Item>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <span>id</span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" onClick={toggleDrawer(true)} sx={{ width: '100%', mt: '12px' }}>
        フィールドを追加
      </Button>
      <Drawer
        anchor="right"
        open={state}
        onClose={toggleDrawer(false)}
        sx={{ zIndex: theme.zIndex.appBar + 200 }}
      >
        {list()}
      </Drawer>

      <Grid container spacing={3} xs={12} xl={6} sx={{ mt: 4 }}>
        <Grid xs={12} md={6}>
          <Item>
            <Box>
              <label>Name</label>
            </Box>
            <TextField id="name" fullWidth />
          </Item>
        </Grid>
        <Grid xs={12} md={6}>
          <Item>
            <Box>
              <label>Singleton</label>
            </Box>
            <Checkbox {...{ inputProps: { 'aria-label': 'Checkbox demo' } }} defaultChecked />
          </Item>
        </Grid>
      </Grid>
    </>
  );
};

export default EditPage;
