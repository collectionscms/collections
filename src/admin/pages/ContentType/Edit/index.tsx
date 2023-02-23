import HeaderDeleteButton from '@admin/components/elements/DeleteHeaderButton';
import Loading from '@admin/components/elements/Loading';
import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import updateCollectionSchema, {
  FormValues,
} from '@admin/fields/schemas/collections/updateCollection';
import { CollectionContextProvider, useCollection } from '@admin/pages/ContentType/Context';
import { yupResolver } from '@hookform/resolvers/yup';
import { MoreVertOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { Field } from '@shared/types';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import CreateField from './CreateField';
import EditMenu from './Menu';

const EditPage: React.FC = () => {
  const [state, setState] = useState(false);
  const [menu, setMenu] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { localizedLabel } = useDocumentInfo();
  const { getCollection, updateCollection, getFields } = useCollection();
  const { data: meta } = getCollection(id, { suspense: true });
  const { data: fields, mutate } = getFields(meta.collection, { suspense: true });
  const { data, trigger, isMutating } = updateCollection(id);
  const {
    control,
    handleSubmit,
    formState: {},
  } = useForm<FormValues>({
    defaultValues: { hidden: Boolean(meta.hidden), singleton: Boolean(meta.singleton) },
    resolver: yupResolver(updateCollectionSchema()),
  });

  const openMenu = (currentTarget: EventTarget, id: number) => {
    setSelectedFieldId(id);
    setMenu(currentTarget);
  };
  const closeMenu = () => setMenu(null);

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    trigger({ singleton: form.singleton, hidden: form.hidden });
  };

  const onToggleCreateField = (state: boolean) => {
    setState(state);
  };

  const handleDeletionSuccess = () => {
    navigate(`../content-types`);
  };

  const handleCreateFieldSuccess = (_: Field) => {
    setState(false);
  };

  const handleDeleteFieldSuccess = () => {
    mutate(fields.filter((field) => field.id !== selectedFieldId));
    closeMenu();
  };

  useEffect(() => {
    if (data === undefined) return;
    enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
    navigate('../content-types');
  }, [data]);

  return (
    <Suspense fallback={<Loading />}>
      <CreateField
        slug={meta.collection}
        openState={state}
        onSuccess={(field) => handleCreateFieldSuccess(field)}
        onClose={() => onToggleCreateField(false)}
      />
      <EditMenu
        id={selectedFieldId}
        collectionId={id}
        menu={menu}
        onSuccess={() => handleDeleteFieldSuccess()}
        onClose={() => closeMenu()}
      />
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
        <Grid container spacing={2}>
          <Grid xs>
            <h1>{localizedLabel}</h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            <Grid>
              <HeaderDeleteButton id={id} slug={`collections`} onSuccess={handleDeletionSuccess} />
            </Grid>
            <Grid>
              <Button variant="contained" type="submit" disabled={isMutating}>
                {t('update')}
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid container gap={2} columns={{ xs: 1, md: 2 }}>
          <Grid xs={1}>
            <Stack gap={2}>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableBody>
                    {fields.map((field) => {
                      return (
                        <TableRow
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          key={field.field}
                        >
                          <TableCell component="th" scope="row" sx={{ py: 0 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <p>{field.field}</p>
                              {!field.hidden && (
                                <MoreVertOutlined
                                  onClick={(e) => openMenu(e.currentTarget, field.id)}
                                  sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                                />
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="contained"
                onClick={() => onToggleCreateField(true)}
                sx={{ width: '100%' }}
              >
                {t('add_field')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1}>
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
          <Grid xs={1}>
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
