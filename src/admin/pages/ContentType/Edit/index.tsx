import DeleteDocument from '@admin/components/elements/DeleteDocument';
import RouterLink from '@admin/components/elements/Link';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const EditPage: React.FC = () => {
  const [state, setState] = useState(false);
  const { id } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const { localizedLabel } = useDocumentInfo();
  const navigate = useNavigate();

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

  const handleDeletionSuccess = () => {
    navigate(`../content-types`);
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
    <Stack rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{localizedLabel}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <DeleteDocument id={id} slug={`roles`} onSuccess={handleDeletionSuccess} />
          </Grid>
          <Grid>
            <Button variant="contained" component={RouterLink} to="../content-types">
              {t('update')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
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
      <Grid container spacing={3} xs={12} xl={6}>
        <Grid xs={12} md={6}>
          <FormLabel>Name</FormLabel> <TextField id="name" fullWidth />
        </Grid>
        <Grid xs={12} md={6}>
          <FormLabel>Singleton</FormLabel>
          <Box>
            <Checkbox {...{ inputProps: { 'aria-label': 'Checkbox demo' } }} defaultChecked />
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default EditPage;
