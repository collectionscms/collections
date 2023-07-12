import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MainCard } from 'superfast-ui';
import { Collection, Field } from '../../../../config/types.js';
import { logger } from '../../../../utilities/logger.js';
import { DeleteButton } from '../../../components/elements/DeleteButton/index.js';
import { Loading } from '../../../components/elements/Loading/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  updateCollection as updateCollectionSchema,
} from '../../../fields/schemas/collections/updateCollection.js';
import { CollectionContextProvider, useCollection } from '../Context/index.js';
import { CreateField } from './CreateField/index.js';
import { EditField } from './EditField/index.js';
import { EditMenu } from './Menu/index.js';
import { SortableFieldList } from './SortableFieldList/index.js';

const EditContentTypePageImpl: React.FC = () => {
  const [createFieldOpen, setCreateFieldOpen] = useState(false);
  const [editFieldOpen, setEditFieldOpen] = useState(false);
  const [menu, setMenu] = useState<EventTarget | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [sortableFields, setSortableFields] = useState<Field[]>([]);

  const { id } = useParams();
  if (!id) throw new Error('id is not defined');

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { getCollection, updateCollection, getFields, updateFields } = useCollection();
  const { data: meta, trigger: getCollectionTrigger } = getCollection(id);
  const { data: fields = [], mutate } = getFields(meta?.collection || null);
  const { trigger, isMutating } = updateCollection(id);
  const { trigger: updateFieldsTrigger } = updateFields();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(updateCollectionSchema()),
  });

  useEffect(() => {
    const getCollection = async () => {
      try {
        const collection = await getCollectionTrigger();
        if (collection) {
          setDefaultValue(collection);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getCollection();
  }, []);

  const setDefaultValue = (collection: Collection) => {
    setValue('hidden', Boolean(collection.hidden));
    setValue('singleton', Boolean(collection.singleton));
    setValue('status_field', collection.status_field || '');
    setValue('draft_value', collection.draft_value || '');
    setValue('publish_value', collection.publish_value || '');
    setValue('archive_value', collection.archive_value || '');
  };

  useEffect(() => {
    if (fields && fields.length) {
      setSortableFields(fields);
    }
  }, [fields]);

  const onToggleCreateField = (state: boolean) => {
    setCreateFieldOpen(state);
  };

  const navigateToList = () => {
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

  const handleCreateFieldSuccess = (field: Field) => {
    setCreateFieldOpen(false);
    fields.push(field);
    mutate(fields);
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
    mutate(fields.filter((field) => field.id !== selectedField?.id));
    onCloseMenu();
  };

  if (!meta || !fields) {
    return <Loading />;
  }

  return (
    <>
      <CreateField
        collection={meta.collection}
        openState={createFieldOpen}
        onSuccess={(field) => handleCreateFieldSuccess(field)}
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
      <Grid container spacing={2.5} sx={{ mb: 1 }}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <Grid container gap={2} columns={{ xs: 1, md: 2 }}>
              <Grid xs={12}>
                <Stack spacing={1}>
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
          </MainCard>
        </Grid>
      </Grid>
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
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
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
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
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <FormLabel>{t('public_status')}</FormLabel>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('public_status_field')}</InputLabel>
                    <Controller
                      name="status_field"
                      control={control}
                      defaultValue={''}
                      render={({ field }) => (
                        <Select
                          {...field}
                          fullWidth
                          defaultValue={''}
                          error={errors.status_field !== undefined}
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
                    <FormHelperText error>{errors.status_field?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('draft')}</InputLabel>
                    <Controller
                      name="draft_value"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.draft_value !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.draft_value?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('published')}</InputLabel>
                    <Controller
                      name="publish_value"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.publish_value !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.publish_value?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('archived')}</InputLabel>
                    <Controller
                      name="archive_value"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.archive_value !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.archive_value?.message}</FormHelperText>
                  </Stack>
                </Grid>
                <Grid xs={12}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: 1 }}
                  >
                    <DeleteButton id={id} slug="collections" onSuccess={navigateToList} />
                    <Stack direction="row" spacing={1}>
                      <Button variant="outlined" color="secondary" onClick={navigateToList}>
                        {t('cancel')}
                      </Button>
                      <Button variant="contained" type="submit" disabled={isMutating}>
                        {t('update')}
                      </Button>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </form>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export const EditContentTypePage = ComposeWrapper({ context: CollectionContextProvider })(
  EditContentTypePageImpl
);
