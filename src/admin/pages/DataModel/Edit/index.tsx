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
import { MainCard } from '@collectionscms/plugin-ui';
import { logger } from '../../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { DeleteButton } from '../../../components/elements/DeleteButton/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { Field } from '../../../config/types.js';
import {
  FormValues,
  updateModel as updateModelSchema,
} from '../../../fields/schemas/models/updateModel.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { ModelContextProvider, useModel } from '../Context/index.js';
import { CreateField } from './CreateField/index.js';
import { EditField } from './EditField/index.js';
import { EditMenu } from './Menu/index.js';
import { SortableFieldList } from './SortableFieldList/index.js';

const EditDataModelPageImpl: React.FC = () => {
  const { modelId } = useParams();
  if (!modelId) throw new Error('modelId is not defined');

  const { t } = useTranslation();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { getModel, updateModel, getFields, updateFields } = useModel();
  const { data: metaModel } = getModel(modelId);
  const { data: fields, mutate } = getFields(modelId);
  const { trigger, isMutating } = updateModel(metaModel.id.toString());
  const { trigger: updateFieldsTrigger } = updateFields();

  const [createFieldOpen, setCreateFieldOpen] = useState(false);
  const [editFieldOpen, setEditFieldOpen] = useState(false);
  const [menu, setMenu] = useState<EventTarget | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [sortableFields, setSortableFields] = useState<Field[]>(fields);

  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: {
      hidden: Boolean(metaModel.hidden),
      singleton: Boolean(metaModel.singleton),
      status_field: metaModel.status_field || '',
      draft_value: metaModel.draft_value || '',
      publish_value: metaModel.publish_value || '',
      archive_value: metaModel.archive_value || '',
    },
    resolver: yupResolver(updateModelSchema()),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  useEffect(() => {
    setSortableFields(fields);
  }, [fields]);

  const onToggleCreateField = (state: boolean) => {
    setCreateFieldOpen(state);
  };

  const navigateToList = () => {
    navigate('../models');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      await trigger(form);
      enqueueSnackbar(t('toast.updated_successfully'), { variant: 'success' });
      navigate('../models');
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
    const editedFields = fields.map((f) => (f.id === field.id ? field : f));
    mutate(editedFields);
    setEditFieldOpen(false);
  };

  const handleDeleteFieldSuccess = () => {
    const deletedFields = fields.filter((f) => f.id !== selectedField?.id);
    mutate(deletedFields);
    onCloseMenu();
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <CreateField
        model={metaModel}
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
            modelId={metaModel.id.toString()}
            menu={menu}
            onEdit={() => handleEditField(true)}
            onSuccess={handleDeleteFieldSuccess}
            onClose={onCloseMenu}
          />
        </>
      )}
      <Grid container spacing={2.5} sx={{ mb: 1 }}>
        <Grid xs={12} lg={8}>
          <MainCard title={t('fields_and_layout')} subheader={t('auto_save')}>
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
                          <Box sx={{ flexGrow: 1, paddingLeft: 1 }}>{item.field}</Box>
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
                    <InputLabel>{t('status')}</InputLabel>
                    <Controller
                      name="hidden"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          {...field}
                          label={t('hidden_on_detail')}
                          control={<Checkbox checked={field.value} />}
                        />
                      )}
                    />
                  </Stack>
                </Grid>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel>{t('content_data_type')}</InputLabel>
                    <Controller
                      name="singleton"
                      control={control}
                      render={({ field }) => (
                        <FormControlLabel
                          {...field}
                          label={t('treat_single_object')}
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
                    <DeleteButton
                      id={metaModel.id.toString()}
                      slug="models"
                      onSuccess={navigateToList}
                    />
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

export const EditDataModelPage = ComposeWrapper({ context: ModelContextProvider })(
  EditDataModelPageImpl
);
