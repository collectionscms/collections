import DeleteDocument from '@admin/components/elements/DeleteDocument';
import Loading from '@admin/components/elements/Loading';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import updateCollectionSchema, {
  FormValues,
} from '@admin/fields/schemas/collections/updateCollection';
import { CollectionContextProvider, useCollection } from '@admin/stores/Collection';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
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
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const EditPage: React.FC = () => {
  const [state, setState] = useState(false);
  const { id } = useParams();
  const theme = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { localizedLabel } = useDocumentInfo();
  const { getCollection, updateCollection } = useCollection();
  const { data: meta, error } = getCollection(id, { suspense: true });
  const { data, trigger, isMutating } = updateCollection(id);
  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm<FormValues>({
    defaultValues: { hidden: Boolean(meta.hidden), singleton: Boolean(meta.singleton) },
    resolver: yupResolver(updateCollectionSchema()),
  });

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

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    trigger({ singleton: form.singleton, hidden: form.hidden });
  };

  useEffect(() => {
    if (data === undefined) return;
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    navigate('../content-types');
  }, [data]);

  return (
    <Suspense fallback={<Loading />}>
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
        <Grid container spacing={2}>
          <Grid xs>
            <h1>{localizedLabel}</h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            <Grid>
              <DeleteDocument id={id} slug={`collections`} onSuccess={handleDeletionSuccess} />
            </Grid>
            <Grid>
              <Button variant="contained" type="submit" disabled={isMutating}>
                {t('update')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container xs={12} xl={6}>
          <Grid xs={12}>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableBody>
                  {meta.fields.map((field) => {
                    return (
                      <TableRow
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        key={field.field}
                      >
                        <TableCell component="th" scope="row">
                          <span>{field.field}</span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Drawer
              anchor="right"
              open={state}
              onClose={toggleDrawer(false)}
              sx={{ zIndex: theme.zIndex.appBar + 200 }}
            >
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
            </Drawer>
            <Button
              variant="contained"
              onClick={toggleDrawer(true)}
              sx={{ width: '100%', mt: '12px' }}
            >
              {t('create_field')}
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3} xs={12} xl={6}>
          <Grid xs={12} md={6}>
            <Box>
              <Controller
                name="hidden"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    label={'Hidden'}
                    control={<Checkbox checked={field.value} />}
                  />
                )}
              />
            </Box>
          </Grid>
          <Grid xs={12} md={6}>
            <Box>
              <Controller
                name="singleton"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    {...field}
                    label={'Singleton'}
                    control={<Checkbox checked={field.value} />}
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Suspense>
  );
};

export default ComposeWrapper({ context: CollectionContextProvider })(EditPage);
