import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { Suspense, useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Field } from '../../../../shared/types';
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
import { SortableFieldList } from './SortableFieldList';

const EditPage: React.FC = () => {
  const [state, setState] = useState(false);
  const [menu, setMenu] = useState(null);
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [sortableFields, setSortableFields] = useState([]);

  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { localizedLabel } = useDocumentInfo();
  const { getCollection, updateCollection, getFields } = useCollection();
  const { data: meta } = getCollection(id, { suspense: true });
  const { data: fields, mutate } = getFields(meta.collection, { suspense: true });
  const { trigger, isMutating } = updateCollection(id);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      hidden: Boolean(meta.hidden),
      singleton: Boolean(meta.singleton),
      statusField: meta.statusField || '',
      draftValue: meta.draftValue || '',
      publishValue: meta.publishValue || '',
      unpublishValue: meta.unpublishValue || '',
    },
    resolver: yupResolver(updateCollectionSchema()),
  });

  useEffect(() => {
    if (fields && fields.length) {
      setSortableFields(fields);
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

  const changeItems = (items: Field[]) => {
    setSortableFields(items);
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
            <Stack gap={1}>
              <SortableFieldList
                items={sortableFields}
                onChange={changeItems}
                renderItem={(item) => (
                  <SortableFieldList.Item id={item.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <SortableFieldList.DragHandle />
                      <Box sx={{ flexGrow: 1 }}>{item.field}</Box>
                      {!item.hidden && (
                        <SortableFieldList.ItemMenu
                          onClickItem={(e) => openMenu(e.currentTarget, item.id)}
                        />
                      )}
                    </Box>
                  </SortableFieldList.Item>
                )}
              />
            </Stack>
            <Button
              variant="contained"
              onClick={() => onToggleCreateField(true)}
              size="large"
              fullWidth
              sx={{ mt: 2 }}
            >
              {t('add_field')}
            </Button>
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
            <InputLabel>{t('public_status_field')}</InputLabel>
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
          <Grid xs={1}>
            <InputLabel>{t('draft')}</InputLabel>
            <Controller
              name="draftValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  error={errors.draftValue !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.draftValue?.message}</FormHelperText>
          </Grid>
        </Grid>
        <Grid container spacing={3} columns={{ xs: 1, md: 4 }}>
          <Grid xs={1}>
            <InputLabel>{t('published')}</InputLabel>
            <Controller
              name="publishValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  error={errors.draftValue !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.publishValue?.message}</FormHelperText>
          </Grid>
          <Grid xs={1}>
            <InputLabel>{t('unpublished')}</InputLabel>
            <Controller
              name="unpublishValue"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  fullWidth
                  error={errors.draftValue !== undefined}
                />
              )}
            />
            <FormHelperText error>{errors.unpublishValue?.message}</FormHelperText>
          </Grid>
        </Grid>
      </Stack>
    </Suspense>
  );
};

export default ComposeWrapper({ context: CollectionContextProvider })(EditPage);
