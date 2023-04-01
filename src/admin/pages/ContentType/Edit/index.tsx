import { yupResolver } from '@hookform/resolvers/yup';
import { MoreVertOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Choice } from 'shared/types';
import logger from '../../../../utilities/logger';
import HeaderDeleteButton from '../../../components/elements/DeleteHeaderButton';
import Loading from '../../../components/elements/Loading';
import ComposeWrapper from '../../../components/utilities/ComposeWrapper';
import { useDocumentInfo } from '../../../components/utilities/DocumentInfo';
import updateCollectionSchema, {
  FormValues,
} from '../../../fields/schemas/collections/updateCollection';
import { CollectionContextProvider, useCollection } from '../Context';
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
  const { trigger, isMutating } = updateCollection(id);

  // Get the choice object for a given status value.
  const getChoice = (statusField: string, statusValue: string): Choice | null => {
    const field = fields.filter((field) => field.field === statusField)[0];
    return field
      ? field.fieldOption.choices.filter((choice) => choice.value === statusValue)[0]
      : null;
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      hidden: Boolean(meta.hidden),
      singleton: Boolean(meta.singleton),
      status: meta.statusField !== null ? true : false,
      statusField: meta.statusField || '',
      draftLabel: 'Draft',
      draftValue: 'draft',
      closeLabel: 'Close',
      closeValue: 'closed',
      publishLabel: 'Publish',
      publishValue: 'published',
    },
    resolver: yupResolver(updateCollectionSchema()),
  });
  const statusEnabled = watch('status');

  useEffect(() => {
    if (fields === undefined) return;
    const draft = getChoice(meta.statusField, meta.draftValue);
    if (draft) {
      setValue('draftLabel', draft.label);
      setValue('draftValue', draft.value);
    }

    const publish = getChoice(meta.statusField, meta.publishValue);
    if (publish) {
      setValue('publishLabel', publish.label);
      setValue('publishValue', publish.value);
    }

    const close = getChoice(meta.statusField, meta.closeValue);
    if (close) {
      setValue('closeLabel', close.label);
      setValue('closeValue', close.value);
    }
  }, [fields]);

  const openMenu = (currentTarget: EventTarget, id: number) => {
    setSelectedFieldId(id);
    setMenu(currentTarget);
  };
  const closeMenu = () => setMenu(null);

  const onToggleCreateField = (state: boolean) => {
    setState(state);
  };

  const handleDeletionSuccess = () => {
    navigate(`../content-types`);
  };

  const handleCreateFieldSuccess = () => {
    setState(false);
  };

  const handleDeleteFieldSuccess = () => {
    mutate(fields.filter((field) => field.id !== selectedFieldId));
    closeMenu();
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      navigate('../content-types');
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <CreateField
        slug={meta.collection}
        openState={state}
        onSuccess={() => handleCreateFieldSuccess()}
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
              <HeaderDeleteButton id={id} slug="collections" onSuccess={handleDeletionSuccess} />
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
            <Stack gap={3}>
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
                              {!field.readonly && (
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
              <Button variant="contained" onClick={() => onToggleCreateField(true)} size="large">
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
                    label="Hidden"
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
                    label="Singleton"
                    control={<Checkbox checked={field.value} />}
                  />
                )}
              />
            </Box>
          </Grid>
        </Grid>
        <Typography variant="h6">{t('public_status')}</Typography>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1}>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  label={t('valid')}
                  control={<Checkbox checked={field.value} />}
                />
              )}
            />
          </Grid>
          {statusEnabled && (
            <Grid xs={1}>
              <InputLabel required>{t('public_status_field')}</InputLabel>
              <Controller
                name="statusField"
                control={control}
                defaultValue={''}
                render={({ field }) => (
                  <Select
                    name="statusField"
                    {...field}
                    fullWidth
                    defaultValue={''}
                    error={errors.statusField !== undefined}
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {fields
                      .filter((field) => !field.readonly)
                      .map((field) => (
                        <MenuItem value={field.field} key={field.id}>
                          {field.field}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              <FormHelperText error>{errors.statusField?.message}</FormHelperText>
            </Grid>
          )}
        </Grid>
        {statusEnabled && (
          <>
            <Stack rowGap={1}>
              <Typography variant="caption">{t('draft_status')}</Typography>
              <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
                <Grid xs={1}>
                  <InputLabel required>{t('value')}</InputLabel>
                  <Controller
                    name="draftValue"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        disabled={!statusEnabled}
                        error={errors.draftValue !== undefined}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={1}>
                  <InputLabel required>{t('label')}</InputLabel>
                  <Controller
                    name="draftLabel"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        disabled={!statusEnabled}
                        error={errors.draftLabel !== undefined}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack rowGap={1}>
              <Typography variant="caption">{t('publish_status')}</Typography>
              <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
                <Grid xs={1}>
                  <InputLabel required>{t('value')}</InputLabel>
                  <Controller
                    name="publishValue"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        disabled={!statusEnabled}
                        error={errors.publishValue !== undefined}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={1}>
                  <InputLabel required>{t('label')}</InputLabel>
                  <Controller
                    name="publishLabel"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        disabled={!statusEnabled}
                        error={errors.publishLabel !== undefined}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
            <Stack rowGap={1}>
              <Typography variant="caption">{t('close_status')}</Typography>
              <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
                <Grid xs={1}>
                  <InputLabel required>{t('value')}</InputLabel>
                  <Controller
                    name="closeValue"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        disabled={!statusEnabled}
                        error={errors.closeValue !== undefined}
                      />
                    )}
                  />
                </Grid>
                <Grid xs={1}>
                  <InputLabel required>{t('label')}</InputLabel>
                  <Controller
                    name="closeLabel"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        disabled={!statusEnabled}
                        error={errors.closeLabel !== undefined}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Stack>
          </>
        )}
      </Stack>
    </Suspense>
  );
};

export default ComposeWrapper({ context: CollectionContextProvider })(EditPage);
