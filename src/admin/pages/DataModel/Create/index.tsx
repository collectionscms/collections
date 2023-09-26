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
import { MainCard } from '@collectionscms/plugin-ui';
import { logger } from '../../../../utilities/logger.js';
import { ConfirmDiscardDialog } from '../../../components/elements/ConfirmDiscardDialog/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import {
  FormValues,
  createModel as createModelSchema,
} from '../../../fields/schemas/models/createModel.js';
import { useUnsavedChangesPrompt } from '../../../hooks/useUnsavedChangesPrompt.js';
import { ModelContextProvider, useModel } from '../Context/index.js';

const CreateDataModelPageImpl: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { enqueueSnackbar } = useSnackbar();
  const { createModel } = useModel();
  const { trigger, isMutating } = createModel;
  const {
    reset,
    control,
    handleSubmit,
    formState: { isDirty, errors },
  } = useForm<FormValues>({
    defaultValues: { model: '', singleton: false, status: false },
    resolver: yupResolver(createModelSchema(t)),
  });
  const { showPrompt, proceed, stay } = useUnsavedChangesPrompt(isDirty);

  const navigateToList = () => {
    navigate('../models');
  };

  const onSubmit: SubmitHandler<FormValues> = async (form: FormValues) => {
    try {
      reset(form);
      const id = await trigger({
        ...form,
        hidden: false,
        status_field: null,
        draft_value: null,
        publish_value: null,
        archive_value: null,
      });
      enqueueSnackbar(t('toast.created_successfully'), { variant: 'success' });
      navigate(`../models/${id.toString()}`);
    } catch (e) {
      logger.error(e);
    }
  };

  return (
    <>
      <ConfirmDiscardDialog open={showPrompt} onDiscard={proceed} onKeepEditing={stay} />
      <Grid container spacing={2.5}>
        <Grid xs={12} lg={8}>
          <MainCard>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel required>{t('name')}</InputLabel>
                    <Controller
                      name="model"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="text"
                          fullWidth
                          error={errors.model !== undefined}
                        />
                      )}
                    />
                    <FormHelperText error>{errors.model?.message}</FormHelperText>
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
    </>
  );
};

export const CreateDataModelPage = ComposeWrapper({ context: ModelContextProvider })(
  CreateDataModelPageImpl
);
