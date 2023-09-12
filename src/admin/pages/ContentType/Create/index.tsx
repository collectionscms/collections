import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  Stack,
  TextField,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MainCard } from 'superfast-ui';
import { logger } from '../../../../utilities/logger.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  createCollection as createCollectionSchema,
} from '../../../fields/schemas/collections/createCollection.js';
import { CollectionContextProvider, useCollection } from '../Context/index.js';

const CreateContentTypePageImpl: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();
  const { createCollection } = useCollection();
  const { trigger, isMutating } = createCollection;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { collection: '', singleton: false, status: false },
    resolver: yupResolver(createCollectionSchema(t)),
  });

  const navigateToList = () => {
    navigate('../content-types');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      await trigger({
        ...form,
        hidden: false,
        status_field: null,
        draft_value: null,
        publish_value: null,
        archive_value: null,
      });
      enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
      navigate(`../content-types/${form.collection}`);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <Grid container spacing={2.5}>
      <Grid xs={12} lg={8}>
        <MainCard>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel required>{t('name')}</InputLabel>
                  <Controller
                    name="collection"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="text"
                        fullWidth
                        error={errors.collection !== undefined}
                      />
                    )}
                  />
                  <FormHelperText error>{errors.collection?.message}</FormHelperText>
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
                        control={<Checkbox />}
                      />
                    )}
                  />
                  <FormHelperText error>{errors.singleton?.message}</FormHelperText>
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Stack spacing={2}>
                  <Divider />
                  <FormLabel>{t('optional_system_fields')}</FormLabel>
                </Stack>
              </Grid>
              <Grid xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel>{t('public_status')}</InputLabel>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel {...field} label={t('valid')} control={<Checkbox />} />
                    )}
                  />
                  <FormHelperText error>{errors.status?.message}</FormHelperText>
                </Stack>
              </Grid>
              <Grid xs={12}>
                <Stack direction="row" justifyContent="flex-end" spacing={1}>
                  <Button variant="outlined" color="secondary" onClick={navigateToList}>
                    {t('cancel')}
                  </Button>
                  <Button variant="contained" type="submit" disabled={isMutating}>
                    {t('save')}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </form>
        </MainCard>
      </Grid>
    </Grid>
  );
};

export const CreateContentTypePage = ComposeWrapper({ context: CollectionContextProvider })(
  CreateContentTypePageImpl
);
