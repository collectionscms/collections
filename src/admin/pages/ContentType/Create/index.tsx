import ComposeWrapper from '@admin/components/utilities/ComposeWrapper';
import { useDocumentInfo } from '@admin/components/utilities/DocumentInfo';
import createCollectionSchema, {
  FormValues,
} from '@admin/fields/schemas/collections/createCollection';
import { CollectionContextProvider, useCollection } from '@admin/stores/Collection';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { localizedLabel } = useDocumentInfo();
  const { createCollection } = useCollection();
  const { enqueueSnackbar } = useSnackbar();
  const { data, trigger, isMutating } = createCollection;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: '', singleton: false },
    resolver: yupResolver(createCollectionSchema),
  });

  useEffect(() => {
    if (data === undefined) return;
    enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
    navigate(`../content-types/${data.id}`);
  }, [data]);

  const onSubmit: SubmitHandler<FormValues> = (form: FormValues) => {
    trigger({ collection: form.name, singleton: form.singleton, hidden: false });
  };

  return (
    <Stack component="form" onSubmit={handleSubmit(onSubmit)} rowGap={3}>
      <Grid container spacing={2}>
        <Grid xs>
          <h1>{localizedLabel}</h1>
        </Grid>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid>
            <Button variant="contained" type="submit" disabled={isMutating}>
              {t('create_new')}
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3} xs={12} xl={6}>
        <Grid xs={12} md={6}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                required
                {...field}
                variant="filled"
                type="text"
                fullWidth
                label={t('name')}
                error={errors.name !== undefined}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <Box>
            <Controller
              name="singleton"
              control={control}
              render={({ field }) => (
                <FormControlLabel {...field} label={'Singleton'} control={<Checkbox />} />
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ComposeWrapper({ context: CollectionContextProvider })(CreatePage);
