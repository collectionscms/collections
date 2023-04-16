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
import DeleteHeaderButton from '../../../components/elements/DeleteHeaderButton';
import Loading from '../../../components/elements/Loading';
import ComposeWrapper from '../../../components/utilities/ComposeWrapper';
import { useDocumentInfo } from '../../../components/utilities/DocumentInfo';
import updateCollectionSchema, {
  FormValues,
} from '../../../fields/schemas/collections/updateCollection';
import { CollectionContextProvider, useCollection } from '../Context';
import CreateField from './CreateField';
import EditField from './EditField';
import EditMenu from './Menu';
import { SortableFieldList } from './SortableFieldList';

const EditPage: React.FC = () => {
  const [createFieldOpen, setCreateFieldOpen] = useState(false);
  const [editFieldOpen, setEditFieldOpen] = useState(false);
  const [menu, setMenu] = useState(null);
  const [selectedField, setSelectedField] = useState<Field>(null);
  const [sortableFields, setSortableFields] = useState<Field[]>([]);

  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { localizedLabel } = useDocumentInfo();
  const { getCollection, updateCollection, getFields, updateFields } = useCollection();
  const { data: meta } = getCollection(id, { suspense: true });
  const { data: fields, mutate } = getFields(meta.collection, { suspense: true });
  const { trigger, isMutating } = updateCollection(id);
  const { trigger: updateFieldsTrigger } = updateFields();
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
      archiveValue: meta.archiveValue || '',
    },
    resolver: yupResolver(updateCollectionSchema()),
  });

  useEffect(() => {
    if (fields && fields.length) {
      setSortableFields(fields);
    }
  }, [fields]);

  const onToggleCreateField = (state: boolean) => {
    setCreateFieldOpen(state);
  };

  const handleDeletionSuccess = () => {
    navigate(`../content-types`);
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

  // The user changes the order of the sortable items.
  const handleChangeSortableItems = async (items: Field[]) => {
    setSortableFields(items);

    const sortOrders = items.map((item, i) => ({
      id: item.id,
      sort: i,
    }));

    try {
      await updateFieldsTrigger(sortOrders);
    } catch (e) {
      logger.error(e);
    }
  };

  // /////////////////////////////////////
  // Create Field
  // /////////////////////////////////////

  const handleCreateFieldSuccess = () => {
    setCreateFieldOpen(false);
  };

  // /////////////////////////////////////
  // Edit Field
  // /////////////////////////////////////

  const onOpenMenu = (currentTarget: EventTarget, field: Field) => {
    setSelectedField(field);
    setMenu(currentTarget);
  };

  const onCloseMenu = () => setMenu(null);

  const handleEditField = (open: boolean) => {
    setEditFieldOpen(open);
  };

  const handleEditFieldSuccess = (field: Field) => {
    setEditFieldOpen(false);
    mutate(fields.map((f) => (f.id === field.id ? field : f)));
  };

  const handleDeleteFieldSuccess = () => {
    mutate(fields.filter((field) => field.id !== selectedField.id));
    onCloseMenu();
  };

  return (
    <Suspense fallback={<Loading />}>
      <CreateField
        slug={meta.collection}
        openState={createFieldOpen}
        onSuccess={handleCreateFieldSuccess}
        onClose={() => onToggleCreateField(false)}
      />
      {selectedField && (
        <>
          <EditField
            field={selectedField}
            open={editFieldOpen}
            onSuccess={handleEditFieldSuccess}
            onClose={() => handleEditField(false)}
          />
          <EditMenu
            id={selectedField.id.toString()}
            collectionId={id}
            menu={menu}
            onEdit={() => handleEditField(true)}
            onSuccess={handleDeleteFieldSuccess}
            onClose={onCloseMenu}
          />
        </>
      )}
      <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
        <Grid container spacing={2}>
          <Grid xs>
            <h1>{localizedLabel}</h1>
          </Grid>
          <Grid container columnSpacing={2} alignItems="center">
            <Grid>
              <DeleteHeaderButton id={id} slug="collections" onSuccess={handleDeletionSuccess} />
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
                onChange={handleChangeSortableItems}
                renderItem={(item) => (
                  <SortableFieldList.Item id={item.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <SortableFieldList.DragHandle />
                      <Box sx={{ flexGrow: 1 }}>{item.field}</Box>
                      {item.field !== 'id' && (
                        <SortableFieldList.ItemMenu
                          onClickItem={(e) => onOpenMenu(e.currentTarget, item)}
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
            <InputLabel>{t('archived')}</InputLabel>
            <Controller
              name="archiveValue"
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
            <FormHelperText error>{errors.archiveValue?.message}</FormHelperText>
          </Grid>
        </Grid>
      </Stack>
    </Suspense>
  );
};

export default ComposeWrapper({ context: CollectionContextProvider })(EditPage);
